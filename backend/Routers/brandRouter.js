const express = require('express');
const router = express.Router();
const brandControllers = require('../controllers/brandControllers');
const authenticate = require('../middleWare/authenticate');
const upload = require('../config/multerConfig');
const authorize = require('../middleWare/role.middleWare.js')
const Brand = require('../models/Brand');
const paginateMiddleWare = require('../middleWare/paginate.middleWare')

// for admin   
router.post('/', authenticate ,authorize('admin') ,upload.single('brandImage'), brandControllers.addBrand);
router.get('/get-by-admin',authenticate ,authorize('admin'),paginateMiddleWare(Brand,{
  searchField: 'brandName',
  }),brandControllers.getAllBrandByAdmin);
router.get('/get-by-admin/:brandId',authenticate ,authorize('admin') ,  brandControllers.getBrandByIdByAdmin);
router.put('/:brandId',authenticate ,authorize('admin') ,upload.single('brandImage'),  brandControllers.updateBrand);
router.patch('/:brandId', authenticate ,authorize('admin') , brandControllers.deleteBrand);



// for user
router.get('/',paginateMiddleWare(Brand,{
  }), brandControllers.getAllBrand);
router.get('/:brandId',  brandControllers.getBrandById);

module.exports = router;
