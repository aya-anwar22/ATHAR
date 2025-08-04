const mongoose = require('mongoose');

const feedbackProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
        type: String,

  },
  comment: {
    type: String,
    required: true,
    minlength: 5
  },
  rate: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const FeedbackProduct = mongoose.model('FeedbackProduct', feedbackProductSchema);

module.exports = FeedbackProduct;
