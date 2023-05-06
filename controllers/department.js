const express = require("express")
const mongoose = require("mongoose")
const Department = require("../models/Department");
const User = require("../models/User");
const router = express.Router()
const { verifyUser } = require("../middlewares/auth");
const { userTypes } = require("../utils/util");



router.use(verifyUser);

router.post("/add", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER)
            throw new Error("invalid request")
        const {
            departmentName,
            departmentEmail,
            phone,
            address,
            userId
        } = req.body
        const department = new Department({
            departmentName,
            departmentEmail,
            phone,
            address,
            userId
        })
        await department.save();
        res.json({ department })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/edit", async (req, res) => {
    try {

        if (!req.body.id) throw new Error("department id is required");
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("department id is invalid");


        const department = await Department.findById(req.body.id);
        if (!department) throw new Error("department does not exists");


        if (req.user.type !== userTypes.USER_TYPE_SUPER && req.user._id.toString() !== department.userId.toString())
            throw new Error("invalid request ");

        const {
            departmentName,
            departmentEmail,
            phone,
            address,

        } = req.body
        let updatedDepartment = await Department.findByIdAndUpdate(req.body.id, {
            departmentName,
            departmentEmail,
            phone,
            address,

        })
        res.json({ department: updatedDepartment })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.delete("/delete", async (req, res) => {
    try {
        if (!req.body.id) throw new Error("User id is required")
        if (!mongoose.isValidObjectId(req.body.id)) throw new Error("user id is invalid")
        
        
        const department = await Department.findById(req.body.id)
        if (!department) throw new Error("Department does not exists")

        //   department.userId = "6450f4b511b84d82a04fa36e"
      
            if (req.user.type !== userTypes.USER_TYPE_SUPER)
            throw new Error("invalid request")

        await Department.findOneAndDelete(req.body.id)
        res.json({ success: true })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

router.get("/", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER)
            throw new Error("invalid request")

            if (req.user.type !== userTypes.USER_TYPE_SUPER)
            throw new Error("invalid request")
        const departments = await Department.find();

        res.status(200).json({ departments });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
module.exports = router