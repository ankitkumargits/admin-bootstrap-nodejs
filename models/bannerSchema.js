const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    title: String,
    desc: String,
    ldesc: String
});

const Banner = mongoose.model('banner', bannerSchema);

module.exports = Banner;