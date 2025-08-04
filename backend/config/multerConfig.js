const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    // allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
    public_id: (req, file) => {
      const originalName = file.originalname.split('.')[0];
      const timestamp = Date.now();
      return `${timestamp}_${originalName}`;
    },
  },
});

const upload = multer({ storage });

module.exports = upload;
