const handleLogin = require('../middleware/auth');
const Address = require('../models/addressSchema');
const Admin = require('../models/adminSchema');
const Banner = require('../models/bannerSchema');
const Contact = require('../models/contactSchema');
const User = require('../models/userRegSchema');
const router = require('express').Router();


router.get('/', (req, res)=>{
    res.render('admin/adminlog.ejs');
});

router.post('/adsignin', async(req, res)=>{
    // console.log(req.body);
    const uname = req.body.name;
    const password = req.body.password;
    const adData = await Admin.findOne({name:uname});
    // console.log(adData);
    if(adData !== null){
        if(adData.password == password){
            req.session.isAuth = true;
            res.redirect("/admin/dashboard");
        } else {
        res.redirect('/admin/');
        }
    } else {
        res.redirect('/admin/');
    }
});


// handleLogin ==> set here 
router.get("/dashboard",(req, res)=>{
    res.render("admin/dashboard.ejs");
});

router.get("/logout", (req, res)=>{
    req.session.destroy();
    res.redirect("/admin/");
});

router.get('/banner', async (req, res)=>{
    const bannerDetails = await Banner.findOne();
    // console.log(bannerDetails);
    res.render("admin/banner.ejs",{bannerDetails, mess: null});
});

router.get("/bannerupdate/:id", async(req, res)=>{
    // console.log(req.params.id);
    const bannerUpdate = await Banner.findById(req.params.id);
    // console.log(bannerupdate);
    res.render("admin/bannerupdate.ejs", {bannerUpdate});
});

router.post("/bannerupdate/:id", async (req, res)=>{
    // console.log(req.params.id);
    // console.log(req.body);
    await Banner.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        desc: req.body.desc,
        ldesc: req.body.ldesc
    });
    // res.redirect("/admin/banner/");
    const bannerDetails = await Banner.findOne();
    res.render("admin/banner.ejs",{bannerDetails, mess: "Successfully Updated"});
});


router.get('/contact', async (req, res)=>{
    const contactDetails = await Contact.find();
    // console.log(contactDetails);
    res.render("admin/contact.ejs", {contactDetails});
});

router.get('/contactdelete/:id', async(req, res)=>{
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/contact')
});

router.get('/contactstatusupdate/:id', async(req, res)=>{
    const contactDetails = await Contact.findById(req.params.id);
    let newStatus;
    if(contactDetails.status == "unread"){
        newStatus="read";
    } else {
        newStatus="unread";
    }
    await Contact.findByIdAndUpdate(req.params.id, {
        status: newStatus
    });
    res.redirect('/admin/contact');
});


router.post('/search', async (req, res)=>{
    const searchData = req.body.search;
    const contactDetails = await Contact.find({status: searchData});
    res.render("admin/contact.ejs", {contactDetails});
});

router.get('/address', async(req, res)=>{
    const addressDetails = await Address.findOne();
    res.render("admin/address.ejs", {addressDetails});
});

router.get('/addressupdate/:id', async(req, res)=>{
    const addressDetails = await Address.findById(req.params.id);
    res.render('admin/addressUpdate.ejs', {addressDetails});
});


router.post('/addressupdate/:id', async(req, res)=>{
        await Address.findByIdAndUpdate(req.params.id, {
        cname: req.body.cname,
        address: req.body.address,
        phone: req.body.phone,
        telephone: req.body.telephone,
    });
    res.redirect('/admin/address');
});

router.get('/usersmng', async(req, res)=>{
    const userData = await User.find();
    res.render("admin/usermng.ejs", {userData});
});


router.get("/userdelete/:id", async(req, res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/usersmng");
});

router.get("/userstatusupdate/:id", async (req, res)=>{
    const status_id = await User.findById(req.params.id);
    let newStatus=null;
    if(status_id.status == "suspended"){
        newStatus="active"
    }else{
        newStatus="suspended";
    }
    await User.findByIdAndUpdate(req.params.id, {
        status: newStatus
    });
    res.redirect("/admin/usersmng");
});

router.get("/userroleupdate/:id", async (req, res)=>{
    const role_id = await User.findById(req.params.id);
    let newRole=null;
    if(role_id.role == "public"){
        newRole="private"
    }else{
        newRole="public";
    }
    await User.findByIdAndUpdate(req.params.id, {
        role: newRole
    });
    res.redirect("/admin/usersmng");
});



router.get('/testimonials', (req, res)=>{
    res.render("admin/testimonials.ejs");
});


// admin insert db 

// router.get('/adtest', (req, res)=>{
//     const adminData = new Admin({
//         name: "admin",
//         password: 123
//     });
//     adminData.save();
//     res.send("Your admin data is inserted");
// });

// router.get("/adbanner", (req, res)=>{
//     const bannerDetails = new Banner({
//         title: "title2020",
//         desc: "descriptions",
//         ldesc: "long descriptions"
//     });
//     bannerDetails.save();
//     res.send("Your data is send to the bannerschema");
// })


// router.get("/adrstest", (req, res)=>{
//     const address = Address({
//         cname: "indigo pvt ltd",
//         address: "jaipur, rajasthan",
//         phone: 543624,
//         telephone: 4409
//     });
//     address.save();
//     res.send("Your data is send to the addressScehma");
// })




module.exports = router;