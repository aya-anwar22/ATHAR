const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');
const authenticate = require('../middleWare/authenticate');
const upload = require('../config/multerConfig');
const authorize = require('../middleWare/role.middleWare.js')
const Product = require('../models/Product');
const paginateMiddleWare = require('../middleWare/paginate.middleWare')

// for admin
router.post('/', authenticate, authorize('admin'),  upload.single('productImages'), productControllers.addProduct);
router.get('/get-by-admin',authenticate, authorize('admin'), paginateMiddleWare(Product,{
  searchField: 'productName',
  }),   productControllers.getAllProduct);
router.get('/get-by-admin/:productId',authenticate, authorize('admin'),  productControllers.getProductById);
router.put('/:productId',authenticate, authorize('admin'),  upload.single('productImages'),  productControllers.updateProduct);
router.delete('/:productId',authenticate, authorize('admin'),   productControllers.deleteProduct);

// // for user
router.get('/', paginateMiddleWare(Product,{
  searchField: 'productName',
  }), productControllers.getAllProductByUser);
router.get('/:productId',  productControllers.getProductByIdByUser);

module.exports = router;
