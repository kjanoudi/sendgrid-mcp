#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key from environment variable
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}
sgMail.setApiKey(SENDGRID_API_KEY);

const server = new Server(
  {
    name: "sendgrid-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes a "send_email" tool that lets clients send emails via SendGrid.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "send_email",
        description: "Send an email using SendGrid",
        inputSchema: {
          type: "object",
          properties: {
            to: {
              type: "string",
              description: "Recipient email address"
            },
            subject: {
              type: "string",
              description: "Email subject line"
            },
            text: {
              type: "string",
              description: "Plain text content of the email"
            },
            html: {
              type: "string",
              description: "HTML content of the email (optional)",
            },
            from: {
              type: "string",
              description: "Sender email address (must be verified with SendGrid)",
            }
          },
          required: ["to", "subject", "text", "from"]
        }
      }
    ]
  };
});

/**
 * Handler for the send_email tool.
 * Sends an email using SendGrid with the provided parameters.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "send_email") {
    throw new McpError(ErrorCode.MethodNotFound, "Unknown tool");
  }

  const { to, subject, text, html, from } = request.params.arguments as {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from: string;
  };

  try {
    const msg = {
      to,
      from,
      subject,
      text,
      html: html || text, // Use text as HTML if no HTML provided
    };

    await sgMail.send(msg);

    return {
      content: [{
        type: "text",
        text: `Email sent successfully to ${to}`
      }]
    };
  } catch (error: any) {
    console.error('SendGrid Error:', error);
    if (error.response && error.response.body && Array.isArray(error.response.body.errors)) {
      throw new McpError(
        ErrorCode.InternalError,
        `SendGrid API Error: ${error.response.body.errors.map((e: { message: string }) => e.message).join(', ')}`
      );
    }
    throw new McpError(ErrorCode.InternalError, 'Failed to send email');
  }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SendGrid MCP server running on stdio');
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
