// Common interfaces for SendGrid API responses and requests

export interface SendGridContact {
  email: string;
  first_name?: string;
  last_name?: string;
  custom_fields?: Record<string, any>;
}

export interface SendGridList {
  id: string;
  name: string;
  contact_count: number;
}

export interface SendGridTemplate {
  id: string;
  name: string;
  generation: string;
  updated_at: string;
  versions: SendGridTemplateVersion[];
}

export interface SendGridTemplateVersion {
  id: string;
  template_id: string;
  active: number;
  name: string;
  html_content: string;
  plain_content: string;
  subject: string;
}

export interface SendGridCampaign {
  id: string;
  title: string;
  status: string;
  categories: string[];
  send_at?: string;
}

export interface SendGridStats {
  date: string;
  stats: Array<{
    metrics: {
      opens: number;
      clicks: number;
      bounces: number;
      spam_reports: number;
      unique_opens: number;
      unique_clicks: number;
      blocks: number;
      delivered: number;
    };
  }>;
}
