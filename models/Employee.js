const moment = require("moment/moment");
const mongoose = require("mongoose");


const employeeSchema = new mongoose.Schema({
    name : {
        type: String,
        required:true,
    },
    email : {
        type: String,
        required:true,
    },
    phone : {
        type: String,
        
    },
    cnic : {
        type: String,
        
    },
   
    profilePicture : {
        type: String,
    },
    designation : {
        type: String,
        index: true,
    
    rating:{
        type:Number,
    }
    },
    departmentId:{
        type: mongoose.Schema.Types.ObjectId
    },
       
    createdOn : {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },

    modifiedOn : {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },
});

employeeSchema.index({ name: 'text', email: 'text', phone: 'text', cnic: 'text', designation: 'text' })

const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee