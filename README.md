# SendGrid MCP Server

A Model Context Protocol (MCP) server that provides access to SendGrid's Marketing API for email marketing and contact management. https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api

## Important Note on API Support

This server exclusively supports SendGrid's v3 APIs and does not provide support for legacy functionality. This includes:

- Dynamic templates only - legacy templates are not supported
- Marketing API v3 for all contact & contact list operations
- Single Sends API for bulk email sending

## Available Tools

### Contact Management

#### list_contacts
Lists all contacts in your SendGrid account.
```typescript
// No parameters required
```

#### add_contact
Add a contact to your SendGrid marketing contacts.
```typescript
{
  email: string;           // Required: Contact email address
  first_name?: string;     // Optional: Contact first name
  last_name?: string;      // Optional: Contact last name
  custom_fields?: object;  // Optional: Custom field values
}
```

#### delete_contacts
Delete contacts from your SendGrid account.
```typescript
{
  emails: string[];  // Required: Array of email addresses to delete
}
```

#### get_contacts_by_list
Get all contacts in a SendGrid list.
```typescript
{
  list_id: string;  // Required: ID of the contact list
}
```

### List Management

#### list_contact_lists
List all contact lists in your SendGrid account.
```typescript
// No parameters required
```

#### create_contact_list
Create a new contact list in SendGrid.
```typescript
{
  name: string;  // Required: Name of the contact list
}
```

#### delete_list
Delete a contact list from SendGrid.
```typescript
{
  list_id: string;  // Required: ID of the contact list to delete
}
```

#### add_contacts_to_list
Add contacts to an existing SendGrid list.
```typescript
{
  list_id: string;    // Required: ID of the contact list
  emails: string[];   // Required: Array of email addresses to add
}
```

#### remove_contacts_from_list
Remove contacts from a SendGrid list without deleting them.
```typescript
{
  list_id: string;    // Required: ID of the contact list
  emails: string[];   // Required: Array of email addresses to remove
}
```

### Email Sending

#### send_email
Send an email using SendGrid.
```typescript
{
  to: string;                             // Required: Recipient email address
  subject: string;                        // Required: Email subject line
  text: string;                          // Required: Plain text content
  from: string;                          // Required: Verified sender email address
  html?: string;                         // Optional: HTML content
  template_id?: string;                  // Optional: Dynamic template ID
  dynamic_template_data?: object;        // Optional: Template variables
}
```

#### send_to_list
Send an email to a contact list using SendGrid Single Sends.
```typescript
{
  name: string;                          // Required: Name of the single send
  list_ids: string[];                    // Required: Array of list IDs to send to
  subject: string;                       // Required: Email subject line
  html_content: string;                  // Required: HTML content
  plain_content: string;                 // Required: Plain text content
  sender_id: number;                     // Required: ID of the verified sender
  suppression_group_id?: number;         // Required if custom_unsubscribe_url not provided
  custom_unsubscribe_url?: string;       // Required if suppression_group_id not provided
}
```

### Template Management (Dynamic Templates Only)

#### create_template
Create a new dynamic email template.
```typescript
{
  name: string;           // Required: Name of the template
  subject: string;        // Required: Default subject line
  html_content: string;   // Required: HTML content with handlebars syntax
  plain_content: string;  // Required: Plain text content with handlebars syntax
}
```

#### list_templates
List all dynamic email templates.
```typescript
// No parameters required
```

#### get_template
Retrieve a template by ID.
```typescript
{
  template_id: string;  // Required: ID of the template to retrieve
}
```

#### delete_template
Delete a dynamic template.
```typescript
{
  template_id: string;  // Required: ID of the template to delete
}
```

### Analytics and Validation

#### get_stats
Get SendGrid email statistics.
```typescript
{
  start_date: string;                          // Required: Start date (YYYY-MM-DD)
  end_date?: string;                           // Optional: End date (YYYY-MM-DD)
  aggregated_by?: 'day' | 'week' | 'month';    // Optional: Aggregation period
}
```

#### validate_email
Validate an email address using SendGrid.
```typescript
{
  email: string;  // Required: Email address to validate
}
```

### Account Management

#### list_verified_senders
List all verified sender identities.
```typescript
// No parameters required
```

#### list_suppression_groups
List all unsubscribe groups.
```typescript
// No parameters required
```

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

- When sending emails to lists, you must provide either a suppression_group_id or custom_unsubscribe_url to comply with email regulations
- Sender email addresses must be verified with SendGrid before they can be used to send emails
- All templates are created as dynamic templates with support for handlebars syntax (e.g., {{variable_name}})
- The Single Sends API is used for all bulk email operations as it provides better tracking and management capabilities

## License

MIT
