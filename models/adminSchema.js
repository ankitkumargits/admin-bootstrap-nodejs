const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    password: Number
});

const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;