const mongoose = require("mongoose");
const initData = require("./data.js");
// const initData = require("./zindex.data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// Insert org dbs url



main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '680b4301c65a46544a9688fd' }))

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
