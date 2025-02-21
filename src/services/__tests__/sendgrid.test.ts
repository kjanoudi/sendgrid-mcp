import { jest } from '@jest/globals';
import { SendGridService } from '../sendgrid.js';

describe('SendGridService Integration Tests', () => {
  let service: SendGridService;
  
  beforeEach(() => {
    service = new SendGridService(process.env.SENDGRID_API_KEY!);
  });

  // Increase timeout for API calls
  jest.setTimeout(30000);

  describe('listTemplates', () => {
    it('should return an array of templates', async () => {
      const templates = await service.listTemplates();
      
      expect(Array.isArray(templates)).toBe(true);
      if (templates.length > 0) {
        expect(templates[0]).toHaveProperty('id');
        expect(templates[0]).toHaveProperty('name');
        expect(templates[0]).toHaveProperty('generation');
      }
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
