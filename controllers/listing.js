const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }

    const currentUser = res.locals.curruser?._id?.toString() || null;
    const listingOwner = listing.owner?._id?.toString() || null;

    res.render("listings/show.ejs", { listing, currentUser, listingOwner });
};

module.exports.createListing = async (req, res) => {
    if (!req.file || !req.user) {
        req.flash("error", "Image upload and login required.");
        return res.redirect("/listings/new");
    }

    const newListing = new Listing(req.body.listing);
    newListing.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    const originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
        new: true,
        runValidators: true
    });

    if (!updatedListing) {
        req.flash("error", "Update failed.");
        return res.redirect("/listings");
    }

    if (req.file) {
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        await updatedListing.save();
    }

    req.flash("success", "Listing updated.");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id.trim());
    req.flash("success", "Listing deleted.");
    res.redirect("/listings");
};
