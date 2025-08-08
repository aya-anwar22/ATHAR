const asyncHandler = require('express-async-handler');
const cloudinary = require('../config/cloudinary');
const { default: slugify } = require('slugify');

const Product = require('../models/Product');
const Collection = require('../models/Collections');

// // for admin
exports.addProduct = asyncHandler(async (req, res) => {
  const {
    productName,
    collectionsSlug,
    price,
    quantity,
    gender,
    stockAlertThreshold,
    description
  } = req.body;

  if (!productName || !collectionsSlug || !price || !quantity || !gender) {
    return res.status(400).json({
      message: "All required fields must be provided"
    });
  }

  const collection = await Collection.findOne({ collectionsSlug });
  if (!collection) {
    return res.status(404).json({ message: "Collection not found" });
  }

  const existingProduct = await Product.findOne({ productName });
  if (existingProduct) {
    return res.status(400).json({
      message: "Product name already exists. Please choose another name."
    });
  }

  try {
    // ✅ Upload all images to Cloudinary
    const uploadResults = await Promise.all(
      req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: 'product'
        })
      )
    );

    const productImages = uploadResults.map(result => result.secure_url);
    const productSlug = slugify(productName, { lower: true });

    const newProduct = await Product.create({
      productName,
      productSlug,
      collectionId: collection._id,
      price,
      quantity,
      gender,
      description,
      stockAlertThreshold,
      productImages
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



exports.getAllProduct = asyncHandler(async (req, res) => {
  const { dataActive, ...activeMeta } = res.paginateMiddleWare.active;
  const { dataDeleted, ...deletedMeta } = res.paginateMiddleWare.deleted;

  const populatedActive = await Product.populate(dataActive, {
    path: 'collectionId',
    select: 'collectionsSlug collectionsName',
  });

  const populatedDeleted = await Product.populate(dataDeleted, {
    path: 'collectionId',
    select: 'collectionsSlug collectionsName',
  });

  return res.status(200).json({
    activeProduct: {
      ...activeMeta,
      dataActive: populatedActive
    },
    deletedProduct: {
      ...deletedMeta,
      dataDeleted: populatedDeleted
    }
  });
});




exports.getProductBySlug = asyncHandler(async (req, res) => {
    const productSlug = req.params.productSlug;
    const product = await Product.findOne({ productSlug });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const productSlug = req.params.productSlug;
  const {
    productName,
    collectionsSlug,
    price,
    quantity,
    gender,
    stockAlertThreshold,
    description
  } = req.body;

  const product = await Product.findOne({ productSlug });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const collection = await Collection.findOne({ collectionsSlug });
  if (!collection) {
    return res.status(404).json({ message: "Collection not found" });
  }

  if (productName && productName !== product.productName) {
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists. Please choose another name." });
    }
  }

  try {
    let imageUrls = product.productImages;

    // ✅ Handle multiple new images
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path, {
            folder: 'product'
          })
        )
      );
      const newImages = uploadResults.map(result => result.secure_url);
      imageUrls = imageUrls.concat(newImages); // keep existing + new
    }

    const updatedSlug = productName
      ? slugify(productName, { lower: true })
      : product.productSlug;

    const updateData = {
      productName: productName || product.productName,
      productSlug: updatedSlug,
      collectionId: collection._id,
      price: price || product.price,
      quantity: quantity || product.quantity,
      gender: gender || product.gender,
      description: description || product.description,
      stockAlertThreshold: stockAlertThreshold || product.stockAlertThreshold,
      productImages: imageUrls
    };

    const updatedProduct = await Product.findOneAndUpdate(
      { productSlug },
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


exports.removeImageFromProduct = asyncHandler(async (req, res) => {
    const productSlug = req.params.productSlug;
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL is required" });
    }

    // 1. نجيب المنتج
    const product = await Product.findOne({ productSlug });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    // 2. نتحقق إن الصورة موجودة
    const imageIndex = product.productImages.indexOf(imageUrl);
    if (imageIndex === -1) {
        return res.status(404).json({ message: "Image not found in product" });
    }

    // 3. نحذف الصورة من Cloudinary (اختياري)
    const publicId = imageUrl.split('/').pop().split('.')[0]; // استخراج public_id من الرابط
    try {
        await cloudinary.uploader.destroy(`product/${publicId}`);
    } catch (err) {
        console.warn("Cloudinary image not deleted:", err.message);
    }

    // 4. نحذف الرابط من المصفوفة
    product.productImages.splice(imageIndex, 1);

    await product.save();

    return res.status(200).json({
        message: "Image removed successfully",
        product
    });
});


exports.deleteProduct = asyncHandler(async (req, res) => {
    const productSlug = req.params.productSlug;
    const product = await Product.findOne({ productSlug });

    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    if (product.isDeleted) {
        product.isDeleted = false;
        product.deletedAt = null;
        product.deletedBy = null;
        await product.save();
        return res.status(200).json({ message: 'Product restored successfully' });
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deletedBy = req.user._id;

    await product.save();
    return res.status(200).json({ message: "Product soft-deleted successfully" });
});

// // for user
exports.getAllProductByUser = asyncHandler(async (req, res) => {
const collectionsSlug = req.query.collectionsSlug;

    let filter = { isDeleted: false };

    if (collectionsSlug) {
        // دور على الكولكشن بناءً على الـ slug
        const collection = await Collection.findOne({ collectionsSlug, isDeleted: false });

        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }

        filter.collectionId = collection._id;
    }

    const products = await Product.find(filter).populate({
  path: 'collectionId',
  select: 'collectionsName collectionsSlug'
});


    return res.status(200).json({
        message: 'Filtered products',
        activeProduct: {
            total: products.length,
            dataActive: products,
            currentPage: 1,
            totalPages: 1
        }
    });
});


exports.getProductBySlugByUser = asyncHandler(async (req, res) => {
    const productSlug = req.params.productSlug;

    const product = await Product.findOne({
  productSlug,
  isDeleted: false
})
.select('-isDeleted -deletedAt -deletedBy')
.populate({
  path: 'collectionId',
  select: 'collectionsName collectionsSlug'
});


    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
});
