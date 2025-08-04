const express = require('express');
const router= express.Router()
const subCategoryControllers = require('../controllers/subCategoryControllers')
const authenticate = require('../middleWare/authenticate');
const upload = require('../config/multerConfig');
const authorize = require('../middleWare/role.middleWare.js')
const Subcategory = require('../models/Subcategory');
const paginateMiddleWare = require('../middleWare/paginate.middleWare')

// for admin

router.post('/', authenticate, upload.single('subcategoryImage'), subCategoryControllers.addSubCategory)
router.get('/get-by-admin', authenticate ,authorize('admin'), paginateMiddleWare(Subcategory,{
  searchField: 'subcategoryName',
  }), subCategoryControllers.getAllSubCategory)
router.get('/get-by-admin/:subCategoryId', authenticate, subCategoryControllers.getSubCategoryById)
router.put('/:subCategoryId', authenticate, upload.single('subcategoryImage'), subCategoryControllers.updateSubCategory);
router.delete('/:subCategoryId', authenticate, subCategoryControllers.deleteSubCategory);


// for user
router.get('/' ,paginateMiddleWare(Subcategory,{
  searchField: 'categoryName',
  }),  subCategoryControllers.getAllSubCategoryByUser);
router.get('/:subCategoryId', subCategoryControllers.getSubcategoryByIdByUser);

module.exports = router;