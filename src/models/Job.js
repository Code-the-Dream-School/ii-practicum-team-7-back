const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    zipCode: {
        type: Number,
        min: 10000,
        max: 99999
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
        try {
            const user = await mongoose.model("User").findById(this.creatorId).select("name");
            if (!user) {
                throw new Error("User not found.");
            }
            this.creatorName = user.name;
        } catch (error) {
            throw new Error(`Error setting creatorName: ${error.message}`);
        }
    }
});

module.exports = mongoose.model("Job", jobSchema);