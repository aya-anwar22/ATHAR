// controllers/bannerController.js
const Banner = require('../models/banner');
const fs = require('fs');
const path = require('path');

// إضافة بانر جديد
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a banner image' });
    }

    const newBanner = new Banner({
      imageUrl: req.file.filename // ✅ مطابق للموديل
    });

    await newBanner.save();
    res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating banner' });
  }
};


// جلب كل البانرات
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while fetching banners' });
  }
};

// حذف بانر
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.deleteOne(); // أو Banner.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
