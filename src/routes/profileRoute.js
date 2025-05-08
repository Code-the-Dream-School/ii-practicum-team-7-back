const express = require('express');
const router = express.Router();
const authenticatedUser = require("../middleware/authentication");
const { createProfile, getUserProfile, updateProfile, deleteProfile, getProfileByUserId } = require("../controllers/user-profile");

router.post("/", authenticatedUser, createProfile);   //create user profile
router.get("/:id", authenticatedUser, getUserProfile); //get individual user profile by profileId
router.get("/:userId", authenticatedUser, getProfileByUserId); //get individual user profile by userId
router.patch("/:id", authenticatedUser, updateProfile); //edit individual user profile
router.delete("/:id", authenticatedUser, deleteProfile);  //delete individual user profile

module.exports = router;