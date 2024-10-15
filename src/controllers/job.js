const BaseController = require('./baseController');
const jobService = require('../services/job');
const { SuccessResponse, ErrorResponse } = require('../utils/response');
const logger = require('../utils/logger');
const { API_ERROR } = require('../constants/error');

class JobController extends BaseController {
    constructor() {
        super(jobService);
        this.getUnpaidJobs = this.getUnpaidJobs.bind(this);
        this.payForJob = this.payForJob.bind(this);
    }

    async getUnpaidJobs(req, res) {
        try {
            const jobs = await this.service.getUnpaidJobs(req.profile.id);
            SuccessResponse(res, { data: jobs });
        } catch (error) {
            logger.error('get_unpaid_jobs_error', error, `occurred on line ${logger.getLine()}`);
            ErrorResponse(res, { error });
        }
    }

    async payForJob(req, res) {
        try {
            const { job_id } = req.params;
            const { id: clientId } = req.profile;
            const job = await this.service.payForJob(job_id, clientId);
            SuccessResponse(res, { data: job, message: 'Payment successful' });
        } catch (error) {
            logger.error(`Pay for job error: ${error.message}`, { error, stack: error.stack });

            switch (error.message) {
                case API_ERROR.PAYMENT.JOB_NOT_FOUND_OR_ALREADY_PAID:
                    return ErrorResponse(res, { error: { message: error.message, status: 404 } });
                case API_ERROR.PAYMENT.INSUFFICIENT_BALANCE:
                    return ErrorResponse(res, { error: { message: error.message, status: 403 } });
                default:
                    ErrorResponse(res, { error: { message: 'An unexpected error occurred', status: 500 } });
            }
        }
    }
}

module.exports = new JobController();