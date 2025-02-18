# SendGrid MCP Server

A Model Context Protocol server for sending emails using SendGrid.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Get your SendGrid API Key:
- Sign up for a SendGrid account at https://signup.sendgrid.com/
- Create an API key at https://app.sendgrid.com/settings/api_keys
- Verify your sender email address at https://app.sendgrid.com/settings/sender_auth/senders

3. Add the server to your Cline MCP settings (usually at `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "sendgrid": {
      "command": "node",
      "args": ["/absolute/path/to/sendgrid-mcp-server/build/index.js"],
      "env": {
        "SENDGRID_API_KEY": "your-sendgrid-api-key"
      }
    }
  }
}
```

4. Build the server:
```bash
npm run build
```

## Usage

The server provides a single tool `send_email` with the following parameters:

- `to`: Recipient email address
- `from`: Sender email address (must be verified with SendGrid)
- `subject`: Email subject line
- `text`: Plain text content of the email
- `html`: (Optional) HTML content of the email

### Example Usage in Cline

```
Send an email to example@email.com with the subject "Hello" and content "This is a test email"
```

Cline will use the `send_email` tool with appropriate parameters:

```json
{
  "to": "example@email.com",
  "from": "your-verified@email.com",
  "subject": "Hello",
  "text": "This is a test email"
}
```

## Development

To run the server in watch mode during development:
```bash
npm run watch
```

## Error Handling

The server handles common SendGrid API errors and provides meaningful error messages. If an error occurs, it will be returned with details about what went wrong (e.g., invalid email address, authentication failure, etc.).

## Security Considerations

- Never commit your SendGrid API key to version control
- Always use environment variables for sensitive credentials
- Verify sender email addresses with SendGrid before using them
- Consider implementing rate limiting for production use
