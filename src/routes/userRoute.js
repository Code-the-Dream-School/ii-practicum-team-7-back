const express = require("express");
const router = express.Router();
const passport = require("passport");
const { StatusCodes } = require("http-status-codes");
const { register, login, logout } = require("../controllers/user-auth");

router.post("/register", register);

router.post("/login", login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    const token = req.user.createJWT();
    return res.status(StatusCodes.OK).json({
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        provider: req.user.provider,
        token
    });
});

router.post("/logout", logout);

module.exports = router;