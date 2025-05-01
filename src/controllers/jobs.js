const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");

const createJob = async (req, res) => {
    try {
        req.body.creatorId = req.user.userId;
        const job = await Job.create(req.body);
        return res.status(StatusCodes.CREATED).json({
            jobId: job._id,
            title: job.title,
            address: job.address,
            state: job.state,
            zipCode: job.zipCode,
            description: job.description,
            category: job.category,
            jobType: job.jobType,
            creatorId: job.creatorId,
            creatorName: job.creatorName
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
        const jobs = await Job.find().sort("createdAt");
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
        const job = await Job.findOne({
            _id: req.params.id,
            creatorId: req.user.userId
        });
        if (!job) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No job with id ${req.params.id} was found.`
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
        const { title, address, state, zipCode, description, category, jobType } = req.body;
        const { id } = req.params;

        if (!title || !address || !state || !zipCode || !description || !category || !jobType?.length) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Please provide required fields: title, address, state, zipCode, description, category, and at least one job type."
            });
        }

        const updatedJob = await Job.findOneAndUpdate(
            { _id: id, creatorId: req.user.userId },
            { title, address, state, zipCode, description, category, jobType },
            { new: true, runValidators: true }
        );
        if (!updatedJob) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No job found with id ${id} or you are not authorized to update it.`
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
                message: `No job with id ${req.params.id} was found.`
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