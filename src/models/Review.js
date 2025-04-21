const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    reviewerName: {
        type: String
    },
    revieweeName: {
        type: String,
        maxLength: 250
    },
    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    },
    comment: {
        type: String
    }

},
    { timestamps: true }
);

ReviewSchema.pre("save", async function () {
    if (this.isNew || this.isModified("reviewerId")) {
        const user = await mongoose.model("User").findById(this.reviewerId).select("name");
        this.reviewerName = user.name;
    }
});

module.exports = mongoose.model("Review", ReviewSchema);