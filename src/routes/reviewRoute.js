const express = require('express');
const router = express.Router();

const { getAllReview, getSingleReview, createReview, updateReview, deleteReview } = require("../controllers/user-review");
const authenticatedUser = require("../middleware/authentication");

router.post("/", authenticatedUser, createReview);
router.get("/", getAllReview);
router.get("/:id", authenticatedUser, getSingleReview);
router.patch("/:id", authenticatedUser, updateReview);
router.delete("/:id", authenticatedUser, deleteReview);

module.exports = router;