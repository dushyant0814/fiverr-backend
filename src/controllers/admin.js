const adminService = require('../services/admin');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class AdminController {
    async getBestProfession(req, res) {
        try {
            const { start, end } = req.query;
            const bestProfession = await adminService.getBestProfession(start, end);
            SuccessResponse(res, { data: bestProfession });
        } catch (error) {
            logger.error('get_best_profession_error', error, `occurred on line ${logger.getLine()}`);
            ErrorResponse(res, { error });
        }
    }

    async getBestClients(req, res) {
        try {
            const { start, end, limit } = req.query;
            const bestClients = await adminService.getBestClients(start, end, limit);
            SuccessResponse(res, { data: bestClients });
        } catch (error) {
            logger.error('get_best_clients_error', error, `occurred on line ${logger.getLine()}`);
            ErrorResponse(res, { error });
        }
    }
}

module.exports = new AdminController();