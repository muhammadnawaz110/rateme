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
    phone_number : {
        type: String,
        
    },
    id_card : {
        type: String,
        
    },
   
    profile_picture : {
        type: String,
    },
    designation : {
        type: Number,
    
    rating:{
        type:Number,
    }
    },
    department_id:{
        type: mongoose.Schema.Types.ObjectId
    },
       
    created_on : {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },

    modified_on : {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },
});
const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee