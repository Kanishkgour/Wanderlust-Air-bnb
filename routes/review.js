const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { ValidateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/review.js");


// post route review
router.post("/", isLoggedIn,ValidateReview, wrapAsync(reviewcontroller.createReview));


// reviews delete route
router.delete("/:reviewId", isLoggedIn , isReviewAuthor ,wrapAsync(reviewcontroller.destroyReview));

module.exports = router;