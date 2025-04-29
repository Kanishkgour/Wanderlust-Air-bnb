const User = require("../models/user.js");



module.exports.renderSignupForm = (req, res) => {
    // res.send("Form");
    res.render("users/signup.ejs")
}



module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log("This is registered User : ", registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", `Welcome ${username} to Wanderlust`);
            res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back! You are logged in now.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    console.log("REDIRECT URL : " , redirectUrl)
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Your session has been securely closed")
        res.redirect("/listings");
    })
}