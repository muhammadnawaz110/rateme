const moment = require("moment/moment");
const mongoose = require("mongoose");


const ratingSchema = new mongoose.Schema({
    name: {
        type: String,

    },
    feedbackText: {
        type: String,
    },
    phoneNumber: {
        type: String,

    },

    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    
            rating: {
                type: Number,
                required: true
            },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    createdOn: {
        type: Date,
        default: moment().format("YYYY-MM-DD")
    },

});
const Rating = mongoose.model("ratings", ratingSchema);

module.exports = Rating;