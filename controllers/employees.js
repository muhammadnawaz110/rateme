const express = require("express")
const mongoose = require("mongoose")
const Employee = require("../models/Employee");
const router = express.Router()
const { verifyUser } = require("../middlewares/auth");
const { userTypes } = require("../utils/util");
const Department = require("../models/Department");


router.use(["/add", "/edit", "/delete", "/search", "/details/:employeeId"], verifyUser);

router.post("/add", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("invalid request")
        const {
            name,
            email,
            id_card,
            profile_picture,
            designation,
            phone_Number,
            address,

        } = req.body
        const employee = new Employee({
            name,
            email,
            id_card,
            profile_picture,
            designation,
            phone_Number,
            address,
            department_id: department._id,

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

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("invalid request")


        const employee = await Employee.findById(req.body.id);
        if (!employee) throw new Error("employee does not exists");


        if (department._id.toString() !== employee.department_id.toString())
            throw new Error("invalid request ");

        await Employee.updateOne(
            { _id: employee._id, department_id: department._id },
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

        // //   employee.user_id = "6450f4b511b84d82a04fa36e"
        // if (req.user._id.toString() !== employee.user_id.toString())
        //     throw new Error("invalid request ");

        if (!req.body.id) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("employee id is invalid");

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("invalid request")


        const employee = await Employee.findById(req.body.id);
        if (!employee) throw new Error("employee does not exists");


        if (department._id.toString() !== employee.department_id.toString())
            throw new Error("invalid request ");

        await Employee.deleteOne({ _id: req.body.id, department_id: department._id });
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

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("invalid request")


        const employees = await Employee.find(req.body);

        res.status(200).json({ employees });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/details/:employee_id", async (req, res) => {
    try {

        if (!req.params.employee_id) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.params.employee_id))
            throw new Error("employee id is invalid");

        if (req.user.type !== userTypes.USER_TYPE__STANDARD)
            throw new Error("invalid request");

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department) throw new Error("Department does not exists");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("invalid request")


        const employee = await Employee.findById(req.params.employee_id);
        if (!employee) throw new Error("employee does not exists");


        if (department._id.toString() !== employee.department_id.toString())
            throw new Error("invalid request ");


        res.json(employee)


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
module.exports = router