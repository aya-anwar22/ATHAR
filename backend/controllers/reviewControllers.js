const asyncHandler = require('express-async-handler');
const Review = require('../models/Review')
// for user
// Add Review
exports.addRevirw = asyncHandler(async(req, res) =>{
    const {name, email, userReview} = req.body;
    if(!name || !userReview){
        return res.status(400).json({
            message: "Name and Review are required"
        })
    };
    const newReview = new Review({
        name, email, userReview
    })
    await newReview.save()
    res.status(200).json(newReview)
})


// Get All Review
exports.getAllReview = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ isApproved: true });
    if(reviews.length === 0){
        return res.status(404).json("reviews not found")
    }
    res.status(200).json(reviews);
});

// for admin

// Get All Review
exports.getAllReviewByAdmin = asyncHandler(async (req, res) => {
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    const reviews = await Review.find();
    if(reviews.length === 0){
        return res.status(404).json("reviews not found")
    }
    res.status(200).json(reviews);
});
// acceccpt Review
exports.acceccptReview = asyncHandler(async(req, res) =>{
    const reviewId = req.params.reviewId
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    const review = await Review.findById(reviewId)
    if(!review){
        return res.status(404).json({
            message: "Review not found"
        })
    }
    if(review.isApproved){
        return res.status(400).json({message: "Revirw already acceccpted"})
    }
    review.isApproved = true
    await review.save()
    res.status(200).json({message: "Review aceccpted Successfully"})
})

exports.deleteReview = asyncHandler(async (req, res) => {
    const reviewId = req.params.reviewId;

    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
        return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
});

