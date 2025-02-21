import { Client } from '@sendgrid/client';
import sgMail from '@sendgrid/mail';
import { SendGridContact, SendGridList, SendGridTemplate, SendGridCampaign, SendGridStats } from '../types/index.js';

export class SendGridService {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client();
    this.client.setApiKey(apiKey);
    sgMail.setApiKey(apiKey);
  }

  // Email Sending
  async sendEmail(params: {
    to: string;
    from: string;
    subject: string;
    text: string;
    html?: string;
    template_id?: string;
    dynamic_template_data?: Record<string, any>;
  }) {
    return await sgMail.send(params);
  }

  // Contact Management
  async deleteContactsByEmails(emails: string[]): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: '/v3/marketing/contacts',
      body: {
        emails: emails
      }
    });
  }

  async listAllContacts(): Promise<SendGridContact[]> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: "email IS NOT NULL" // Get all contacts that have an email
      }
    });
    return (response.body as { result: SendGridContact[] }).result || [];
  }

  async addContact(contact: SendGridContact) {
    const [response] = await this.client.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        contacts: [contact]
      }
    });
    return response;
  }

  async getContactsByList(listId: string): Promise<SendGridContact[]> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/contacts/search',
      body: {
        query: `CONTAINS(list_ids, '${listId}')`
      }
    });
    return (response.body as { result: SendGridContact[] }).result || [];
  }

  async getList(listId: string): Promise<SendGridList> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/lists/${listId}`
    });
    return response.body as SendGridList;
  }

  async listContactLists(): Promise<SendGridList[]> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/marketing/lists'
    });
    return (response.body as { result: SendGridList[] }).result;
  }

  async deleteList(listId: string): Promise<void> {
    await this.client.request({
      method: 'DELETE',
      url: `/v3/marketing/lists/${listId}`
    });
  }

  async createList(name: string): Promise<SendGridList> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/lists',
      body: { name }
    });
    return response.body as SendGridList;
  }

  async addContactsToList(listId: string, contactEmails: string[]) {
    const [response] = await this.client.request({
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        list_ids: [listId],
        contacts: contactEmails.map(email => ({ email }))
      }
    });
    return response;
  }

  // Template Management
  async createTemplate(params: {
    name: string;
    html_content: string;
    plain_content: string;
    subject: string;
  }): Promise<SendGridTemplate> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/templates',
      body: {
        name: params.name,
        generation: 'dynamic'
      }
    });

    const templateId = (response.body as { id: string }).id;
    
    // Create the first version of the template
    const [versionResponse] = await this.client.request({
      method: 'POST',
      url: `/v3/templates/${templateId}/versions`,
      body: {
        template_id: templateId,
        name: `${params.name} v1`,
        subject: params.subject,
        html_content: params.html_content,
        plain_content: params.plain_content,
        active: 1
      }
    });

    return {
      id: templateId,
      name: params.name,
      generation: 'dynamic',
      updated_at: new Date().toISOString(),
      versions: [{
        id: (versionResponse.body as { id: string }).id,
        template_id: templateId,
        active: 1,
        name: `${params.name} v1`,
        html_content: params.html_content,
        plain_content: params.plain_content,
        subject: params.subject
      }]
    };
  }

  async listTemplates(): Promise<SendGridTemplate[]> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/templates'
    });
    return ((response.body as { templates: SendGridTemplate[] }).templates || []);
  }

  async getTemplate(templateId: string): Promise<SendGridTemplate> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/templates/${templateId}`
    });
    return response.body as SendGridTemplate;
  }

  // Campaign Management
  async createCampaign(params: {
    title: string;
    subject: string;
    sender_id: number;
    list_ids: string[];
    html_content?: string;
    plain_content?: string;
    template_id?: string;
  }): Promise<SendGridCampaign> {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/marketing/campaigns',
      body: params
    });
    return response.body as SendGridCampaign;
  }

  async scheduleCampaign(campaignId: string, sendAt: Date) {
    const [response] = await this.client.request({
      method: 'PUT',
      url: `/v3/marketing/campaigns/${campaignId}/schedule`,
      body: {
        send_at: sendAt.toISOString()
      }
    });
    return response;
  }

  // Email Validation
  async validateEmail(email: string) {
    const [response] = await this.client.request({
      method: 'POST',
      url: '/v3/validations/email',
      body: { email }
    });
    return response.body;
  }

  // Statistics
  async getStats(params: {
    start_date: string;
    end_date?: string;
    aggregated_by?: 'day' | 'week' | 'month';
  }): Promise<SendGridStats> {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/stats',
      qs: params
    });
    return response.body as SendGridStats;
  }

  async getCampaignStats(campaignId: string): Promise<SendGridStats> {
    const [response] = await this.client.request({
      method: 'GET',
      url: `/v3/marketing/campaigns/${campaignId}/stats`
    });
    return response.body as SendGridStats;
  }

  // Verified Senders
  async getVerifiedSenders() {
    const [response] = await this.client.request({
      method: 'GET',
      url: '/v3/verified_senders'
    });
    return response.body;
  }
}
