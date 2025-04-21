const express = require('express');
const router = express.Router();

const { getAllReview, getSingleReview, createReview, updateReview, deleteReview } = require("../controllers/user-review");

router.route("/").post(createReview).get(getAllReview);
router.route("/:id").get(getSingleReview).patch(updateReview).delete(deleteReview);

module.exports = router;