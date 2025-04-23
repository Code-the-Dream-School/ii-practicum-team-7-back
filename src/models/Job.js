const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String
    },
    location: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    jobType: {
        type: [String]
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    creatorName: {
        type: String
    }
}, { timestamps: true }
);

jobSchema.pre("save", async function () {
    if (this.isNew || this.isModified("creatorId")) {
        const user = await mongoose.model("User").findById(this.creatorId).select("name");
        this.creatorName = user.name;
    }
});

module.exports = mongoose.model("Job", jobSchema);