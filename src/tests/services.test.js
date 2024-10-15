const { Profile, Contract, Job } = require('../../src/models');
const profileService = require('../../src/services/profile');
const jobService = require('../../src/services/job');
const contractService = require('../../src/services/contract');
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


describe('ProfileService', () => {
  test('depositMoney should increase balance', async () => {
    const updatedProfile = await profileService.depositMoney(2, 100);
    expect(updatedProfile.balance).toBe(2100);
  });

  test('depositMoney should throw error if deposit exceeds limit', async () => {
    await expect(profileService.depositMoney(2, 10000)).rejects.toThrow();
  });
});

describe('JobService', () => {
  test('getUnpaidJobs should return unpaid jobs', async () => {
    const unpaidJobs = await jobService.getUnpaidJobs(2);
    expect(unpaidJobs.length).toBe(1);
  });

  test('payForJob should mark job as paid', async () => {
    const paidJob = await jobService.payForJob(1, 2);
    expect(paidJob.paid).toBe(true);
  });
});

describe('ContractService', () => {
  test('getNonTerminatedContracts should return non-terminated contracts', async () => {
    const contracts = await contractService.getNonTerminatedContracts(2);
    expect(contracts.length).toBe(1);
  });
});