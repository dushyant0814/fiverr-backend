const BaseService = require('./baseService');
const { Job, Contract, Profile } = require('../models');
const { Op, Transaction } = require('sequelize');
const { API_ERROR } = require('../constants/error');

class JobService extends BaseService {
    constructor() {
        super(Job);
    }

    async getUnpaidJobs(profileId) {
        return this.list({
            paid: { [Op.not]: true },
            '$Contract.status$': 'in_progress',
            [Op.or]: [
                { '$Contract.ContractorId$': profileId },
                { '$Contract.ClientId$': profileId }
            ]
        }, {
            include: [{
                model: Contract,
                attributes: []
            }]
        });
    }

    async payForJob(jobId, clientId) {
        const result = await this.repository.sequelize.transaction(async (t) => {
            const job = await this.get({
                id: jobId,
                paid: { [Op.not]: true },
                '$Contract.status$': 'in_progress',
                '$Contract.ClientId$': clientId
            }, {
                include: [{
                    model: Contract,
                    include: ['Contractor']
                }],
                lock: Transaction.LOCK.UPDATE,
                transaction: t
            });

            if (!job) throw new Error(API_ERROR.PAYMENT.JOB_NOT_FOUND_OR_ALREADY_PAID);

            const client = await Profile.findByPk(clientId, { 
                lock: Transaction.LOCK.UPDATE,
                transaction: t 
            });

            if (client.balance < job.price) {
                throw new Error(API_ERROR.PAYMENT.INSUFFICIENT_BALANCE);
            }

            // Update client balance
            await client.decrement('balance', { 
                by: job.price, 
                transaction: t 
            });

            // Update contractor balance
            await job.Contract.Contractor.increment('balance', { 
                by: job.price, 
                transaction: t 
            });

            // Update job as paid
            job.paid = true;
            job.paymentDate = new Date();
            await job.save({ transaction: t });

            return job;
        });

        return result;
    }
}

module.exports = new JobService();