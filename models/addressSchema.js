const mongoose = require("mongoose");


const addressSchema = new mongoose.Schema({
    cname: String,
    address: String,
    phone: Number,
    telephone: Number
});

const Address = mongoose.model('address', addressSchema);

module.exports = Address;