const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require('bcrypt');
const req = require("express/lib/request");
router.use(express.json())
router.use(express.urlencoded({
    extended: false
}));

//Register
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(req.body.password, salt)
        const duplicate=await User.findOne({username:req.body.username})
        duplicate&& res.status(403).json(duplicate);
        const newuser = new User({
            username: req.body.username,
            password: hashedPw,
            email: req.body.email,
            city:req.body.city,
            country:req.body.country,
            relation:req.body.relation,
            desc:req.body.desc
        });
        await newuser.save();
        res.status(200)
        res.json('user data saved')
    } catch (err) {
        console.log(err)
    }
})

//Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email});
        
        !user && res.status(404).json("account not found")
        const password = await bcrypt.compare(req.body.password,user.password);
        !password&& res.status(404).send("Incorrect Password")
        res.status(200).json(user);
    } catch (err) {
        console.log(err)
    }
})
module.exports = router;