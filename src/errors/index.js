const CustomAPIError = require("./custom-api");
const NotFoundError = require("./not-found");
const UnauthenticatedError = require("./unauthenticated");
const BadRequestError = require("./bad-request");

module.exports = {
    CustomAPIError,
    NotFoundError,
    UnauthenticatedError,
    BadRequestError,
};