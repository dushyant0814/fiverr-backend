const { Op } = require('sequelize');
const logger = require('../utils/logger');

class BaseService {
    constructor(repository) {
        this.repository = repository;
    }

    async create(payload) {
        try {
            return await this.repository.create(payload);
        } catch (error) {
            logger.error('create_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }

    async bulkCreate(payload) {
        try {
            return await this.repository.bulkCreate(payload);
        } catch (error) {
            logger.error('bulk_create_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }

    async update(query, payload, options = {}) {
        try {
            const [affectedCount, affectedRows] = await this.repository.update(payload, {
                where: query,
                returning: true,
                ...options
            });
    
            if (affectedCount === 0) {
                logger.warn(`No entities found to update with query: ${JSON.stringify(query)}`);
                return null;
            }
    
            return affectedRows[0];
        } catch (error) {
            logger.error('Update entity error:', { error: error.message, stack: error.stack, query, payload });
            throw error;
        }
    }

    async delete(query) {
        try {
            return await this.repository.destroy({ where: query });
        } catch (error) {
            logger.error('delete_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }

    async paginatedList(query = {}, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                order = [['createdAt', 'DESC']],
                include = [],
                attributes = null
            } = options;

            const offset = (page - 1) * limit;

            const { rows, count } = await this.repository.findAndCountAll({
                where: query,
                limit: parseInt(limit),
                offset: offset,
                order,
                include,
                attributes,
                distinct: true
            });

            const totalPages = Math.ceil(count / limit);

            return {
                rows,
                count,
                countPerPage: limit,
                currentPage: page,
                totalPages,
                hasNext: page < totalPages
            };
        } catch (error) {
            logger.error('list_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }

    async list(query = {}, options = {}) {
        try {
            const { order = [['createdAt', 'DESC']], include = [], attributes = null } = options;

            return await this.repository.findAll({
                where: query,
                order,
                include,
                attributes
            });
        } catch (error) {
            logger.error('list_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }

    async get(query, options = {}) {
        try {
            const { include = [], attributes = null } = options;

            return await this.repository.findOne({
                where: query,
                include,
                attributes
            });
        } catch (error) {
            logger.error('get_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }

    async count(query) {
        try {
            return await this.repository.count({ where: query });
        } catch (error) {
            logger.error('count_entity_error', error, `occurred on line ${logger.getLine()}`);
            throw error;
        }
    }
}

module.exports = BaseService;