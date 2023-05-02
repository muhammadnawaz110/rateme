const moment = require("moment/moment");
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
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
        required:true,
    },
    password : {
        type: String,
        required:true,
    },
    password_reset_code : {
        type: String,
        maxlength: 20
    },
    profile_picture : {
        type: String,
    },
    type : {
        type: Number,
        required:true,
    },
    department_id:{
        type: mongoose.Schema.Types.ObjectId
    },
        active:{
            type:Number
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
const User = mongoose.model("users", userSchema);

module.exports = User