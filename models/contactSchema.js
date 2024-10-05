const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    email:String,
    query: String,
    status: String
});


const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;