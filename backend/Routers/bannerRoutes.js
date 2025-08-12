const express = require('express')
const router = express.Router();
const bannerController = require('../controllers/bannerController')
const authenticate = require('../middleWare/authenticate')
const upload = require('../config/multerConfig');
const authorize = require('../middleWare/role.middleWare.js');


router.post('/', authenticate,
  authorize('admin'),
  upload.single('bannerImage'), bannerController.createBanner);  

router.get('/', bannerController.getBanners);   
router.get('/:id', bannerController.getBannerById);

router.delete('/:id', authenticate,
  authorize('admin'),
  upload.single('collectionsImage'),  bannerController.deleteBanner); 

module.exports = router;