const Listing = require("../models/listing")
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }
    const currentUser = res.locals.curruser ? res.locals.curruser._id.toString() : null;
    const listingOwner = listing.owner ? listing.owner._id.toString() : null;
    return res.render("listings/show.ejs", { listing, currentUser, listingOwner });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename
    // console.log("URL : " , url)
    // console.log("filename : " , filename)
    const newlisting = new Listing(req.body.listing)
    newlisting.image = { url, filename }
    console.log("Req.body.listings : ", req.body)
    newlisting.owner = req.user._id;
    await newlisting.save()
    console.log("Save successfully : ", newlisting)
    req.flash("success", "new listing Created");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "The listing you requested does not exist.");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")

    console.log("EDIT ROUTE LISTING : ", listing)
    console.log("Listing Description : ", listing.description);
    req.flash("success", "Listing Updated");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    if (!updatedListing) {
        console.error("Listing not found or update failed.");
    } else {
        console.log("Listing updated successfully:", updatedListing);
    }

    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    };

    req.flash("success", " listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings")
}