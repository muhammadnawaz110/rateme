const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { createJWTTOKEN } = require("../utils/util");
const router = express.Router()
const { verifyUser } = require("../middlewares/auth");
const { default: axios } = require("axios");
const ejs = require('ejs');
const { randomBytes } = require('crypto');

router.use(["/add", "/edit", "/delete", "/profile", "/profile-update"], verifyUser);

router.post("/add", async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email, _id :{$ne:req.body.id} });
    try {
        if (userExist) throw new Error("This email is already registered")
        const { name, email, phoneNumber, profilePicture, password, type, createdOn, modifiedOn } = req.body
        console.log(req.body)
        const user = new User({
            name: name,
            email: email,
            phoneNumber,
            profilePicture,
            password: await bcrypt.hash(password, 10),
            type,
            createdOn: createdOn,
            modifiedOn: modifiedOn
        })
        await user.save();
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/edit", async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email });
    try {
        if (userExist) throw new Error("This email is already registered")
        
        if(!req.body.id) throw new Error ("User id is required");
        if(!mongoose.isValidObjectId(req.body.id))
            throw new Error("user id is invalid");
        if(req.user._id.toString() !== req.body.id)
            throw new Error("invalid request s");

            const user = await User.findById(req.body.id);
            if(!user) throw new Error("user does not exists");
        
        const { name, email, phoneNumber, profilePicture, password, type,  createdOn, modifiedOn } = req.body
        let updatedUser = await  User.findByIdAndUpdate(req.body.id,{
            name: name,
            email: email,
            phoneNumber,
            profilePicture,
            password: await bcrypt.hash(password, 10),
            type,
            createdOn: createdOn,
            modifiedOn: modifiedOn
        })
        res.json({ user: updatedUser })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.delete("/delete",async (req,res) => {
    console.log(req.body.id)
    try {
      if(!req.body.id) throw new Error("User id is required")
      if(!mongoose.isValidObjectId(req.body.id)) throw new Error("user id is invalid")
    
      const user = await User.findById(req.body.id)
      if(!user) throw new Error("User does not exists")
      
      await User.findOneAndDelete(req.body.id)
      res.json({success : true})
    } catch (error) {
      res.status(400).json({error : error.message})
    }
  
  })
  router.get("/", async(req, res) =>{
    try{
        const users = await User.find();

        res.status(200).json({users});

    }catch(error){
        res.status(400).json({error: error.message})
    }
})

router.post("/signin", async (req, res) => {
    try {
        if (!req.body.email) throw new Error("Email is required");
        if (!req.body.password) throw new Error("password is required")
        const user = await User.findOne({ email: req.body.email })
        console.log(req.body)
        if (!user) throw new Error("Email or password is incorrect")
        if (!(await bcrypt.compare(req.body.password, user.password)))
            throw new Error('Email or password is incorrect')

        delete user.password

        const token = await createJWTTOKEN(user, 24*365*50);
        res.json({ user, token });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get ("/profile", async(req, res) =>{
    try{
        let user = await User.findById(req.user._id);
        user = user.toObject()
        delete user.password
        res.json({user})
    }catch(error){
        res.status(400).json({error: error.message});
    }
});

router.post("/profile-update", async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email, _id: {$ne: req.user._id}});
    
    try {
        if (userExist) throw new Error("This email is already registered")
         
        const { name, email, phoneNumber, profilePicture, password, type,  createdOn, modifiedOn } = req.body
        let updatedUser = await  User.findByIdAndUpdate(req.user._id,{
            name: name,
            email: email,
            phoneNumber,
            profilePicture,
            password: await bcrypt.hash(password, 10),
            type,
            createdOn: createdOn,
            modifiedOn: modifiedOn
        })
        updatedUser = updatedUser.toObject()
        delete updatedUser.password
        res.json({ user: updatedUser })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.post("/forgot-password", async (req, res) => {

    try {
      if (!req.body.email) throw new Error("Email is required");
      let user = await User.findOne({ email: req.body.email });
      if (!user) throw new Error("Invalid request");
  
      const passwordResetCode = user._id.toString() + randomBytes(Math.ceil(25/2)).toString('hex').slice(0, 25);
      await User.findByIdAndUpdate(user._id, { passwordResetCode });
  
      const resetPasswordURL = process.env.BASE_URL + 'admin/reset-password/' + passwordResetCode;
  
      const data = {
        Recipients: {
          To: [user.email]
        },
        Content: {
          Body: [{
            ContentType: 'HTML',
            Content: await ejs.renderFile('./emails/resetPassword.ejs', { name: user.name, resetPasswordURL }),
            Charset: "utf8"
          }],
          subject: 'Reset Password',
          from: process.env.EMAIL_FROM
        }
      }
  
    //   const response = await axios.post('https://api.elasticemail.com/v4/emails/transactional', data, {
    //     headers: { 'X-ElasticEmail-ApiKey': process.env.EMAIL_API_KEY }
    //   })
  
      
      res.json({success : true });

  
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: error.message });
    }
  });

  router.post("/verify-reset-code", async (req, res) => {

    try {
      if (!req.body.code) throw new Error("Code is required");
      let user = await User.findOne({ passwordResetCode: req.body.code });
      if (!user) throw new Error("Invalid request");
  
      user = user.toObject(); 
      delete user.password;
      
      res.json({ user });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post("/reset-password", async (req, res) => {

    try {
      if (!req.body.code) throw new Error("Code is required");
      if (!req.body.newPassword) throw new Error("New password is required");
      if (!req.body.confirmPassword) throw new Error("Confirm password is required");
  
      if(req.body.newPassword.length < 6)  
        throw new Error("Password should have at least 6 characters");
  
      if(req.body.newPassword !== req.body.confirmPassword)
        throw new Error("Passwords are not same");
  
      let user = await User.findOne({ passwordResetCode: req.body.code });
      if (!user) throw new Error("Invalid request");
  
      await User.findByIdAndUpdate(user._id, {
        password: await bcrypt.hash(req.body.newPassword, 10),
        passwordResetCode: ''
      })
      
      res.json({ success: true });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router