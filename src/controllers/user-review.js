const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
    try {
        const newReview = { ...req.body };
        newReview.reviewerId = req.user.userId;
        const review = await Review.create(newReview);
        return res.status(StatusCodes.CREATED).json({ review });
    } catch (error) {
        console.log("Error in createReview controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error.",
            error: error.message
        });
    }
};

const getAllReview = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewerId: req.user.userId }).sort("createdAt");
        return res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
    } catch (error) {
        console.log("Error in getAllReview controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error.",
            error: error.message
        });
    }
};

const getSingleReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            reviewerId: req.user.userId
        });
        if (!review) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No single review with id ${req.params.id} was found.`
            });
        }

        return res.status(StatusCodes.OK).json({ review });
    } catch (error) {
        console.log("Error in getSingleReview controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error.",
            error: error.message
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const { revieweeName, rating, comment } = req.body;
        if (revieweeName === "" || rating <= 0 || comment === "") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Please provide reviewee's name, rating, or comment for editing the review."
            });
        }
        const updatedReview = await Review.findByIdAndUpdate(
            { _id: req.params.id, reviewerId: req.user.userId, reviewerName: req.user.name },
            { revieweeName, rating, comment },
            { new: true }
        );
        if (!updatedReview) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No single review with id ${req.params.id} was found.`
            });
        }

        return res.status(StatusCodes.OK).json({ updatedReview });
    } catch (error) {
        console.log("Error in updateReview controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error.",
            error: error.message
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            reviewerId: req.user.userId
        });
        if (!review) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: `No single review with id ${req.params.id} was found.`
            });
        }

        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        console.log("Error in deleteReview controller,", error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Server error.",
            error: error.message
        });
    }
};

module.exports = { getAllReview, getSingleReview, createReview, updateReview, deleteReview };