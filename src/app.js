const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const connectDB = require("./db/connect.js");     //MongoDB connection

const authenticatedUser = require("./middleware/authentication.js");

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/user-auth.js");
const profileRouter = require("./routes/profile.js");

const notFoundMiddleware = require("./middleware/not-found.js");   //Error handler if a route does not exist.


// middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1', mainRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", authenticatedUser, profileRouter);

app.use(notFoundMiddleware);

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