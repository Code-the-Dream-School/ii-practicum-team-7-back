const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");

const createJob = async (req, res) => {
    try {
        req.body.creatorId = req.user.userId;
        const job = await Job.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            jobId: job._id,
            title: job.title,
            category: job.category,
            summary: job.summary,
            zipCode: job.zipCode,
            city: job.city,
            state: job.state,
            description: job.description,
            employmentType: job.employmentType,
            workLocationType: job.workLocationType,
            creatorId: job.creatorId,
            creatorName: job.creatorName,
            createdDate: job.createdDate
        });
    } catch (error) {
        console.log("Error in createJob controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error creating job.",
            error: error.message,
        });
    }
};

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort("-createdAt");   //show jobs in descending order
        return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
    } catch (error) {
        console.log("Error in getAllJobs controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error getting all the jobs.",
            error: error.message,
        });
    }
};

const getSingleJob = async (req, res) => {
    try {
        const job = await Job.findOne({ _id: req.params.id });
        if (!job) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No job with ID ${req.params.id} was found.`
            });
        }
        return res.status(StatusCodes.OK).json({ job });
    } catch (error) {
        console.log("Error in getSingleJob controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error getting single job.",
            error: error.message,
        });
    }
};

const updateJob = async (req, res) => {
    try {
        const allowedFields = ["title", "category", "summary", "zipCode", "city", "state", "description", "employmentType", "workLocationType"];

        const updateFields = {};

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "No valid fields provided for update."
            });
        }

        const { id } = req.params;

        const updatedJob = await Job.findOneAndUpdate(
            { _id: id, creatorId: req.user.userId },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedJob) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No job found with ID ${id} or you are not authorized to update it.`
            });
        }
        return res.status(StatusCodes.OK).json({
            message: "Job has been updated.",
            updatedJob
        });
    } catch (error) {
        console.log("Error in updateJob controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error updating job post.",
            error: error.message,
        });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await Job.findOneAndDelete({
            _id: req.params.id,
            creatorId: req.user.userId
        });
        if (!job) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No job with ID ${req.params.id} was found.`
            });
        }

        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.log("Error in deleteJob controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error deleting a job.",
            error: error.message,
        });
    }
};

module.exports = { createJob, getAllJobs, getSingleJob, updateJob, deleteJob };