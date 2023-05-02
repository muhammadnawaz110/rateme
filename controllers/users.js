const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { createJWTTOKEN } = require("../utils/util");
const router = express.Router()
const { verifyUser } = require("../middlewares/auth");

router.use(["/add", "/edit", "/delete", "/profile", "/profile-update"], verifyUser);

router.post("/add", async (req, res) => {
    const userExist = await User.findOne({ email: req.body.email, _id :{$ne:req.body.id} });
    try {
        if (userExist) throw new Error("This email is already registered")
        const { name, email, phone_number, profile_picture, password, type, created_on, modified_on } = req.body
        const user = new User({
            name: name,
            email: email,
            phone_number,
            profile_picture,
            password: await bcrypt.hash(password, 10),
            type,
            created_on: created_on,
            modified_on: modified_on
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
        
        const { name, email, phone_number, profile_picture, password, type,  created_on, modified_on } = req.body
        let updatedUser = await  User.findByIdAndUpdate(req.body.id,{
            name: name,
            email: email,
            phone_number,
            profile_picture,
            password: await bcrypt.hash(password, 10),
            type,
            created_on: created_on,
            modified_on: modified_on
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
        if (!user) throw new Error("Email or password is incorrect")
        if (!(await bcrypt.compare(req.body.password, user.password)))
            throw new Error('Email or password is incorrect')

        delete user.password

        const token = await createJWTTOKEN(user, 12);
        res.json({ user, token });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get ("/profile", async(req, res) =>{
    try{
        const user = await User.findById(req.user._id);
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
         
        const { name, email, phone_number, profile_picture, password, type,  created_on, modified_on } = req.body
        let updatedUser = await  User.findByIdAndUpdate(req.user._id,{
            name: name,
            email: email,
            phone_number,
            profile_picture,
            password: await bcrypt.hash(password, 10),
            type,
            created_on: created_on,
            modified_on: modified_on
        })
        updatedUser = updatedUser.toObject()
        delete updatedUser.password
        res.json({ user: updatedUser })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

module.exports = router