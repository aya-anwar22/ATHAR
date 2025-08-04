const cloudinary = require('../config/cloudinary');
const slugify = require('slugify');
const Brand = require('../models/Brand');
const asyncHandler = require('express-async-handler');

// for admin
exports.addBrand = asyncHandler(async (req, res) => {
    const { brandName } = req.body;
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'brands'
        });
        const brandSlug = slugify(brandName, { lower: true });

        const newBrand = await Brand.create({
            brandName,
            brandSlug,
            brandImage: result.secure_url
        });

        res.status(201).json({
            message: "Brand created successfully",
            brand: newBrand
        });
    } catch (error) {
        console.error('Error creating brand:', error);
        return res.status(500).json({ message: "Error creating brand" });
    }
});


exports.getAllBrandByAdmin = asyncHandler(async(req, res) =>{
    return res.status(200).json({
    activeBrands: res.paginateMiddleWare.active,
    deletedBrands: res.paginateMiddleWare.deleted
  });
})

exports.getBrandByIdByAdmin = asyncHandler(async(req, res) => {
    const brandId = req.params.brandId;
    const brand = await Brand.findById(brandId);
    if(!brand){
        return res.status(404).json({message: "Brand not found"});
    }
    return res.status(200).json({brand})
});

exports.updateBrand = asyncHandler(async (req, res) => {
    const brandId = req.params.brandId;
    const { brandName } = req.body;
    const brand = await Brand.findById(brandId);
    if (!brand) {
        return res.status(404).json({ message: "Brand not found" });
    }

    try {
        let imageUrl = brand.brandImage;

        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'brands'
            });
            imageUrl = result.secure_url;
        }

        const brandSlug = slugify(brandName, { lower: true });

        const updatedBrand = await Brand.findByIdAndUpdate(
            brandId,
            {
                brandName,
                brandSlug,
                brandImage: imageUrl
            },
            { new: true }
        );

        res.status(200).json({
            message: "Brand updated successfully",
            brand: updatedBrand
        });
    } catch (error) {
        console.error('Error updating brand:', error);
        return res.status(500).json({ message: "Error updating brand" });
    }
});


exports.deleteBrand = asyncHandler(async (req, res) => {
    const brandId = req.params.brandId;

    const brand = await Brand.findById(brandId);
    if (!brand) {
        return res.status(404).json({ message: 'Brand not found' });
    }
    if (brand.isDeleted) {
        brand.isDeleted = false;
        brand.deletedAt = null;
        brand.deletedBy = null;
        await brand.save();
        return res.status(200).json({ message: 'brand restored successfully' });
    }
    brand.isDeleted = true;
    brand.deletedAt = new Date();
    brand.deletedBy = req.user._id;

    await brand.save();

    res.status(200).json({ message: 'Brand soft-deleted successfully' });
});

// for user
exports.getAllBrand = asyncHandler(async(req, res) =>{
   return res.status(200).json({
    activeBrands: res.paginateMiddleWare.active,
  });
})

exports.getBrandById = asyncHandler(async(req, res) => {
    const brandId = req.params.brandId;
    
    const brand = await Brand.findOne({
    _id: brandId,
    isDeleted: false
    }).select('-isDeleted -deletedAt -deletedBy');

    if(!brand){
        return res.status(404).json({message: "Brand not found"});
    }
    return res.status(200).json({brand})
})