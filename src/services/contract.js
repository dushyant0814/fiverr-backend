const BaseService = require('./baseService');
const { Contract } = require('../models');
const { Op } = require('sequelize');

class ContractService extends BaseService {
    constructor() {
        super(Contract);
    }

    async getContractById(id, profileId) {
        return this.get({
            id,
            [Op.or]: [
                { ContractorId: profileId },
                { ClientId: profileId }
            ]
        });
    }

    async getNonTerminatedContracts(profileId) {
        return this.list({
            status: { [Op.ne]: 'terminated' },
            [Op.or]: [
                { ContractorId: profileId },
                { ClientId: profileId }
            ]
        });
    }
}

module.exports = new ContractService();