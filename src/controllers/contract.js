const BaseController = require('./baseController');
const contractService = require('../services/contract');
const logger = require('../utils/logger');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
class ContractController extends BaseController {
    constructor() {
        super(contractService);
        this.getContract = this.getContract.bind(this);
        this.getContracts = this.getContracts.bind(this);
    }

    async getContract(req, res) {
        try {
            const contract = await this.service.getContractById(req.params.id, req.profile.id);
            SuccessResponse(res, { data: contract });
        } catch (error) {
            logger.error('get_contract_error', error, `occurred on line ${logger.getLine()}`);
            ErrorResponse(res, { error });
        }
    }

    async getContracts(req, res) {
        try {
            const contracts = await this.service.getNonTerminatedContracts(req.profile.id);
            SuccessResponse(res, { data: contracts });
        } catch (error) {
            logger.error('get_contracts_error', error, `occurred on line ${logger.getLine()}`);
            ErrorResponse(res, { error });
        }
    }
}

module.exports = new ContractController();