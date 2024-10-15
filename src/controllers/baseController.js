const logger = require('../utils/logger');
const { ErrorResponse, SuccessResponse } = require('../utils/response');

class BaseController {
    constructor(service) {
        this.service = service;
        this.create = this.create.bind(this);
        this.bulkCreate = this.bulkCreate.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
    }

    async create(req, res) {
        try {
            let { body: payload } = req;
            const { payloadTransform, responseSerialize, doAsyncOps, doAsyncOpsAfter } = req;

            if (payloadTransform) {
                payload = await payloadTransform(payload, req);
            }
            if (doAsyncOps) {
                await doAsyncOps(payload, req);
            }
            let data = await this.service.create(payload);
            if (doAsyncOpsAfter) {
                await doAsyncOpsAfter(payload, data);
            }
            if (responseSerialize) {
                data = responseSerialize(data);
            }
            SuccessResponse(res, { data, message: 'Entity created successfully' });
        } catch (error) {
            logger.error(`Create entity error: ${error.message}`, { error, stack: error.stack });
            ErrorResponse(res, { error });
        }
    }

    async bulkCreate(req, res) {
        try {
            let { payload } = req.body;
            const { payloadTransform, responseSerialize, doAsyncOps } = req;

            if (payloadTransform) {
                payload = await payloadTransform(payload);
            }
            if (doAsyncOps) {
                await doAsyncOps(payload);
            }
            let data = await this.service.bulkCreate(payload);
            if (responseSerialize) {
                data = responseSerialize(data);
            }
            SuccessResponse(res, { data, message: 'Entities created successfully' });
        } catch (error) {
            logger.error(`Bulk create entity error: ${error.message}`, { error, stack: error.stack });
            ErrorResponse(res, { error });
        }
    }

    async update(req, res) {
        try {
            const { body: payload, params: query } = req;
            const { payloadTransform, responseSerialize, queryTransform, doAsyncOps, doAsyncOpsAfter } = req;

            if (payloadTransform) {
                payload = await payloadTransform(payload, req);
            }
            if (queryTransform) {
                query = queryTransform(query, req);
            }
            if (doAsyncOps) {
                await doAsyncOps(payload, req);
            }
            let data = await this.service.update(query, payload);
            if (doAsyncOpsAfter) {
                await doAsyncOpsAfter(query, payload, data);
            }
            if (responseSerialize) {
                data = responseSerialize(data);
            }
            SuccessResponse(res, { data });
        } catch (error) {
            logger.error(`Update entity error: ${error.message}`, { error, stack: error.stack });
            ErrorResponse(res, { error });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const { doAsyncOps } = req;
            if (doAsyncOps) {
                await doAsyncOps(req);
            }
            await this.service.delete({ id });
            SuccessResponse(res, { code: 204 });
        } catch (error) {
            logger.error(`Delete entity error: ${error.message}`, { error, stack: error.stack });
            ErrorResponse(res, { error });
        }
    }

    async list(req, res) {
        try {
            const { responseSerialize, queryTransform, include, attributes } = req;
            let { query } = req;
            const { page, limit } = query;

            if (queryTransform) {
                query = await queryTransform(query, req);
            }

            const data = await this.service.paginatedList(query, {
                page,
                limit,
                include,
                attributes
            });

            if (responseSerialize) {
                data.rows = await responseSerialize(data.rows);
            }

            SuccessResponse(res, { data });
        } catch (error) {
            logger.error(`List entity error: ${error.message}`, { error, stack: error.stack });
            ErrorResponse(res, { error });
        }
    }

    async get(req, res) {
        try {
            const { id } = req.params;
            let { query } = req;
            if (id) {
                query = { ...query, id };
            }
            const { responseSerialize, queryTransform, include, attributes } = req;

            if (queryTransform) {
                query = queryTransform(query, req);
            }

            let data = await this.service.get(query, { include, attributes });

            if (responseSerialize) {
                data = await responseSerialize(data, req);
            }

            SuccessResponse(res, { data });
        } catch (error) {
            logger.error(`Get entity error: ${error.message}`, { error, stack: error.stack });
            ErrorResponse(res, { error });
        }
    }
}

module.exports = BaseController;