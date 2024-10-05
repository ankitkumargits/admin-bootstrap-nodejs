const express = require("express");
const connectToMongo = require("./db/conn");
const app = express();
const session = require("express-session");


connectToMongo();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: "false"}));
app.use(session({
    secret: "ourlittlesecret",
    resave: false,
    saveUninitialized: false
}));

app.use('/admin', require('./routers/admin'));
app.use('/', require("./routers/frontend"));

app.listen(5000, ()=>{
    console.log("Your adminbootexpress server is running on port 5000");
});