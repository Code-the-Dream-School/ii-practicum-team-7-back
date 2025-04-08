const express = require('express');
const router = express.Router();
const { createProfile, getUserProfile, updateProfile, deleteProfile } = require("../controllers/user-profile");

router.route("/").post(createProfile);
router.route("/:id").get(getUserProfile).delete(deleteProfile).patch(updateProfile);

module.exports = router;