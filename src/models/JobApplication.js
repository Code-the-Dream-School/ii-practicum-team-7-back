const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicantId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    applicantName: {
        type: String,
        required: true,
    },
    resumeUrl: {
        type: String
    },
    coverLetter: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);