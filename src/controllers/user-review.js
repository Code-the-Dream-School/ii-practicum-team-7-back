const Review = require("../models/Review");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
    const newReview = { ...req.body };
    newReview.reviewerId = req.user.userId;
    const review = await Review.create(newReview);
    res.status(StatusCodes.CREATED).json({ review });
};

const getAllReview = async (req, res) => {
    const reviews = await Review.find({ reviewerId: req.user.userId }).sort("createdAt");
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
    const review = await Review.findOne({
        _id: req.params.id,
        reviewerId: req.user.userId
    });
    if (!review) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: `No single review with id ${req.params.id} was found.`
        });
    }

    res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
    const { revieweeName, rating, comment } = req.body;
    if (revieweeName === "" || rating <= 0 || comment === "") {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "Please provide reviewee's name, rating, or comment for editing the review."
        });
    }
    const updatedReview = await Review.findByIdAndUpdate(
        { _id: req.params.id, reviewerId: req.user.userId, reviewerName: req.user.name },
        { revieweeName, rating, comment },
        { new: true }
    );
    if (!updatedReview) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: `No single review with id ${req.params.id} was found.`
        });
    }
    res.status(StatusCodes.OK).json({ updatedReview });
};

const deleteReview = async (req, res) => {
    const review = await Review.findOneAndDelete({
        _id: req.params.id,
        reviewerId: req.user.userId
    });
    if (!review) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: `No single review with id ${req.params.id} was found.`
        });
    }

    res.status(StatusCodes.NO_CONTENT).json({
        message: `Review ${req.params.id} was deleted.`
    });
};



module.exports = { getAllReview, getSingleReview, createReview, updateReview, deleteReview };