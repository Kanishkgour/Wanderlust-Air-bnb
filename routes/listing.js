const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

const app = express();

const session = require("express-session");
const flash = require("connect-flash");
const sessionOptions = {
    secret: "ThisMySecretSessionCODE",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 5 * 24 * 60 * 60 * 1000,
        maxAge: 5 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.use(express.urlencoded({ extended: true }))
app.use(session(sessionOptions));
app.use(flash())

const listingController = require("../controllers/listing.js");

router.route("/")  // path ko bar-bar define karne ki zarurat nahi hai
    .get(wrapAsync(listingController.index))       //Index Route   
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));       // Create New lisiting

// New Listing
router.get("/new", isLoggedIn, listingController.renderNewForm)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(wrapAsync(listingController.destroyListing));




//Edit listings
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));


module.exports = router;