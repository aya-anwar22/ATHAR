// controllers/reports/productReportControllers.js

const Product = require('../../models/Product');
const Brand = require('../../models/Brand');
const Subcategory = require('../../models/Subcategory');
const Category = require('../../models/Category');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// 🛒 1. Inventory Report
exports.getInventoryReport = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    },
    { $unwind: '$brand' },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subcategoryId',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: '$subcategory' },
    {
      $lookup: {
        from: 'categories',
        localField: 'subcategory.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        productName: 1,
        productSlug: 1,
        price: 1,
        quantity: 1,
        gender: 1,
        brand: {
          brandName: '$brand.brandName',
          brandSlug: '$brand.brandSlug'
        },
        subcategory: {
          subcategoryName: '$subcategory.subcategoryName',
          subcategorySlug: '$subcategory.subcategorySlug'
        },
        category: {
          categoryName: '$category.categoryName',
          categorySlug: '$category.categorySlug'
        }
      }
    }
  ]);

  res.json(products);
});

// 🧾 2. Soft Deleted Products Report
exports.getDeletedProductsReport = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    { $match: { isDeleted: true } },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    },
    { $unwind: '$brand' },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subcategoryId',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: '$subcategory' },
    {
      $lookup: {
        from: 'categories',
        localField: 'subcategory.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $lookup: {
        from: 'users',
        localField: 'deletedBy',
        foreignField: '_id',
        as: 'deletedByUser'
      }
    },
    {
      $project: {
        productName: 1,
        productSlug: 1,
        price: 1,
        quantity: 1,
        gender: 1,
        deletedAt: 1,
        brand: {
          brandName: '$brand.brandName',
          brandSlug: '$brand.brandSlug'
        },
        subcategory: {
          subcategoryName: '$subcategory.subcategoryName',
          subcategorySlug: '$subcategory.subcategorySlug'
        },
        category: {
          categoryName: '$category.categoryName',
          categorySlug: '$category.categorySlug'
        },
        deletedBy: { $arrayElemAt: ['$deletedByUser.email', 0] }
      }
    }
  ]);

  res.json(products);
});

// 💰 3. Price Report
exports.getPriceReport = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ price: -1 })
    .populate({
      path: 'brandId',
      select: 'brandName brandSlug'
    })
    .populate({
      path: 'subcategoryId',
      select: 'subcategoryName subcategorySlug'
    })
    

  // تعديل شكل الريسبونس عشان ترجع زي ما إنتي كتباه بالظبط
  const formattedProducts = products.map(product => ({
    _id: product._id,
    productName: product.productName,
    productSlug: product.productSlug,
    price: product.price,
    quantity: product.quantity,
    gender: product.gender,
    brand: product.brandId,
    subcategory: product.subcategoryId,
  }));

  res.json(formattedProducts);
});

// 🧍‍♂️🧍‍♀️ 4. Gender-Based Report
exports.getGenderReport = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    },
    { $unwind: '$brand' },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subcategoryId',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: '$subcategory' },
    {
      $lookup: {
        from: 'categories',
        localField: 'subcategory.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        productName: 1,
        productSlug: 1,
        price: 1,
        quantity: 1,
        gender: 1,
        brand: {
          brandName: '$brand.brandName',
          brandSlug: '$brand.brandSlug'
        },
        subcategory: {
          subcategoryName: '$subcategory.subcategoryName',
          subcategorySlug: '$subcategory.subcategorySlug'
        },
        category: {
          categoryName: '$category.categoryName',
          categorySlug: '$category.categorySlug'
        }
      }
    }
  ]);
  res.json(products);
});

// 🏷️ 5. Brand Report
exports.getBrandReport = asyncHandler(async (req, res) => {
  const report = await Product.aggregate([
    {
      $group: {
        _id: '$brandId',
        productCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: '_id',
        foreignField: '_id',
        as: 'brand'
      }
    },
    { $unwind: '$brand' },
    {
      $project: {
        brandName: '$brand.brandName',
        brandSlug: '$brand.brandSlug',
        productCount: 1
      }
    }
  ]);
  res.json(report);
});

// 📂 6. Subcategory Report
exports.getSubcategoryReport = asyncHandler(async (req, res) => {
  const report = await Product.aggregate([
    {
      $group: {
        _id: '$subcategoryId',
        productCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'subcategories',
        localField: '_id',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: '$subcategory' },
    {
      $project: {
        subcategoryName: '$subcategory.subcategoryName',
        subcategorySlug: '$subcategory.subcategorySlug',
        productCount: 1
      }
    }
  ]);
  res.json(report);
});

// 🕓 7. Time-Based Report
exports.getTimeBasedReport = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ message: 'Please provide from and to dates.' });
  }
  const products = await Product.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(from),
          $lte: new Date(to)
        }
      }
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand'
      }
    },
    { $unwind: '$brand' },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subcategoryId',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: '$subcategory' },
    {
      $lookup: {
        from: 'categories',
        localField: 'subcategory.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    {
      $project: {
        productName: 1,
        price: 1,
        createdAt: 1,
        brand: {
          brandName: '$brand.brandName',
          brandSlug: '$brand.brandSlug'
        },
        subcategory: {
          subcategoryName: '$subcategory.subcategoryName',
          subcategorySlug: '$subcategory.subcategorySlug'
        },
        category: {
          categoryName: '$category.categoryName',
          categorySlug: '$category.categorySlug'
        }
      }
    }
  ]);
  res.json(products);
});