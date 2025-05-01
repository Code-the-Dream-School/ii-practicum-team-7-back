const express = require("express");
const router = express.Router();
const authenticatedUser = require("../middleware/authentication");
const { createJob, getAllJobs, getSingleJob, updateJob, deleteJob } = require("../controllers/jobs");
const { getApplicationByJob, createJobApplication, updateJobApplication, deleteJobApplication } = require("../controllers/jobApplication");

router.post("/", authenticatedUser, createJob);   //create a job post
router.get("/", getAllJobs); //It's public route, so anyone can view the job list
router.get("/:id", authenticatedUser, getSingleJob);  //authenticated users get a particular job
router.patch("/:id", authenticatedUser, updateJob);    //authenticated user update/edit job post
router.delete("/:id", authenticatedUser, deleteJob);   //authenticated user delete a job

router.get("/:jobId/applications", authenticatedUser, getApplicationByJob);    //users get applicaion
router.post("/:jobId/applications", authenticatedUser, createJobApplication);   //users can create job application
router.patch("/applications/:id", authenticatedUser, updateJobApplication);   //users can update/edit their applications
router.delete("/applications/:id", authenticatedUser, deleteJobApplication); //users can delete their applications


module.exports = router;