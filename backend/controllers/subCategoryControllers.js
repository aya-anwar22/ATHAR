const SubCategory = require('../models/Subcategory');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { default: slugify } = require('slugify');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');

// for admin
exports.addSubCategory = asyncHandler(async(req, res) =>{
    const { subcategoryName, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({message : "Category not found"})
    }
    try{
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'subCategory'
        });

        const subCategorySlug = slugify(subcategoryName, {lower: true});
        const newSubCat = await SubCategory.create({
            subcategoryName,
            subCategorySlug,
            categoryId,
            subcategoryImage: result.secure_url
        })
        res.status(201).json({
            message: "SubCategory create Successfully",
            subCategory: newSubCat
        })
    } catch(error){
        return res.status(501).json({message: error.message})
    }
});

exports.getAllSubCategory = asyncHandler(async(req, res) =>{
    return res.status(200).json({
    activeSubCategory: res.paginateMiddleWare.active,
    deletedSubCategory: res.paginateMiddleWare.deleted

    })
});

exports.getSubCategoryById = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === 'admin';
    const subCategoryId = req.params.subCategoryId
    const subCategory = await SubCategory.findById(subCategoryId);
    if(!subCategory){
        return res.status(404).json({message : "Sub Category not found"})
    }
    return res.status(200).json({
        message: subCategory
    })
})

exports.updateSubCategory = asyncHandler(async (req, res) => {
    const subCategoryId = req.params.subCategoryId;
    const { subcategoryName, categoryId } = req.body;
    const category = await Category.findById(categoryId);
    if(!category){
        return res.status(404).json({message : "Category not found"})
    }
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }

    try {
        let imageUrl = subCategory.subcategoryImage;
        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'sub-categorys'
            });
            imageUrl = result.secure_url;
        }

        const subcategorySlug = subcategoryName
            ? slugify(subcategoryName, { lower: true })
            : subCategory.subcategorySlug;

        const updateData = {
            subcategoryName: subcategoryName || subCategory.subcategoryName,
            subcategorySlug,
            subcategoryImage: imageUrl,
            categoryId: categoryId || subCategory.categoryId
        };

        const updateSubCategory = await SubCategory.findByIdAndUpdate(
            subCategoryId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "Sub-Category updated successfully",
            subCategory: updateSubCategory
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating category", error });
    }
});

exports.deleteSubCategory = asyncHandler(async(req, res) =>{
    const subCategoryId = req.params.subCategoryId;
    const subCategory = await SubCategory.findById(subCategoryId);
    if(!subCategory){
        return res.status(404).json({
            message: "SubCategory not found"
        })
    }
     if (subCategory.isDeleted) {
        subCategory.isDeleted = false;
        subCategory.deletedAt = null;
        subCategory.deletedBy = null;
        await subCategory.save();
        return res.status(200).json({ message: 'subCategory restored successfully' });
    }

    subCategory.isDeleted = true;
    subCategory.deletedAt = new Date();
    subCategory.deletedBy = req.user._id

    await subCategory.save();
    res.status(200).json({
        message : "Sub-Category soft-deleted successfully"
    })
})

// for user
exports.getAllSubCategoryByUser = asyncHandler(async(req, res) =>{

    return res.status(200).json({
    activesubcategory: res.paginateMiddleWare.active,
  });

    })

exports.getSubcategoryByIdByUser = asyncHandler(async(req, res) =>{
    const subCategoryId = req.params.subCategoryId
    const subCategory = await SubCategory.findOne({
    _id: subCategoryId,
    isDeleted: false
    }).select('-isDeleted -deletedAt -deletedBy');
    if(!subCategory){
        return res.status(404).json({
            message: "Sub-Category not found"
        })
    }
    return res.status(200).json(subCategory)

})