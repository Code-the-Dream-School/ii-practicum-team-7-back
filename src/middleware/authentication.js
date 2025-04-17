const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const auth = (req, res, next) => {
    //check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Authentication invalid."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        //attach user to future job routes
        req.user = { userId: payload.userId, name: payload.name };
        next();
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Authentication invalid."
        });
    }
};

module.exports = auth;