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

    email_verification_code : {
        type: String,
        
    },

    profile_picture : {
        type: String,
    },

    status : {
        type: String,
    },

    type : {
        type: Number,
        required:true,
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


userSchema.set("toJSON", {
    getters: true,
    transform: (doc, column , options) =>{
        column.created_on =moment(column.created_on).format("YYYY-MM-DD");
        column.modified_on =moment(column.modified_on).format("YYYY-MM-DD");
        return column

    }
})
const User = mongoose.model("users", userSchema);

module.exports = User