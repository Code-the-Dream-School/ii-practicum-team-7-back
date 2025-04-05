const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
//MongoDB connection
const connectDB = require("./db/connect.js");

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/user-auth.js");



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