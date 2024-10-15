const express = require('express');
const jobController = require('../controllers/job');
const { validateRequest, validateParams } = require('../middleware/requestValidation');
const dbValidation = require('../middleware/dbValidation');
const { 
    createJobValidation, 
    updateJobValidation, 
    payJobValidation, 
    idParamValidation 
} = require('../validations');
const { Contract } = require('../models');

const router = express.Router();

router.get('/unpaid', jobController.getUnpaidJobs);

router.post('/:job_id/pay', 
    validateParams(payJobValidation),
    dbValidation.validateJobExists('job_id'),
    jobController.payForJob
);

router.get('/', jobController.list);

router.get('/:id', 
    validateParams(idParamValidation),
    dbValidation.validateJobExists(),
    jobController.get
);

router.post('/', 
    validateRequest(createJobValidation),
    dbValidation.validateRelatedEntities([
        { model: Contract, field: 'ContractId', errorMessage: 'Contract not found' }
    ]),
    jobController.create
);

router.put('/:id', 
    validateParams(idParamValidation),
    validateRequest(updateJobValidation),
    dbValidation.validateJobExists(),
    jobController.update
);

router.delete('/:id', 
    validateParams(idParamValidation),
    dbValidation.validateJobExists(),
    jobController.delete
);

module.exports = router;