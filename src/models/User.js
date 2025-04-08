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
        required: [true, "Password required."],
        minLength: 8,
    },
    role: {
        type: String,
        enum: ["Job seeker", "Employer", "Both job seeker and employer"],
        default: "Both job seeker and employer",
    },

});

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(7);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
};

UserSchema.methods.checkPassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);