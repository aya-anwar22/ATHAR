const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  type: {
    type: String,
    enum: ['stock_alert', 'return_alert', 'price_changed'],
    required: true
  },

  target: {
    type: String,
    enum: ['admin', 'user'],
    required: true
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  relatedProductId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    default: null 
  },

  message: {
    type: String,
    required: true
  },

  isRead: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification =  mongoose.model('Notification', notificationSchema);
module.exports = Notification