const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/productControllers');
const authenticate = require('../middleWare/authenticate');
const upload = require('../config/multerConfig');
const authorize = require('../middleWare/role.middleWare.js');
const Product = require('../models/Product');
const paginateMiddleWare = require('../middleWare/paginate.middleWare');

// for admin
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.array('productImages', 5),
  productControllers.addProduct
);


router.get(
  '/get-by-admin',
  authenticate,
  authorize('admin'),
  paginateMiddleWare(Product, {
    searchField: 'productName',
  }),
  productControllers.getAllProduct
);

router.get(
  '/get-by-admin/:productSlug',
  authenticate,
  authorize('admin'),
  productControllers.getProductBySlug
);

router.patch(
  '/:productSlug',
  authenticate,
  authorize('admin'),
  upload.array('productImages', 5),
  productControllers.updateProduct
);
router.put('/remove-image/:productSlug', authenticate, authorize('admin'), productControllers.removeImageFromProduct);

router.delete(
  '/:productSlug',
  authenticate,
  authorize('admin'),
  productControllers.deleteProduct
);

// for user
router.get(
  '/',
  paginateMiddleWare(Product, {
    searchField: 'productName',
  }),
  productControllers.getAllProductByUser
);

router.get('/:productSlug', productControllers.getProductBySlugByUser);

module.exports = router;
