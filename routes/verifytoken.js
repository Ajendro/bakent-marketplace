const jwt = require('jsonwebtoken');
const { sendResponse } = require('../utils/responseHandler');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return sendResponse(res, 401, {}, 'No token provided.');
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return sendResponse(res, 403, {}, 'Failed to authenticate token.');
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
