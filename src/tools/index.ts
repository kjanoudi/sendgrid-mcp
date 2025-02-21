import { SendGridService } from '../services/sendgrid.js';
import { SendGridContact, SendGridTemplate, SendGridCampaign } from '../types/index.js';

export const getToolDefinitions = (service: SendGridService) => [
  {
    name: 'send_email',
    description: 'Send an email using SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address'
        },
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        text: {
          type: 'string',
          description: 'Plain text content of the email'
        },
        html: {
          type: 'string',
          description: 'HTML content of the email (optional)'
        },
        from: {
          type: 'string',
          description: 'Sender email address (must be verified with SendGrid)'
        },
        template_id: {
          type: 'string',
          description: 'SendGrid template ID (optional)'
        },
        dynamic_template_data: {
          type: 'object',
          description: 'Dynamic data for template variables (optional)'
        }
      },
      required: ['to', 'subject', 'text', 'from']
    }
  },
  {
    name: 'add_contact',
    description: 'Add a contact to your SendGrid marketing contacts',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Contact email address'
        },
        first_name: {
          type: 'string',
          description: 'Contact first name (optional)'
        },
        last_name: {
          type: 'string',
          description: 'Contact last name (optional)'
        },
        custom_fields: {
          type: 'object',
          description: 'Custom field values (optional)'
        }
      },
      required: ['email']
    }
  },
  {
    name: 'create_contact_list',
    description: 'Create a new contact list in SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the contact list'
        }
      },
      required: ['name']
    }
  },
  {
    name: 'add_contacts_to_list',
    description: 'Add contacts to an existing SendGrid list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list'
        },
        emails: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of email addresses to add to the list'
        }
      },
      required: ['list_id', 'emails']
    }
  },
  {
    name: 'create_template',
    description: 'Create a new email template in SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the template'
        },
        subject: {
          type: 'string',
          description: 'Default subject line for the template'
        },
        html_content: {
          type: 'string',
          description: 'HTML content of the template'
        },
        plain_content: {
          type: 'string',
          description: 'Plain text content of the template'
        }
      },
      required: ['name', 'subject', 'html_content', 'plain_content']
    }
  },
  {
    name: 'get_template',
    description: 'Retrieve a SendGrid template by ID',
    inputSchema: {
      type: 'object',
      properties: {
        template_id: {
          type: 'string',
          description: 'ID of the template to retrieve'
        }
      },
      required: ['template_id']
    }
  },
  {
    name: 'create_campaign',
    description: 'Create a new email campaign in SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the campaign'
        },
        subject: {
          type: 'string',
          description: 'Subject line for campaign emails'
        },
        sender_id: {
          type: 'number',
          description: 'ID of the sender identity'
        },
        list_ids: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Array of list IDs to send the campaign to'
        },
        template_id: {
          type: 'string',
          description: 'ID of the template to use (optional)'
        },
        html_content: {
          type: 'string',
          description: 'HTML content if not using a template (optional)'
        },
        plain_content: {
          type: 'string',
          description: 'Plain text content if not using a template (optional)'
        }
      },
      required: ['title', 'subject', 'sender_id', 'list_ids']
    }
  },
  {
    name: 'schedule_campaign',
    description: 'Schedule a campaign for future sending',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: {
          type: 'string',
          description: 'ID of the campaign to schedule'
        },
        send_at: {
          type: 'string',
          description: 'ISO 8601 timestamp for when to send the campaign'
        }
      },
      required: ['campaign_id', 'send_at']
    }
  },
  {
    name: 'validate_email',
    description: 'Validate an email address using SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email address to validate'
        }
      },
      required: ['email']
    }
  },
  {
    name: 'get_stats',
    description: 'Get SendGrid email statistics',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date in YYYY-MM-DD format'
        },
        end_date: {
          type: 'string',
          description: 'End date in YYYY-MM-DD format (optional)'
        },
        aggregated_by: {
          type: 'string',
          enum: ['day', 'week', 'month'],
          description: 'How to aggregate the statistics (optional)'
        }
      },
      required: ['start_date']
    }
  },
  {
    name: 'get_campaign_stats',
    description: 'Get statistics for a specific campaign',
    inputSchema: {
      type: 'object',
      properties: {
        campaign_id: {
          type: 'string',
          description: 'ID of the campaign'
        }
      },
      required: ['campaign_id']
    }
  },
  {
    name: 'list_templates',
    description: 'List all email templates in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'delete_list',
    description: 'Delete a contact list from SendGrid',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list to delete'
        }
      },
      required: ['list_id']
    }
  },
  {
    name: 'list_contact_lists',
    description: 'List all contact lists in your SendGrid account',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'get_contacts_by_list',
    description: 'Get all contacts in a SendGrid list',
    inputSchema: {
      type: 'object',
      properties: {
        list_id: {
          type: 'string',
          description: 'ID of the contact list'
        }
      },
      required: ['list_id']
    }
  }
];

