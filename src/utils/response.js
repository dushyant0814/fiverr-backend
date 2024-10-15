const SuccessResponse = function (res, { message = '', data = {}, code = 200, lean = false }) {
    const statusCode = code;
    res.status(statusCode);

    if (lean) {
        return res.json({
            success: true,
            message,
            statusCode,
            ...data,
        });
    }
    return res.json({
        success: true,
        message,
        statusCode,
        data,
    });
};

const customError = ({ code, message, customCode, metadata }) => {
    const err = new Error(message);
    err.status = code;
    err.customCode = customCode;
    err.expose = true;
    console.error(message, 'error', metadata);
    throw err;
};

const ErrorResponse = (res, { error, message = '' }) => {
    const errorText = error?.detail || error?.message || error;
    const statusCode = error?.customCode || error?.status || 500;
    res?.status(error?.status || 500);
    res?.json({
        success: false,
        statusCode,
        message,
        error: errorText,
    });
};

module.exports = { customError, ErrorResponse, SuccessResponse };
