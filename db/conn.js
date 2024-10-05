const mongoose = require("mongoose");

const connectToMongo = ()=>{
    const dbUrl = 'mongodb://127.0.0.1:27017/adminbootdb';
    mongoose.connect(dbUrl, ()=>{
        console.log("Your adminbootdb is connected to the express server");
    });
}

module.exports = connectToMongo;