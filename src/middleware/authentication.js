const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const authenticatedUser = async (req, res, next) => {
    //Security headers for all authentication-related routes
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

    try {
        let token = req.cookies.accessToken;

        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            const [bearer, headerToken] = authHeader.split(" ");

            if (bearer === "Bearer" && headerToken) {
                token = headerToken;
            }
        }

        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Authentication required - No token provided"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        //check if the user exists in the database.
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "User with current token no longer exists."
            });
        }

        req.user = {
            userId: user._id,
            name: user.name,
            email: user.email,
            provider: user.provider
        };
        next();
    } catch (error) {
        let errorMessage = "Authentication invalid.";

        if (error instanceof jwt.TokenExpiredError) {
            errorMessage = "Token expired.";
        }

        if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = "Invalid token.";
        }

        // Clear invalid token cookie if present
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: '/'
        });

        console.log("Error in authentication middleware", error.message);

        return res.status(StatusCodes.UNAUTHORIZED)
            .setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
            .json({
                message: errorMessage
            });
    }
};

module.exports = authenticatedUser;