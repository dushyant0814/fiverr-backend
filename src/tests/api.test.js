const request = require('supertest');
const app = require('../../src/app');
const { Profile, Contract, Job } = require('../../src/models');
const { sequelize } = require('../../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  // Seed test data
  await seedTestData();
});

afterAll(async () => {
  await sequelize.close();
});

const seedTestData = async () => {
  // Create test profiles, contracts, and jobs here
  // This is a simplified version of your seed data
  await Profile.create({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    profession: 'Developer',
    balance: 1000,
    type: 'contractor'
  });

  await Profile.create({
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    profession: 'Manager',
    balance: 2000,
    type: 'client'
  });

  await Contract.create({
    id: 1,
    terms: 'Test contract',
    status: 'in_progress',
    ClientId: 2,
    ContractorId: 1
  });

  await Job.create({
    id: 1,
    description: 'Test job',
    price: 500,
    paid: false,
    ContractId: 1
  });
};

describe('Profile API', () => {
  test('GET /profiles/:id should return a profile', async () => {
    const res = await request(app)
      .get('/profiles/1')
      .set('profile_id', '1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.firstName).toBe('John');
  });

  test('POST /profiles/balances/deposit/:id should deposit money', async () => {
    const res = await request(app)
      .post('/profiles/balances/deposit/2')
      .set('profile_id', '2')
      .send({ amount: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.balance).toBe(2100);
  });
});

describe('Job API', () => {
  test('GET /jobs/unpaid should return unpaid jobs', async () => {
    const res = await request(app)
      .get('/jobs/unpaid')
      .set('profile_id', '2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  test('POST /jobs/:job_id/pay should pay for a job', async () => {
    const res = await request(app)
      .post('/jobs/1/pay')
      .set('profile_id', '2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.paid).toBe(true);
  });
});

describe('Contract API', () => {
  test('GET /contracts/:id should return a contract', async () => {
    const res = await request(app)
      .get('/contracts/1')
      .set('profile_id', '2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.terms).toBe('Test contract');
  });

  test('GET /contracts should return non-terminated contracts', async () => {
    const res = await request(app)
      .get('/contracts')
      .set('profile_id', '2');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });
});

describe('Admin API', () => {
  test('GET /admin/best-profession should return the best profession', async () => {
    const res = await request(app)
      .get('/admin/best-profession?start=2020-01-01&end=2020-12-31')
      .set('profile_id', '1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  test('GET /admin/best-clients should return the best clients', async () => {
    const res = await request(app)
      .get('/admin/best-clients?start=2020-01-01&end=2020-12-31&limit=2')
      .set('profile_id', '1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });
});



// describe('JOB API', ()=> {
//   test(' create job api /job/', async()=> {
//     const res = await request(app)
//       .post('/job')
//       .set({'profile_id': 2})
//       .send({description: 'some description', price: 122, ContractId: 1})
//     expect(res.statusCode).toBe(200)
//     expect(res.body.data.price).toBe(122)
//   })
// }) 