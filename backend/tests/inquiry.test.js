const request = require('supertest');
const app = require('../server'); 

describe('Coffee Ninja Backend API Tests', () => {
  it('should respond to base health check or inquiries endpoint', async () => {
    const res = await request(app).get('/api/inquiries');
    
    expect([200, 401]).toContain(res.statusCode);
  });
});