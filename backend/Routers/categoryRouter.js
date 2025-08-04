const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categoryControllers')
const authenticate = require('../middleWare/authenticate');
const authorize = require('../middleWare/role.middleWare.js')
const Category = require('../models/Category');
const paginateMiddleWare = require('../middleWare/paginate.middleWare')

const upload = require('../config/multerConfig');
// for admin
router.post('/', authenticate ,authorize('admin'),   upload.single('categoryImage'), categoryControllers.addCategory);
router.get('/get-by-admin', authenticate ,authorize('admin'), paginateMiddleWare(Category,{
  searchField: 'categoryName',
  }), categoryControllers.getAllCategoryByAdmin);
router.get('/get-by-admin/:categoryId', authenticate ,authorize('admin'),  categoryControllers.getCategoryByIdByAdmin);
router.put('/:categoryId', authenticate ,authorize('admin'),  upload.single('categoryImage'), categoryControllers.updateCategory);
router.delete('/:categoryId', authenticate ,authorize('admin'),  categoryControllers.deletecategory);



// for user
router.get('/', paginateMiddleWare(Category,{
  searchField: 'categoryName',
  }), categoryControllers.getAllcategory);
router.get('/:categoryId', categoryControllers.getcategoryById);

module.exports = router;
