const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const setCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
        httpOnly: true,   //prevent XSS attack
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax", //prevent cross-site request forgery attack
        maxAge: 2 * 24 * 60 * 60 * 1000    //2 days
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,   //prevent XSS attack
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 20 * 24 * 60 * 60 * 1000    //20 days
    });
};

//Get current user endpoint.
const getCurrentUser = async (req, res) => {
    try {
        return res.status(StatusCodes.OK).json({
            userId: req.user.userId,
            name: req.user.name,
            email: req.user.email,
            provider: req.user.provider
        });
    } catch (error) {
        console.log("Error in getCurrentUser controller", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error"
        });
    }
};

//User register
const register = async (req, res) => {

    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "User already exists."
            });
        }

        if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide a password." });
        }

        const user = await User.create({ name, email, password });

        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();

        setCookies(res, accessToken, refreshToken);

        return res.status(StatusCodes.CREATED).json({
            userId: user._id,
            name: user.name,
            email: user.email,
            provider: user.provider
        });
    } catch (error) {
        console.log("Error in user register controller.", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error.",
            error: error.message
        });
    }


};

//User login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Please provide email and password."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No user with email ${email} is found.`
            });
        }

        if (user.provider !== "local") {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: `User registered via ${user.provider} account. Please log in using ${user.provider} account.`
            });
        }

        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Wrong password, please try again."
            });
        }

        const accessToken = user.createAccessToken();
        const refreshToken = user.createRefreshToken();

        setCookies(res, accessToken, refreshToken);

        return res.status(StatusCodes.OK).json({
            userId: user._id,
            name: user.name,
            email: user.email,
            provider: user.provider
        });
    } catch (error) {
        console.log("Error in user login controller.", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        });
    }

};

//User logout
const logout = async (req, res) => {
    try {
        // Clear cookies
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return res.status(StatusCodes.OK).json({
            message: "Successfully logged out."
        });
    } catch (error) {
        console.log("Error in logout controller.", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error",
            error: error.message
        });
    }


};

module.exports = { register, login, logout, setCookies, getCurrentUser };