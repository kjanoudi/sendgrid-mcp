import { jest } from '@jest/globals';
import { SendGridService } from '../sendgrid.js';

describe('SendGridService Integration Tests', () => {
  let service: SendGridService;
  
  beforeEach(() => {
    service = new SendGridService(process.env.SENDGRID_API_KEY!);
  });

  // Increase timeout for API calls
  jest.setTimeout(60000);

  describe('Contact Management', () => {
    let createdListId: string;

    afterAll(async () => {
      if (createdListId) {
        try {
          await service.deleteList(createdListId);
          
          // Wait a moment for deletion to process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Verify list is deleted by trying to fetch it
          try {
            await service.getList(createdListId);
            throw new Error('List was not deleted');
          } catch (error: any) {
            // Expect 404 error since list should be deleted
            expect(error.code).toBe(404);
          }
        } catch (error) {
          console.error('Error cleaning up test list:', error);
          throw error;
        }
      }
    });

    it('should create a list and add a contact', async () => {
      // Create a unique list name using timestamp
      const listName = `Test List ${new Date().getTime()}`;
      
      // Create the list
      const list = await service.createList(listName);
      createdListId = list.id;
      expect(list).toBeDefined();
      expect(list.name).toBe(listName);
      expect(list.id).toBeDefined();
      
      // Add a contact to the list
      const contact = {
        email: `test${new Date().getTime()}@example.com`,
        first_name: 'Test',
        last_name: 'User'
      };
      
      // Add contact and wait a moment for it to process
      const addContactResponse = await service.addContact(contact);
      expect(addContactResponse).toBeDefined();
      
      // Wait longer for the contact to be processed
      await new Promise(resolve => setTimeout(resolve, 15000));
      
      // Add contact to list
      const addToListResponse = await service.addContactsToList(list.id, [contact.email]);
      expect(addToListResponse).toBeDefined();
      
      // Retry a few times to verify the contact was added
      let foundContact;
      for (let i = 0; i < 3; i++) {
        // Wait between retries
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check for the contact
        const contacts = await service.getContactsByList(list.id);
        expect(contacts).toBeDefined();
        expect(contacts.length).toBeGreaterThan(0);
        
        // Try to find our contact
        foundContact = contacts.find(c => c.email === contact.email);
        if (foundContact) break;
      }
      
      expect(foundContact).toBeDefined();
      expect(foundContact?.email).toBe(contact.email);
    });
  });

  describe('Template Management', () => {
    let testTemplateId: string;
    let testVersionId: string;

    afterAll(async () => {
      if (testTemplateId) {
        try {
          await service.deleteTemplate(testTemplateId);
        } catch (error) {
          console.error('Error cleaning up test template:', error);
        }
      }
    });

    it('should create a template', async () => {
      const templateName = `Test Template ${new Date().getTime()}`;
      
      const template = await service.createTemplate({
        name: templateName,
        generation: 'dynamic'
      });
      
      testTemplateId = template.id;
      expect(template).toBeDefined();
      expect(template.id).toBeDefined();
      expect(template.name).toBe(templateName);
      expect(template.generation).toBe('dynamic');
    });

    it('should update a template name', async () => {
      const newName = `Updated Template ${new Date().getTime()}`;
      
      const updatedTemplate = await service.updateTemplate(testTemplateId, {
        name: newName
      });
      
      expect(updatedTemplate).toBeDefined();
      expect(updatedTemplate.name).toBe(newName);
    });

    it('should duplicate a template', async () => {
      const duplicateName = `Duplicate Template ${new Date().getTime()}`;
      
      const duplicatedTemplate = await service.duplicateTemplate(testTemplateId, {
        name: duplicateName
      });
      
      expect(duplicatedTemplate).toBeDefined();
      expect(duplicatedTemplate.id).toBeDefined();
      expect(duplicatedTemplate.id).not.toBe(testTemplateId);
      expect(duplicatedTemplate.name).toBe(duplicateName);
      
      // Clean up duplicated template
      await service.deleteTemplate(duplicatedTemplate.id);
    });

    it('should list templates with pagination', async () => {
      const templateResponse = await service.listTemplates({
        generations: 'dynamic',
        page_size: 10
      });
      
      expect(templateResponse).toBeDefined();
      expect(Array.isArray(templateResponse.result)).toBe(true);
      expect(templateResponse._metadata).toBeDefined();
    });

    it('should create a template version', async () => {
      const versionName = `Test Version ${new Date().getTime()}`;
      
      const version = await service.createTemplateVersion(testTemplateId, {
        name: versionName,
        subject: 'Test Subject {{name}}',
        html_content: '<h1>Hello {{name}}</h1>',
        plain_content: 'Hello {{name}}',
        active: 1,
        generate_plain_content: false
      });
      
      testVersionId = version.id;
      expect(version).toBeDefined();
      expect(version.id).toBeDefined();
      expect(version.name).toBe(versionName);
      expect(version.subject).toBe('Test Subject {{name}}');
      expect(version.active).toBe(1);
    });

    it('should get a template version', async () => {
      const version = await service.getTemplateVersion(testTemplateId, testVersionId);
      
      expect(version).toBeDefined();
      expect(version.id).toBe(testVersionId);
      expect(version.template_id).toBe(testTemplateId);
    });

    it('should update a template version', async () => {
      const updatedSubject = 'Updated Subject {{name}}';
      
      const updatedVersion = await service.updateTemplateVersion(testTemplateId, testVersionId, {
        name: `Updated Version ${new Date().getTime()}`,
        subject: updatedSubject,
        html_content: '<h1>Updated Hello {{name}}</h1>',
        plain_content: 'Updated Hello {{name}}'
      });
      
      expect(updatedVersion).toBeDefined();
      expect(updatedVersion.subject).toBe(updatedSubject);
    });

    it('should activate a template version', async () => {
      // Create a second version
      const newVersion = await service.createTemplateVersion(testTemplateId, {
        name: `Version 2 ${new Date().getTime()}`,
        subject: 'Version 2 Subject',
        html_content: '<h1>Version 2</h1>',
        plain_content: 'Version 2',
        active: 0
      });
      
      // Activate the new version
      const activatedVersion = await service.activateTemplateVersion(testTemplateId, newVersion.id);
      
      expect(activatedVersion).toBeDefined();
      expect(activatedVersion.active).toBe(1);
      
      // Clean up
      await service.deleteTemplateVersion(testTemplateId, newVersion.id);
    });

    it('should delete a template version', async () => {
      // Create a version to delete
      const versionToDelete = await service.createTemplateVersion(testTemplateId, {
        name: `Delete Me ${new Date().getTime()}`,
        subject: 'Delete Me',
        html_content: '<h1>Delete Me</h1>',
        plain_content: 'Delete Me'
      });
      
      // Delete the version
      await service.deleteTemplateVersion(testTemplateId, versionToDelete.id);
      
      // Verify it's deleted by trying to get it
      try {
        await service.getTemplateVersion(testTemplateId, versionToDelete.id);
        throw new Error('Version was not deleted');
      } catch (error: any) {
        // Expect 404 error since version should be deleted
        expect(error.code).toBe(404);
      }
    });

    it('should get a template by ID', async () => {
      const template = await service.getTemplate(testTemplateId);
      
      expect(template).toBeDefined();
      expect(template.id).toBe(testTemplateId);
      expect(template.versions).toBeDefined();
      expect(Array.isArray(template.versions)).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should retrieve email statistics', async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      
      const stats = await service.getStats({
        start_date: startDate.toISOString().split('T')[0],
        aggregated_by: 'day'
      });
      
      expect(Array.isArray(stats)).toBe(true);
      if (stats.length > 0) {
        expect(stats[0]).toHaveProperty('date');
        expect(stats[0]).toHaveProperty('stats');
        expect(Array.isArray(stats[0].stats)).toBe(true);
        if (stats[0].stats.length > 0) {
          expect(stats[0].stats[0]).toHaveProperty('metrics');
          expect(stats[0].stats[0].metrics).toHaveProperty('opens');
          expect(stats[0].stats[0].metrics).toHaveProperty('clicks');
        }
      }
    });
  });
});
