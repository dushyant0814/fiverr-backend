const BaseService = require('./baseService');
const { Profile, Job, Contract } = require('../models');
const { Op, Transaction } = require('sequelize');
const logger = require('../utils/logger');
const { API_ERROR } = require('../constants/error');

class ProfileService extends BaseService {
    constructor() {
        super(Profile);
    }
    // in progress, available
    //t1, t2
    // read uncommited - dirty read
    // read
    // t1, t2
    // in progress, avilable 
    // repeatable read, t2 , 
    // serilizable read => (1, 5000)=> avg salary =>
    // create targets
    // new relic, sentry
    // idempotency => 
    // /api/v1/service: target 
    // pay, idem
    // depositmoney
    // key, processed, failed
    // exponential backoff, t, t+2+jitter , t+4 
    async depositMoney(clientId, amount) {
        // t1, t2
        const result = await this.repository.sequelize.transaction(async (t) => {
            const client = await this.get(
                { id: clientId, type: 'client' },
                { 
                    lock: Transaction.LOCK.UPDATE,
                    transaction: t 
                }
            );

            if (!client) {
                throw new Error(API_ERROR.PROFILE.CLIENT_NOT_FOUND);
            }

            const totalJobsToPay = await Job.sum('price', {
                include: [{
                    model: Contract,
                    // required: false,
                    where: { status: 'in_progress', ClientId: clientId },
                    attributes: []
                }],
                where: {
                    paid: { [Op.not]: true }
                },
                transaction: t
            });

            if (amount > totalJobsToPay * 0.25) {
                throw new Error(API_ERROR.PROFILE.DEPOSIT_AMOUNT_EXCEEDED);
            }
            
            await client.increment('balance', { 
                by: amount,
                transaction: t
            });

            // Refresh the client instance to get the updated balance
            await client.reload({ transaction: t });
            
            return client;
        });

        return result;
    }
}

module.exports = new ProfileService();