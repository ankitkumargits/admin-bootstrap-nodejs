const mongoose = require('mongoose');

const userRegSchema = new mongoose.Schema({
    username: String,
    fullname:String,
    email: String,
    status: String,
    role: String,
    password: String
});

const User = mongoose.model('user', userRegSchema);


module.exports = User;