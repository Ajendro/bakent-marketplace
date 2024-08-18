const sendResponse = (res, statusCode, data, message) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
        data: data
    });
};

module.exports = { sendResponse };
