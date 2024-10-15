const express = require('express');
const adminController = require('../controllers/admin');
const { validateQuery } = require('../middleware/requestValidation');
const { bestProfessionValidation, bestClientsValidation } = require('../validations');

const router = express.Router();

router.get('/best-profession', validateQuery(bestProfessionValidation), adminController.getBestProfession);
router.get('/best-clients', validateQuery(bestClientsValidation), adminController.getBestClients);

module.exports = router;