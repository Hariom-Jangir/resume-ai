const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided' });
    }

    const isBlacklisted = await tokenBlacklistModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized, token is blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        if (err?.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please login again" });
        }
        return res.status(401).json({ message: 'Unauthorized, invalid token' });
    }
}

module.exports = { authUser };