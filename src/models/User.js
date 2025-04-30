const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email.",],
        unique: true,
    },
    password: {
        type: String,
        minLength: 8,
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
        required: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    }

});

UserSchema.pre("save", async function () {
    if (this.provider !== "local" || !this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createRefreshToken = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "20d" }
    );
};

UserSchema.methods.createAccessToken = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "2d" }
    );
};

UserSchema.methods.checkPassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);