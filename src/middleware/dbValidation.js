const { Profile, Contract, Job } = require('../models');
const { ErrorResponse } = require('../utils/response');

const dbValidation = {
    validateEntityExists: (model, paramName = 'id', errorMessage) => {
        return async (req, res, next) => {
            const id = req.params[paramName] || req.body[paramName];
            if (!id) {
                return ErrorResponse(res, { error: { message: `${paramName} is required`, status: 400 } });
            }

            const entity = await model.findByPk(id);
            if (!entity) {
                return ErrorResponse(res, { error: { message: errorMessage || 'Entity not found', status: 404 } });
            }
            // dp: this wasn't used in services or controllers
            req.entityInstance = entity;
            next();
        };
    },

    validateProfileExists: (paramName = 'id') =>
        dbValidation.validateEntityExists(Profile, paramName, 'Profile not found'),

    validateContractExists: (paramName = 'id') =>
        dbValidation.validateEntityExists(Contract, paramName, 'Contract not found'),

    validateJobExists: (paramName = 'id') =>
        dbValidation.validateEntityExists(Job, paramName, 'Job not found'),

    validateRelatedEntities: (validations) => {
        return async (req, res, next) => {
            try {
                for (const validation of validations) {
                    // dp: this model could've been a string and we could've used a map to get the model
                    const { model, field, errorMessage } = validation;
                    const id = req.body[field];
                    if (id) {
                        const entity = await model.findByPk(id);
                        if (!entity) {
                            return ErrorResponse(res, { error: { message: errorMessage, status: 404 } });
                        }
                    }
                }
                next();
            } catch (error) {
                ErrorResponse(res, { error: { message: 'Database validation failed', status: 500 } });
            }
        };
    }
};

module.exports = dbValidation;