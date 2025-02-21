import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';

describe('Checklist API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new checklist', async () => {
    const response = await request(app)
      .post('/api/checklists')
      .send({
        title: 'Test Checklist',
        description: 'Test Description'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title');
  });
}); 