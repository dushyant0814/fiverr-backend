const { Job, Contract, Profile } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

class AdminService {
    async getBestProfession(start, end) {
        const result = await Job.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'total_earned'],
                [sequelize.col('Contract.Contractor.profession'), 'profession']
            ],
            include: [{
                model: Contract,
                attributes: [],
                include: [{
                    model: Profile,
                    as: 'Contractor',
                    attributes: []
                }]
            }],
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [new Date(start), new Date(end)]
                }
            },
            group: ['Contract.Contractor.profession'],
            order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
            limit: 1,
            subQuery: false,
            raw: true
        });

        return result[0];
    }

    async getBestClients(start, end, limit = 2) {
        return Job.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'paid'],
                [sequelize.col('Contract.Client.id'), 'id'],
                [sequelize.fn('CONCAT', sequelize.col('Contract.Client.firstName'), ' ', sequelize.col('Contract.Client.lastName')), 'fullName']
            ],
            include: [{
                model: Contract,
                attributes: [],
                include: [{
                    model: Profile,
                    as: 'Client',
                    attributes: []
                }]
            }],
            where: {
                paid: true,
                paymentDate: {
                    [Op.between]: [new Date(start), new Date(end)]
                }
            },
            group: ['Contract.Client.id'],
            order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
            limit: parseInt(limit),
            subQuery: false,
            raw: true
        });
    }
}

module.exports = new AdminService();