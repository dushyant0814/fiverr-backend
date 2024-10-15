const express = require('express');
const contractController = require('../controllers/contract');
const { validateRequest, validateParams } = require('../middleware/requestValidation');
const dbValidation = require('../middleware/dbValidation');
const { 
    createContractValidation, 
    updateContractValidation, 
    idParamValidation 
} = require('../validations');
// dp: this shouldn't be here 
const { Profile } = require('../models');

const router = express.Router();

router.get('/:id', 
    validateParams(idParamValidation),
    dbValidation.validateContractExists(),
    contractController.getContract
);

router.get('/', contractController.getContracts);

router.post('/', 
    validateRequest(createContractValidation),
    dbValidation.validateRelatedEntities([
        { model: Profile, field: 'ClientId', errorMessage: 'Client not found' },
        { model: Profile, field: 'ContractorId', errorMessage: 'Contractor not found' }
    ]),
    contractController.create
);
// dp: should have been patch
router.put('/:id', 
    validateParams(idParamValidation),
    validateRequest(updateContractValidation),
    dbValidation.validateContractExists(),
    contractController.update
);

router.delete('/:id', 
    validateParams(idParamValidation),
    dbValidation.validateContractExists(),
    contractController.delete
);

module.exports = router;