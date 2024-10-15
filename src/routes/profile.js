const express = require('express');
const profileController = require('../controllers/profile');
const { validateRequest, validateParams } = require('../middleware/requestValidation');
const dbValidation = require('../middleware/dbValidation');
const { 
    createProfileValidation, 
    updateProfileValidation, 
    depositValidation, 
    idParamValidation 
} = require('../validations');

const router = express.Router();

router.post('/balances/deposit/:id', 
    validateParams(idParamValidation),
    validateRequest(depositValidation),
    dbValidation.validateProfileExists('id'),
    profileController.depositMoney
);

router.get('/', profileController.list);

router.get('/:id', 
    validateParams(idParamValidation),
    dbValidation.validateProfileExists('id'),
    profileController.get
);

router.post('/', 
    validateRequest(createProfileValidation),
    profileController.create
);
// dp: should've been patch
router.put('/:id', 
    validateParams(idParamValidation),
    validateRequest(updateProfileValidation),
    dbValidation.validateProfileExists('id'),
    profileController.update
);
// dp: this should've been a cascade delete
router.delete('/:id', 
    validateParams(idParamValidation),
    dbValidation.validateProfileExists('id'),
    profileController.delete
);

module.exports = router;