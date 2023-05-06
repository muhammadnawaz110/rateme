const express = require("express")
const mongoose = require("mongoose")
const Employee = require("../models/Employee");
const User = require("../models/User");
const router = express.Router()
const { verifyUser } = require("../middlewares/auth");
const { userTypes } = require("../utils/util");
const Department = require("../models/Department");
const Rating = require("../models/Rating");



router.use(["/add", "/edit", "/delete", "/search", "/details/:employeeId"], verifyUser);

router.post("/add", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ userId: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("invalid request")
        const {
            name,
            email,
            idCard,
            profilePicture,
            designation,
            phoneNumber,
            address,

        } = req.body
        const employee = new Employee({
            name,
            email,
            idCard,
            profilePicture,
            designation,
            phoneNumber,
            address,
            departmentId: department._id,

        })
        await employee.save();
        res.json({ employee })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post("/edit", async (req, res) => {
    try {

        if (!req.body.id) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("employee id is invalid");

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ userId: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("invalid request")


        const employee = await Employee.findById(req.body.id);
        if (!employee) throw new Error("employee does not exists");


        if (department._id.toString() !== employee.departmentId.toString())
            throw new Error("invalid request ");

        await Employee.updateOne(
            { _id: employee._id, departmentId: department._id },
            { $set: req.body }
        );
        const updatedEmployee = await Employee.findById(req.body.id);
        res.json({ employee: updatedEmployee })


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.delete("/delete", async (req, res) => {
    console.log(req.body.id)
    try {
        // if (!req.body.id) throw new Error("User id is required")
        // if (!mongoose.isValidObjectId(req.body.id)) throw new Error("user id is invalid")

        // const employee = await User.findById(req.body.id)
        // if (!employee) throw new Error("Employee does not exists")

        // //   employee.userId = "6450f4b511b84d82a04fa36e"
        // if (req.user._id.toString() !== employee.userId.toString())
        //     throw new Error("invalid request ");

        if (!req.body.id) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("employee id is invalid");

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ userId: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("invalid request")


        const employee = await Employee.findById(req.body.id);
        if (!employee) throw new Error("employee does not exists");


        if (department._id.toString() !== employee.departmentId.toString())
            throw new Error("invalid request ");

        await Employee.deleteOne({ _id: req.body.id, departmentId: department._id });
        res.json({ success: true })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})

router.post("/search", async (req, res) => {
    try {


        // if (!req.body.id) throw new Error("employee id is required");
        // if (!mongoose.isValidObjectId(req.body.id))
        //     throw new Error("employee id is invalid");

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ userId: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("invalid request")


        const employees = await Employee.find(req.body);

        res.status(200).json({ employees });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/details/:employeeId", async (req, res) => {
    try {

        if (!req.params.employeeId) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.params.employeeId))
            throw new Error("employee id is invalid");

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ userId: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("invalid request")


        const employee = await Employee.findById(req.params.employeeId);
        if (!employee) throw new Error("employee does not exists");


        if (department._id.toString() !== employee.departmentId.toString())
            throw new Error("invalid request ");


        res.json(employee)


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.post("/feedback", async (req, res) => {
    try {
        const {
            name,
            phoneNumber,
            feedbackText,
            employeeId,
            rating
        } = req.body;

        const employee = await Employee.findById(employeeId)
            if(!employee)
            throw new Error("invalid request")

        if (rating < 0 || rating > 5)
            throw new Error("invalid request")

        const ratingText = Rating({
            name,
            phoneNumber,
            feedbackText,
            departmentId : employee.departmentId,
            employeeId,
            rating
        })
        await ratingText.save()
        res.json({ ratingText })
    } catch (error) {
        res.status(400).json({ error: error.message })

    }
})
module.exports = router