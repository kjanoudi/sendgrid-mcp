# SendGrid MCP Server

A Model Context Protocol (MCP) server that provides access to SendGrid's Marketing API for email marketing and contact management. https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api

## Features

- Send individual and bulk emails using SendGrid's latest Marketing API
- Manage contacts and contact lists
- Create and manage email templates
- Track email statistics and validate email addresses
- Full support for Single Sends (new Marketing Campaigns API)
- Suppression group management
- Verified sender management

## Available Tools

### Contact Management
- `list_contacts`: List all contacts in your account
- `add_contact`: Add a new contact with optional first/last name
- `delete_contacts`: Delete contacts by email addresses
- `get_contacts_by_list`: Get all contacts in a specific list

### List Management
- `list_contact_lists`: List all contact lists
- `create_contact_list`: Create a new contact list
- `delete_list`: Delete a contact list
- `add_contacts_to_list`: Add contacts to an existing list

### Email Sending
- `send_email`: Send a single email to one recipient
- `send_to_list`: Send an email to a contact list using Single Sends
- `list_single_sends`: List all single send emails
- `get_single_send`: Get details of a specific single send

### Template Management
- `create_template`: Create a new email template
- `list_templates`: List all email templates
- `get_template`: Get details of a specific template

### Utility Tools
- `validate_email`: Validate an email address
- `get_stats`: Get email statistics (opens, clicks, etc.)
- `list_verified_senders`: List all verified sender identities
- `list_suppression_groups`: List all unsubscribe groups

## Installation

```bash
git clone https://github.com/Garoth/sendgrid-mcp-server.git
npm install
```

## Configuration

1. Get your SendGrid API key:
   - Log in to your SendGrid account
   - Go to Settings > API Keys
   - Create a new API key with full access permissions
   - Save the API key securely as it won't be shown again

2. Add it to your Cline MCP settings file inside VSCode's settings (ex. ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json):

```json
{
  "mcpServers": {
    "sendgrid": {
      "command": "node",
      "args": ["/path/to/sendgrid-mcp-server/build/index.js"],
      "env": {
        "SENDGRID_API_KEY": "your-api-key-here"
      },
      "disabled": false,
      "autoApprove": [
        "list_contacts",
        "list_contact_lists",
        "list_templates",
        "list_single_sends",
        "get_single_send",
        "list_verified_senders",
        "list_suppression_groups",
        "get_stats",
        "validate_email"
      ]
    }
  }
}
```

Note: Tools that modify data (like sending emails or deleting contacts) are intentionally excluded from autoApprove for safety.

## Development

### Setting Up Tests

The tests use real API calls to ensure accurate responses. To run the tests:

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your SendGrid API key:
   ```
   SENDGRID_API_KEY=your-api-key-here
   ```
   Note: The `.env` file is gitignored to prevent committing sensitive information.

3. Run the tests:
   ```bash
   npm test
   ```

### Building

```bash
npm run build
```

## Important Notes

- This server uses SendGrid's new Marketing API with Single Sends for bulk email sending. Legacy campaign functionality has been removed as per SendGrid's recommendations.
- When sending emails to lists, you must provide either a suppression_group_id or custom_unsubscribe_url to comply with email regulations. The tools can look up your suppression groups automatically
- Sender email addresses must be verified with SendGrid before they can be used to send emails. The tools are able to look up the verified senders available

## License

MIT
