// controllers/bannerController.js
const Banner = require('../models/banner');
const cloudinary = require('../config/cloudinary'); // تأكدي إن الملف موجود ومظبوط

// إضافة بانر جديد
exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a banner image' });
    }

    // رفع الصورة على Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'banners'
    });

    const newBanner = new Banner({
      imageUrl: result.secure_url // تخزين لينك الصورة
    });

    await newBanner.save();
    res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Server error while creating banner' });
  }
};

// جلب كل البانرات
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Server error while fetching banners' });
  }
};

// جلب بانر واحد بالـ id
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error('Error fetching banner by id:', error);
    res.status(500).json({ message: 'Server error while fetching banner' });
  }
};

// حذف بانر
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    // استخرج public_id من رابط الصورة عشان نحذفها من Cloudinary
    const publicId = banner.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`banners/${publicId}`);

    await banner.deleteOne();
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ message: 'Server error while deleting banner' });
  }
};