export const handleToolCall = async (service: SendGridService, name: string, args: any) => {
  switch (name) {
    case 'send_email':
      await service.sendEmail(args);
      return { content: [{ type: 'text', text: `Email sent successfully to ${args.to}` }] };

    case 'add_contact':
      await service.addContact(args as SendGridContact);
      return { content: [{ type: 'text', text: `Contact ${args.email} added successfully` }] };

    case 'create_contact_list':
      const list = await service.createList(args.name);
      return { content: [{ type: 'text', text: `Contact list "${args.name}" created with ID: ${list.id}` }] };

    case 'add_contacts_to_list':
      await service.addContactsToList(args.list_id, args.emails);
      return { content: [{ type: 'text', text: `Added ${args.emails.length} contacts to list ${args.list_id}` }] };

    case 'create_template':
      const template = await service.createTemplate(args);
      return { content: [{ type: 'text', text: `Template "${args.name}" created with ID: ${template.id}` }] };

    case 'get_template':
      const retrievedTemplate = await service.getTemplate(args.template_id);
      return { content: [{ type: 'text', text: JSON.stringify(retrievedTemplate, null, 2) }] };

    case 'create_campaign':
      const campaign = await service.createCampaign(args);
      return { content: [{ type: 'text', text: `Campaign "${args.title}" created with ID: ${campaign.id}` }] };

    case 'schedule_campaign':
      await service.scheduleCampaign(args.campaign_id, new Date(args.send_at));
      return { content: [{ type: 'text', text: `Campaign ${args.campaign_id} scheduled for ${args.send_at}` }] };

    case 'validate_email':
      const validation = await service.validateEmail(args.email);
      return { content: [{ type: 'text', text: JSON.stringify(validation, null, 2) }] };

    case 'get_stats':
      const stats = await service.getStats(args);
      return { content: [{ type: 'text', text: JSON.stringify(stats, null, 2) }] };

    case 'get_campaign_stats':
      const campaignStats = await service.getCampaignStats(args.campaign_id);
      return { content: [{ type: 'text', text: JSON.stringify(campaignStats, null, 2) }] };

    case 'list_templates':
      const templates = await service.listTemplates();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(templates.map(t => ({
            id: t.id,
            name: t.name,
            generation: t.generation,
            updated_at: t.updated_at,
            versions: t.versions.length
          })), null, 2)
        }]
      };

    case 'delete_list':
      await service.deleteList(args.list_id);
      return { content: [{ type: 'text', text: `Contact list ${args.list_id} deleted successfully` }] };

    case 'list_contact_lists':
      const lists = await service.listContactLists();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(lists.map(l => ({
            id: l.id,
            name: l.name,
            contact_count: l.contact_count
          })), null, 2)
        }]
      };

    case 'get_contacts_by_list':
      const contacts = await service.getContactsByList(args.list_id);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(contacts.map(c => ({
            email: c.email,
            first_name: c.first_name,
            last_name: c.last_name
          })), null, 2)
        }]
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
};
