const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { default: slugify } = require('slugify');
// for admin
exports.addCategory = asyncHandler(async(req, res) =>{
    const { categoryName } = req.body;
    try{
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'categorys'
        });
        const categorySlug = slugify(categoryName, {lower: true});
        const newCategory = await Category.create({
            categoryName,
            categoryImage: result.secure_url,
            categorySlug
        })
        res.status(201).json({
            message: "Category created Sucessfully",
            category: newCategory
        })
    }catch(error){
        console.error('Error Creating Category: ', error);
        return res.status(500).json({message: 'Error Creating Category: ', error})
    }
});

exports.getAllCategoryByAdmin = asyncHandler(async(req, res) =>{
    return res.status(200).json({
    activeCategory: res.paginateMiddleWare.active,
    deletedCategory: res.paginateMiddleWare.deleted

    })
});




exports.getCategoryByIdByAdmin = asyncHandler(async(req, res) =>{
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId)
    if(!category){
        return res.status(404).json({message: "Category not found"});
    }
    return res.status(200).json({
        message: category
    })
})


exports.updateCategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const { categoryName } = req.body;

  

    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: "category not found" });
    }

    try {
        let imageUrl = category.categoryImage;

        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categorys'
            });
            imageUrl = result.secure_url;
        }

        const categorySlug = slugify(categoryName, { lower: true });

        const updatedcategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                categoryName,
                categorySlug,
                categoryImage: imageUrl
            },
            { new: true }
        );

        res.status(200).json({
            message: "category updated successfully",
            category: updatedcategory
        });
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ message: "Error updating category" });
    }
});

exports.deletecategory = asyncHandler(async (req, res) => {
    const categoryId = req.params.categoryId;
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'category not found' });
    }

    if (category.isDeleted) {
        category.isDeleted = false;
        category.deletedAt = null;
        category.deletedBy = null;
        await category.save();
        return res.status(200).json({ message: 'category restored successfully' });    }

    category.isDeleted = true;
    category.deletedAt = new Date();
    category.deletedBy = req.user._id;

    await category.save();

    res.status(200).json({ message: 'category soft-deleted successfully' });
});

// for user
exports.getAllcategory = asyncHandler(async(req, res) =>{
   
    return res.status(200).json({
    activecategory: res.paginateMiddleWare.active,
  });
})

exports.getcategoryById = asyncHandler(async(req, res) => {
    const categoryId = req.params.categoryId;
    
    const category = await Category.findOne({
    _id: categoryId,
    isDeleted: false
    }).select('-isDeleted -deletedAt -deletedBy');

    if(!category){
        return res.status(404).json({message: "category not found"});
    }
    return res.status(200).json({category})
})