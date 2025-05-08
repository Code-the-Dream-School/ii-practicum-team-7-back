const express = require("express");
const router = express.Router();
const passport = require("passport");
const { StatusCodes } = require("http-status-codes");
const { register, login, logout, setCookies, getCurrentUser } = require("../controllers/user-auth");
const authenticatedUser = require("../middleware/authentication");

router.post("/register", register);

router.post("/login", login);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173"
}),
    async (req, res) => {
        const accessToken = req.user.createAccessToken();
        const refreshToken = req.user.createRefreshToken();
        req.user.refreshTokens.push(refreshToken);
        await req.user.save();

        setCookies(res, accessToken, refreshToken); // set them as HTTP-only cookies

        // return res.status(StatusCodes.OK).json({
        //     userId: req.user._id,
        //     name: req.user.name,
        //     email: req.user.email,
        //     provider: req.user.provider
        // });

        return res.redirect("http://localhost:5173");

    });

router.get("/current-user", authenticatedUser, getCurrentUser);

router.post("/logout", logout);

module.exports = router;