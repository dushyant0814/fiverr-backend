const API_ERROR = {
    PAYMENT: {
        INSUFFICIENT_BALANCE: 'Insufficient balance',
        JOB_NOT_FOUND_OR_ALREADY_PAID: 'Job not found or already paid',
    },
    PROFILE: {
        CLIENT_NOT_FOUND: 'Client not found',
        DEPOSIT_AMOUNT_EXCEEDED: 'Deposit amount exceeds 25% of total jobs to pay',
    },
    UNEXPECTED: 'An unexpected error occurred'
};

module.exports = { API_ERROR };