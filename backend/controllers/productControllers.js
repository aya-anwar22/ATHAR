const SubCategory = require('../models/Subcategory');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { default: slugify } = require('slugify');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const Brand = require('../models/Brand');

// // for admin
exports.addProduct = asyncHandler(async(req, res) =>{
    const { productName,subcategoryId, brandId, price, quantity,gender, stockAlertThreshold} = req.body;
    if(!productName|| !subcategoryId || !brandId || !price|| !quantity|| !gender|| !stockAlertThreshold){
        return res.status(400).json({
            message: "All filed required"
        })
    }

    const subcategory = await SubCategory.findById(subcategoryId);
    if(!subcategory){
        return res.status(404).json({message : "subcategory not found"})
    }

    const brand = await Brand.findById(brandId);
    if(!brand){
        return res.status(404).json({message : "brand not found"})
    }
    try{
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'product'
        });

        const productSlug = slugify(productName, {lower: true});
        const newProduct = await Product.create({
            productName,productSlug, subcategoryId, brandId, price, quantity,gender, stockAlertThreshold,
        
            productImages: result.secure_url
        })
        res.status(201).json({
            message: "Product create Successfully",
            Product: newProduct
        })
    } catch(error){
        return res.status(501).json({message: error.message})
    }
});

exports.getAllProduct = asyncHandler(async(req, res) =>{
   return res.status(200).json({
    activeProduct: res.paginateMiddleWare.active,
    deletedProduct: res.paginateMiddleWare.deleted

    })
});

exports.getProductById = asyncHandler(async(req, res) =>{
    const productId = req.params.productId
    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({message : "product not found"})
    }
    return res.status(200).json({
        message: product
    })
})

exports.updateProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
    const { productName,subcategoryId, brandId, price, quantity,gender, stockAlertThreshold} = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "product not found" });
    }
    const brand = await Brand.findById(brandId);
    if(!brand){
        return res.status(404).json({message : "Brand not found"})
    }
    const subCategory = await SubCategory.findById(subcategoryId);
    if (!subCategory) {
        return res.status(404).json({ message: "SubCategory not found" });
    }


    

    try {
        let imageUrl = product.productImages;
        if (req.file && req.file.path) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'product'
            });
            imageUrl = result.secure_url;
        }

        const productSlug = productName
            ? slugify(productName, { lower: true })
            : product.productSlug;

        const updateData = {
            productName: productName || product.productName,
            productSlug,
            productImages: imageUrl,
            subcategoryId: subcategoryId || product.subcategoryId,
            brandId: brandId || product.brandId,
            price: price || product.price,
            quantity: quantity || product.quantity,
            gender: gender || product.gender,
            stockAlertThreshold: stockAlertThreshold || product.stockAlertThreshold,
        };

        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updateProduct
        });
    } catch (error) {
        return res.status(500).json({ message: "Error updating category", error });
    }
});

exports.deleteProduct = asyncHandler(async(req, res) =>{
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if(!product){
        return res.status(404).json({
            message: "product not found"
        })
    }

    if (product.isDeleted) {
        product.isDeleted = false;
        product.deletedAt = null;
        product.deletedBy = null;
        await product.save();
        return res.status(200).json({ message: 'product restored successfully' });
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deletedBy = req.user._id

    await product.save();
    res.status(200).json({
        message : "product soft-deleted successfully"
    })
})

// // for user

exports.getAllProductByUser = asyncHandler(async (req, res) => {
  const categoryId = req.query.category;
  const brandId = req.query.brand;
  const subcategoryId = req.query.subcategory;

  // 1️⃣ تجهيز فلتر فارغ
  let filter = { isDeleted: false };

  // 2️⃣ لو فيه subcategoryId → نحطه في الفلتر
  if (subcategoryId) {
    filter.subcategoryId = subcategoryId;
  }

  // 3️⃣ لو فيه categoryId → نجيب الـ subcategories اللي جواه ونفلتر بيها
  if (categoryId) {
    const subcategories = await Subcategory.find({ categoryId, isDeleted: false }).select('_id');
    const subcategoryIds = subcategories.map(sc => sc._id);
    filter.subcategoryId = { $in: subcategoryIds };
  }

  // 4️⃣ لو فيه brandId
  if (brandId) {
    filter.brandId = brandId;
  }

  // 5️⃣ جلب المنتجات بعد الفلترة
  const products = await Product.find(filter);

  return res.status(200).json({
    message: 'Filtered products',
    activeProdut: {
      total: products.length,
      dataActive: products,
      currentPage: 1,
      totalPages: 1
    }
  });
});

exports.getProductByIdByUser = asyncHandler(async(req, res) =>{
    const productId = req.params.productId
    const product = await Product.findOne({
    _id: productId,
    isDeleted: false
    }).select('-isDeleted -deletedAt -deletedBy');
    if(!product){
        return res.status(404).json({
            message: "productnot found"
        })
    }
    return res.status(200).json(product)

})