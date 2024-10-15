const BaseController = require('./baseController');
const profileService = require('../services/profile');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
const logger = require('../utils/logger');

class ProfileController extends BaseController {
    constructor() {
        super(profileService);
        this.depositMoney = this.depositMoney.bind(this);
    }

    async depositMoney(req, res) {
        try {
            const { id } = req.params;
            const { amount } = req.body;
            const profile = await this.service.depositMoney(id, amount);
            SuccessResponse(res, { data: profile, message: 'Deposit successful' });
        } catch (error) {
            logger.error('deposit_money_error', error, `occurred on line ${logger.getLine()}`);
            ErrorResponse(res, { error });
        }
    }
}

module.exports = new ProfileController();