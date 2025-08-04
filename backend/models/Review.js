const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type:String
    },
    userReview:String,
    isApproved: {
        type: Boolean,
        default: false
    }, 
} , { timestamps: true } )

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
