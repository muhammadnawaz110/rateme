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
const { Stats } = require("fs");
const Rating = require("../models/Rating");


router.use(["/add", "/edit", "/delete", "/search", "/details/:employeeId", "/dashboard"], verifyUser);

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

router.post("/edit", upload.single("profilePicture"), async (req, res) => {
    try {

        if (!req.body.id) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("employee id is invalid");

        const employee = await Employee.findById(req.body.id);
        if (!employee) throw new Error("employee does not exists");

        if (req.user.type !== userTypes.USER_TYPE_SUPER && employee.departmentId.toString()  !== req.user.departmentId.toString())
        throw new Error("invalid request ");

        const {
            name,
            email,
            cnic,
            designation,
            phone,
            address,
        } = req.body

        const record = {
            name,
            email,
            cnic,
            designation,
            phone,
            address,
            modifiedOn: new Date(),
        }
        if(req.file && req.file.filename)
        {
            record.profilePicture = req.file.filename;
            if(employee.profilePicture && employee.profilePicture !== req.file.filename)
                fs.access(`./content/${employee.departmentId}/${employee.profilePicture}`, require('fs').constants.F_OK).then( async () => {
                    await fs.unlink(`./content/${employee.departmentId}/${employee.profilePicture}`);
                }).catch(err => {

                })
        }


        await Employee.findByIdAndUpdate(req.body.id, record)
        res.json({ success: true })


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
        if(req.body.query)
        conditions['$text' ] = { $search: req.body.query}

        const page = req.body.page ? req.body.page: 1;
        const skip = (page - 1) * process.env.RECORDS_PER_PAGE;

        const employees =await Employee.find(conditions, {_id: 1, profilePicture: 1, name: 1, phone: 1, cnic: 1}, {limit : process.env.RECORDS_PER_PAGE, skip})

        const totalEmployees = await Employee.countDocuments(conditions);
        const numOfPages = Math.ceil(totalEmployees / process.env.RECORDS_PER_PAGE)



        res.status(200).json({ employees, department,numOfPages });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get("/details/:employee_id", async (req, res) => {
    try {
        if (!req.params.employee_id) throw new Error("employee id is required");
        if (!mongoose.isValidObjectId(req.params.employee_id))
            throw new Error("employee id is invalid");

        const employee = await Employee.findById(req.params.employee_id);
        if (!employee) throw new Error("employee does not exists");

        if(req.user.type !== userTypes.USER_TYPE_SUPER && employee.departmentId.toString() !== req.user.departmentId.toString())
        throw new Error("invalid Request")



        res.json({employee})


    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

router.get('/dashboard',async(req, res) =>{
    try{
        const stats = {
            departments: 0,
            employees: 0,
            ratings: 0
            }
            
        if(req.user.type == userTypes.USER_TYPE_SUPER)
            stats.departments = await Department.estimatedDocumentCount()

        if(req.user.type == userTypes.USER_TYPE_SUPER)
        {
            stats.employees = await Employee.estimatedDocumentCount()
            stats.ratings = await Rating.estimatedDocumentCount()
        }else{
            stats.employees = await Employee.countDocuments({departmentId: req.user.departmentId})
            stats.ratings = await Rating.countDocuments({departmentId: req.user.departmentId})
        }

        res.json({stats})
    }catch(error){
        res.status(400).json({error:error.message})

    }
})

router.post("/publickSearch", async (req, res) => {
    try {

        if(!req.body.departmentId)
            throw new Error ("departmentId is required")
        if(!req.body.name)
            throw new Error ("name is required")


        const department = await Department.findById(req.body.departmentId);
        if (!department) throw new Error("Department does not exists");


        const filter = { departmentId: req.body.departmentId, name: {$regex: req.body.name, $options: 'i'}}

        const employees =await Employee.find( filter, {_id: 1, profilePicture: 1, name: 1, phone: 1, cnic: 1})




        res.status(200).json({ employees });

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router