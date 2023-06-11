const express = require("express")
const mongoose = require("mongoose")
const Employee = require("../models/Employee");
const router = express.Router()
const { verifyUser } = require("../middlewares/auth");
const { userTypes } = require("../utils/util");
const Department = require("../models/Department");
const multer = require('multer');
const fs = require('fs').promises;
const path = require ('path');


router.use(["/add", "/edit", "/delete", "/search", "/details/:employeeId"], verifyUser);

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      try{
        await fs.mkdir(`content/${req.body.deptId}/`, { recursive: true});
        cb(null, `content/${req.body.deptId}/`);
      }catch(err)
      {
        cb(err, null);
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
  const upload = multer({
    storage,
     fileFilter: (req, file, cb) => {
      const allowedTypes = ['jpg', 'gif', 'png', 'bmp', 'jpeg']
      const ext = path.extname(file.originalname).replace('.', '')
      if(allowedTypes.includes(ext)){
        cb(null, true)
      }else{
        cb((new Error('file is not allowed')), false) 
      }
     }
  });

router.post("/add", upload.single("profilePicture"), async (req, res) => {
    try {
        if (req.user.type !== userTypes.USER_TYPE_SUPER && req.body.deptId !== req.user.departmentId.toString())
            throw new Error("invalid request ");

        const department = await Department.findById(req.body.deptId);
        if (!department) throw new Error("Department does not exists");

        const {
            name,
            email,
            cnic,
            designation,
            phone,
            address,
        } = req.body

        const employee = new Employee({
            name,
            email,
            cnic,
            profilePicture: req.file ? req.file.filename : "",
            designation,
            phone,
            address,
            departmentId: department._id,
            createdOn: new Date(),
            modifiedOn: new Date()
        })

        await employee.save();
        res.json({ success: true })
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

router.post('/delete', async (req, res) => {
    try {
        // if id is not available
        if (!req.body.id)
            throw new Error("Employee Id is invalid")
        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");
        const employee = await Employee.findById(req.body.id)
        if (!employee)
            throw new Error("Invalid Id");
        
        if(req.user.type !== userTypes.USER_TYPE_SUPER && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("invalid Request")

        await Employee.findByIdAndDelete(req.body.id);
        if(employee.profilePicture)
            await fs.unlink(`contant/${employee.departmentId}/${employee.profilePicture}`)

        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.post("/search", async (req, res) => {
    try {


        if (req.user.type !== userTypes.USER_TYPE_SUPER && req.body.deptId !== req.user.departmentId.toString())
            throw new Error("invalid request");

        const department = await Department.findById(req.body.deptId);
        if (!department) throw new Error("Department does not exists");


        const conditions = { departmentId: req.body.deptId};
        const employees = await Employee.find(conditions);

        res.status(200).json({ employees, department });

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