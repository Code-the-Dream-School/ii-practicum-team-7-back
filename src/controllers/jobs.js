const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");

const createJob = async (req, res) => {
    req.body.creatorId = req.user.userId;
    const job = await Job.create(req.body);
    return res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ creatorId: req.user.userId }).sort("createdAt");
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getSingleJob = async (req, res) => {
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
};

const updateJob = async (req, res) => {
    const { title, location, description, category, jobType } = req.body;
    const { id } = req.params;

    if (title === "" || location === "" || description === "" || category === "" || jobType === "") {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Please provide the title, location, description, category, or a job type for editing the job post."
        });
    }

    // build an $or filter so either jobId OR creatorId match
    const filters = [{ _id: id }, { creatorId: id }];

    const updatedJob = await Job.findOneAndUpdate(
        { $or: filters },
        { title, location, description, category, jobType },
        { new: true }
    );
    if (!updatedJob) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: `No job with id or creatorId ${id} was found.`
        });
    }
    return res.status(StatusCodes.OK).json({
        message: "Job has been updated.",
        updatedJob
    });
};

const deleteJob = async (req, res) => {
    const job = await Job.findOneAndDelete({
        _id: req.params.id,
        creatorId: req.user.userId
    });
    if (!job) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message: `No job with id ${req.params.id} was found.`
        });
    }

    return res.status(StatusCodes.NO_CONTENT).json({
        message: `Job with id ${req.params.id} was deleted.`
    });
};

module.exports = { createJob, getAllJobs, getSingleJob, updateJob, deleteJob };