const moment = require("moment/moment");
const mongoose = require("mongoose");
const { stringify } = require("querystring");


const departmentSchema = new mongoose.Schema({
    department_name : {
        type: String,
        
    },

    department_email : {
        type: String,
        
    },

    phone : {
        type: String,
        
    },

    logo : {
        type: String,
    },

    address : {
        type: String,
    },

   

    rating : {
        type: Number,
    },

       

    created_on : {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },

    modified_on : {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },

   
    user_id:{
        type: mongoose.Schema.Types.ObjectId
    },

});


departmentSchema.set("toJSON", {
    getters: true,
    transform: (doc, column , options) =>{
        column.created_on =moment(column.created_on).format("YYYY-MM-DD");
        column.modified_on =moment(column.modified_on).format("YYYY-MM-DD");
        return column

    }
})
const Department = mongoose.model("departments", departmentSchema);

module.exports = Department