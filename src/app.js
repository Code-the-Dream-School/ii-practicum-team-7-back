require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const favicon = require("express-favicon");
const logger = require("morgan");
const connectDB = require("./db/connect.js");     //MongoDB connection

const passport = require("passport");
require("./config/passport.js");

//routes
const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/userRoute.js");
const profileRouter = require("./routes/profileRoute.js");
const reviewRouter = require("./routes/reviewRoute.js");
const jobsRouter = require("./routes/jobsRoute.js");

const notFoundMiddleware = require("./middleware/not-found.js");   //Error handler middleware if a route does not exist.
const errorHandlerMiddleware = require("./middleware/error-handler.js"); //Error handler for specific implementation errors.

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));
app.use(cookieParser());
app.use(passport.initialize());

// routes
app.use('/api/v1', mainRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/jobs", jobsRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const { PORT = 8000 } = process.env;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }

};

start();