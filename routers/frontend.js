const Banner = require('../models/bannerSchema');
const Contact = require('../models/contactSchema');
const Address = require('../models/addressSchema');
const User = require('../models/userRegSchema');
const frhandleLogin = require('../middleware/frauth');
const bcrypt = require("bcrypt");
const router = require('express').Router();

let sess=null;

async function handleRole(req, res, next){
    if(sess.role!=='public'){
        next();
    }else{
        // res.send("You don't have any permission")
        const bannerDetails = await Banner.findOne();
        const addressDetails = await Address.findOne();
        res.render("index.ejs", {bannerDetails, addressDetails, mess: "You don't have any permission", username:sess.username});
    }
}

router.get('/', frhandleLogin, async (req, res)=>{
    const bannerDetails = await Banner.findOne();
    const addressDetails = await Address.findOne();
    if(sess !== null){
        res.render("index.ejs", {bannerDetails, addressDetails, mess: null, username:sess.username});
    }else{
        res.render("index.ejs", {bannerDetails, addressDetails, mess: null, username:null});
    }
});

router.get("/moredetails", frhandleLogin,handleRole, async (req, res)=>{
    const moreDetails = await Banner.findOne();
    const addressDetails = await Address.findOne();
    if(sess !== null){
        res.render("moredetails.ejs", {moreDetails, addressDetails, username:sess.username});
    }else{
        res.render("moredetails.ejs", {moreDetails, addressDetails, username:null});
    }
});

router.post("/submitcontact", async (req, res)=>{
    const contactDetails = new Contact({
        email: req.body.email,
        query: req.body.query,
        status: "unread",
    });
    contactDetails.save();
    const bannerDetails = await Banner.findOne();
    res.render("index.ejs", {bannerDetails, mess: "Your Contact query is submitted"});
});


router.get("/register", async(req, res)=>{
    const addressDetails = await Address.findOne();
    if(sess!==null){
        res.render("userRegister.ejs", {addressDetails, username:sess.username});
    }else{
        res.render("userRegister.ejs", {addressDetails, username:null});
    }
});

router.post("/register", async(req, res)=>{
    // console.log(req.body);
    const {username, password } = req.body;
    const bpassword = await bcrypt.hash(password, 10);
    const userExists = await User.exists({username:username});
    if(userExists){
        const addressDetails = await Address.findOne();
        if(sess!== null){
            res.render("login.ejs", {addressDetails, mess: "Already you have an account", username: sess.username});
        }else{
            res.render("login.ejs", {addressDetails, mess: "Already you have an account", username: null});
        }
    }else{
        const userreg = new User({
            username: username,
            password: bpassword,
            email: "",
            role: "public",
            status: "suspended",
            fullname: ""
        });
        await userreg.save();
        const addressDetails = await Address.findOne();
        if(sess!== null){
            res.render("login.ejs", {addressDetails, mess: "Your account is successfully created ", username: sess.username});
        }else{
            res.render("login.ejs", {addressDetails, mess: "Your account is successfully created ", username: null});
        }
    }
});

router.get("/login", async(req, res)=>{
    const addressDetails = await Address.findOne();
    if(sess !== null){
        res.render("login.ejs", {addressDetails, mess:null, username:sess.username});
    }else {
        res.render("login.ejs", {addressDetails, mess:null, username:null});
    }
});

router.post("/login", async (req, res)=>{
    const addressDetails = await Address.findOne();
    const {username, password} = req.body
    const userdata = await User.findOne({username: username});
    if(userdata !== null){
        const bpassword = await bcrypt.compare(password, userdata.password)
        if(bpassword){
            req.session.isAuth = true;
            sess = req.session;
            sess.username = username
            sess.role=userdata.role
            if(userdata.status == "active"){
                res.redirect("/profile")
            }else{
                res.render("login.ejs", {addressDetails, mess:"Contact your admin and active your account", username: null});
            }
        }else {
            res.render("login.ejs", {addressDetails, mess:"You entered bad credentials Please try again", username: null});
        }
    }else {
        res.render("login.ejs", {addressDetails, mess:"You entered bad credentials Please try again", username: null});
    }
});

router.get("/logout", async(req, res)=>{
    req.session.destroy();
    sess=null;
    res.redirect("/login");
});

router.get("/testipost", async(req, res)=>{
    const addressDetails = await Address.findOne();
    if(sess !== null){
        res.render("testimonials.ejs", {addressDetails, username: sess.username});
    }else{
        res.render("testimonials.ejs", {addressDetails, username:null});
    }
});

router.get("/profile", frhandleLogin, async (req, res)=>{
    const addressDetails = await Address.findOne();
    if(sess !== null){
        res.render("profile.ejs", {addressDetails, username: sess.username});
    }else{
        res.render("profile.ejs", {addressDetails, username: null});
    }
});


module.exports = router;