const request = require('supertest');
const app = require('../app'); 

describe('GET /', () => {
  it('responds with index.html content', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('<h1>Hello World!</h1>'); // Check for a unique piece of the HTML content
  });
});

describe('POST /echo', () => {
  it('echoes the message', async () => {
    const message = 'Hello testing';
    const response = await request(app)
      .post('/echo')
      .send({ message });

    expect(response.statusCode).toBe(200);
    expect(response.body.echo).toBe(message);
  });
});

describe('GET /add/:num1/:num2', () => {
  it('responds with the sum of two numbers', async () => {
    const response = await request(app).get('/add/5/10');
    expect(response.statusCode).toBe(200);
    expect(response.body.sum).toBe(15);
  });

  it('handles invalid numbers', async () => {
    const response = await request(app).get('/add/foo/bar');
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe('Bad request');
  });
});

afterAll((done) => {
  const server = require('../server'); 
  server.close(done);
});





