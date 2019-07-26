const jwt = require('jsonwebtoken');
const secret = require('../../secret');

function verifyUser(req, res) {
    if (!req.headers.authorization) {
        return false;
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, secret);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    verifyUser
};