const router = require("express").Router();
const { constants } = require("../constants");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Register
router.post("/register", async (req,res)=>{
    try{
        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(constants.VALIDATION_ERROR).json("Email is not valid" );
        }

        // check if user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(constants.CONFLICT_ERROR).json("User already registered");
        }

        // check if password meets minimum length requirement
        const passwordMinLength = 6;
        if (req.body.password.length < passwordMinLength) {
            return res.status(constants.VALIDATION_ERROR).json(`Password must be at least ${passwordMinLength} characters long`);
        }
      
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save user and respond
        const user = await newUser.save();
        res.status(constants.SUCCESSFULL_REQUEST).json(user); 
    }catch(err){
        res.status(constants.SERVER_ERROR).json(err);
    }
});

// LOGIN
router.post("/login", async (req,res)=>{
    try{
        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(constants.VALIDATION_ERROR).json("Email is not valid" );
        }

        const user = await User.findOne({email: req.body.email});
        !user && res.status(constants.NOT_FOUND).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(constants.VALIDATION_ERROR).json("wrong password");

        res.status(constants.SUCCESSFULL_REQUEST).json(user);
    }catch(err){
        return (err);
    }
});

module.exports = router;