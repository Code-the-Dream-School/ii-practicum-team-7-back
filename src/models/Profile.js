const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please provide full name."],
        maxLength: 150
    },
    email: {
        type: String,
        required: [true, "Please provide email."],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email.",],
    },
    role: {
        type: String,
        require: [true, "Please provide role."]
    },
    phone: {
        type: String,
        match: [/^\d{3}-\d{3}-\d{4}$/, "Phone number must be in the format ###-###-####."]
    },
    address: {
        type: String,
        maxLength: 200,
    },
    bio: {
        type: String,
        maxLength: 500,
    },
    skills: {
        type: String,
        maxLength: 300,
    },
    image: {
        type: String,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide an user."],
    },

},
    { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);