const FeedbackProduct = require('../models/FeedbackProduct');
const Product = require('../models/Product');

// Add Feedback (by user)
exports.addFeedback = async (req, res) => {
  try {
    const { name, productId, comment, rate } = req.body;

    const feedback = await FeedbackProduct.create({
      productId,
      comment,
      name,
      rate
    });

    res.status(201).json({ message: 'Feedback submitted, waiting for approval', feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve Feedback (by admin)
exports.approveFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await FeedbackProduct.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    // Recalculate product average rate
    const approvedFeedbacks = await FeedbackProduct.find({ 
      productId: feedback.productId, 
      isApproved: true 
    });

    const totalRate = approvedFeedbacks.reduce((acc, fb) => acc + fb.rate, 0);
    const averageRate = totalRate / approvedFeedbacks.length;

    await Product.findByIdAndUpdate(
      feedback.productId,
      { averageRate: averageRate.toFixed(1) } // Add this field in Product if not exists
    );

    res.status(200).json({ message: 'Feedback approved', feedback });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all feedbacks (admin only)
exports.getAllFeedbacksForAdmin = async (req, res) => {
  try {
    const feedbacks = await FeedbackProduct.find()

    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get approved feedbacks for product
exports.getApprovedFeedbacks = async (req, res) => {
  try {

    const feedbacks = await FeedbackProduct.find({
      isApproved: true
    })
    res.status(200).json({ feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
