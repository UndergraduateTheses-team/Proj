const request = require('supertest');
const app = require('./index'); // Adjust path to your API-Server entry file

describe('API Server Tests', () => {
  it('should return 200 on GET /api/status', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('should handle error on invalid route', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
  });
});