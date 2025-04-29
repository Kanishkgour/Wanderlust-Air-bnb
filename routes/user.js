const express = require("express");
const app = express();
const session = require("express-session")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usercontroller = require("../controllers/users.js")

router.route("/signup")
    .get(usercontroller.renderSignupForm)
    .post(wrapAsync(usercontroller.signup))

router.route("/login")
    .get(usercontroller.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), usercontroller.login);


app.use(session({ secret: 'yourSecret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

module.exports = router;

router.get("/logout", usercontroller.logout)