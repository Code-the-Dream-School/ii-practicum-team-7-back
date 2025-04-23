const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");



const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    return res.status(StatusCodes.CREATED).json({ user: { userId: user._id, name: user.name }, token });
};

const login = async (req, res) => {
    const { email, password } = req.body;

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

    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Wrong password, please try again."
        });
    }

    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({ user: { userId: user._id, name: user.name }, token });
};

module.exports = { register, login };