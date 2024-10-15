const {
    customValidations,
    string,
    number,
    boolean,
    date,
    arrayValidation,
    stringRequired,
    numberRequired,
    booleanRequired,
    dateRequired,
    dateFormatValidation
} = require('./baseValidation');

// Contract validations
const createContractValidation = customValidations({
    terms: stringRequired,
    status: string.valid('new', 'in_progress', 'terminated').required(),
    ClientId: numberRequired,
    ContractorId: numberRequired,
});

const updateContractValidation = customValidations({
    terms: string,
    status: string.valid('new', 'in_progress', 'terminated'),
});

// Job validations
const createJobValidation = customValidations({
    description: stringRequired,
    price: numberRequired,
    ContractId: numberRequired,
});

const updateJobValidation = customValidations({
    description: string,
    price: number,
});

const payJobValidation = customValidations({
    job_id: numberRequired,
});

// Profile validations
const createProfileValidation = customValidations({
    firstName: stringRequired,
    lastName: stringRequired,
    profession: stringRequired,
    balance: number,
    type: string.valid('client', 'contractor').required(),
});

const updateProfileValidation = customValidations({
    firstName: string,
    lastName: string,
    profession: string,
    type: string.valid('client', 'contractor'),
    // balance can only be updated by either deposit money or pay job api
});

const depositValidation = customValidations({
    amount: numberRequired.positive(),
});

// Admin validations
const bestProfessionValidation = customValidations({
    start: dateRequired,
    end: dateRequired,
});

const bestClientsValidation = customValidations({
    start: dateRequired,
    end: dateRequired,
    limit: number.integer().min(1),
});

// Common validations
const idParamValidation = customValidations({
    id: numberRequired,
});



module.exports = {
    createContractValidation,
    updateContractValidation,
    createJobValidation,
    updateJobValidation,
    payJobValidation,
    createProfileValidation,
    updateProfileValidation,
    depositValidation,
    bestProfessionValidation,
    bestClientsValidation,
    idParamValidation,
};