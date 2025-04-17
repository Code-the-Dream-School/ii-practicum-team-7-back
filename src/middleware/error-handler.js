const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage: err.message || "Something went wrong, please try again later."
    };

    if (err.name === "ValidationError") {
        customError.errorMessage = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");

        customError.statusCode = 400;
    }

    if (err.code && err.code === 11000) {
        customError.errorMessage = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose a different value.`;
        customError.statusCode = 400;
    }

    if (err.name === "CastError") {
        customError.errorMessage = `No related data found with id ${err.value._id}`;
        customError.statusCode = 404;
    }

    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    return res.status(customError.statusCode).json({
        message: customError.errorMessage
    });
};

module.exports = errorHandlerMiddleware;