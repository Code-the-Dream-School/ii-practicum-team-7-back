const mongoose = require("mongoose");
const JobApplication = require("../models/JobApplication");
const Job = require("../models/Job");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

//Get application for a job.
const getApplicationByJob = async (req, res) => {
    const { jobId } = req.params;
    try {
        const applications = await JobApplication
            .find({ jobId }).select("applicantName resumeUrl coverLetter createdAt -_id")
            .sort("createdAt");

        return res.status(StatusCodes.OK).json({ data: applications });
    } catch (error) {
        console.log("Error in getApplicationByJob controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error fetching application.",
            error: error.message
        });
    }
};

//create a job application
const createJobApplication = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applicantId = req.user.userId;
        const { resumeUrl, coverLetter, applicantName } = req.body;

        //check if jobId is MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid jobId format",
                receivedId: jobId
            });
        }

        const validJobId = new mongoose.Types.ObjectId(jobId);

        const job = await Job.findById(validJobId);
        if (!job) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Job not found."
            });
        }

        const user = await User.findById(applicantId).select("name");
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found."
            });
        }

        const application = await JobApplication.create({
            jobId: validJobId,
            applicantId,
            applicantName: applicantName?.trim() || user.name,
            resumeUrl,
            coverLetter
        });

        return res.status(StatusCodes.CREATED).json({
            applicationId: application._id,
            jobId: application.jobId,
            applicantName: application.applicantName,
            resumeUrl: application.resumeUrl,
            coverLetter: application.coverLetter,
            createdAt: application.createdAt
        });
    } catch (error) {
        console.error("Error in createJobApplication controller,", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error creating application.",
            error: error.message
        });
    }
};

//Update/edit a job application
const updateJobApplication = async (req, res) => {
    try {
        const { id: applicationId } = req.params;
        const { resumeUrl, coverLetter } = req.body;
        const applicantId = req.user.userId;
        const application = await JobApplication.findOne({ _id: applicationId, applicantId });
        if (!application) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Application not found or access denied."
            });
        }
        if ("resumeUrl" in req.body) application.resumeUrl = resumeUrl;
        if ("coverLetter" in req.body) application.coverLetter = coverLetter;
        await application.save();
        return res.status(StatusCodes.OK).json({
            message: "Application updated.",
            application: {
                applicationId: application._id,
                jobId: application.jobId,
                applicantName: application.applicantName,
                resumeUrl: application.resumeUrl,
                coverLetter: application.coverLetter
            }
        });
    } catch (error) {
        console.error("Error in updateJobApplication,", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error updating application.",
            error: error.message
        });
    }
};

//Delete a job application.
const deleteJobApplication = async (req, res) => {
    try {
        const { id: applicationId } = req.params;
        const applicantId = req.user.userId;
        const application = await JobApplication.findOneAndDelete({ _id: applicationId, applicantId });
        if (!application) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "Application not found or access denied."
            });
        }
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error("Error in deleteJobApplication:", error.message);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Error deleting application.",
            error: error.message
        });
    }
};

module.exports = { getApplicationByJob, createJobApplication, updateJobApplication, deleteJobApplication };