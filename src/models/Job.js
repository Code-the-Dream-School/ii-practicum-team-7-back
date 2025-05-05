const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String
    },
    category: {
        type: String,
    },
    summary: {
        type: String
    },
    zipCode: {
        type: Number,
        min: 10000,
        max: 99999
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    description: {
        type: String
    },
    employmentType: {
        type: String,
        enum: ["Full-Time", "Part-Time", "Contract"],
        default: "Part-Time"
    },
    workLocationType: {
        type: String,
        enum: ["In-Person", "Remote", "Hybrid"],
        default: "In-Person"
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    creatorName: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}
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