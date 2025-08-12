const mongoose = require('mongoose');
const { Schema } = mongoose;

const bannerSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

// ✅ صح
module.exports = mongoose.model('Banner', bannerSchema);
