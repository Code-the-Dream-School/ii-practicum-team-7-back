const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { setCookies } = require("../controllers/user-auth");

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
        if (error instanceof jwt.TokenExpiredError) {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                res.clearCookie("accessToken");
                res.clearCookie("refreshToken");
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    message: "Token expired. Please log in again."
                });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const user = await User.findById(decodedRefresh.userId);

                if (!user || !user.refreshTokens.includes(refreshToken)) {
                    throw new Error("Invalid refresh token");
                }

                //Generate new token
                const newAccessToken = user.createAccessToken();
                const newRefreshToken = user.createRefreshToken();

                //Update refresh tokens array
                user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
                user.refreshTokens.push(newRefreshToken);
                await user.save();

                //Set new tokens
                setCookies(res, newAccessToken, newRefreshToken);

                //Set req.user with new access token data
                const decodedNewAccess = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET);
                req.user = {
                    userId: decodedNewAccess.userId,
                    name: user.name,
                    email: user.email,
                    provider: user.provider
                };

                next();
            } catch (refreshError) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Session expired. Please log in again." });
            }
        } else {
            let errorMessage = "Authentication invalid.";

            if (error instanceof jwt.JsonWebTokenError) {
                errorMessage = "Invalid token.";
            }

            // Clear invalid token cookie if present
            res.clearCookie("accessToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                path: "/"
            });

            console.log("Error in authentication middleware", error.message);

            return res.status(StatusCodes.UNAUTHORIZED)
                .setHeader("Access-Control-Allow-Origin", "http://localhost:5173")
                .json({
                    message: errorMessage
                });

        }
    }
};

module.exports = authenticatedUser;