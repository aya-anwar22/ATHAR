const asyncHandler = require('express-async-handler');
const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');

exports.getOrderSummaryReport = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $multiply: ["$items.quantity", "$items.priceAtOrderTime"]
          }
        }
      }
    }
  ]);
  res.json(result[0] || { totalOrders: 0, totalRevenue: 0 });
});

exports.getOrderStatusReport = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);
  const formatted = {};
  result.forEach(r => {
    formatted[r._id] = r.count;
  });
  res.json(formatted);
});

exports.getTopSellingProducts = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        productName: "$product.productName",
        productSlug: "$product.productSlug",
        totalSold: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);
  res.json(result);
});

exports.getPaymentMethodReport = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$paymentMethod",
        count: { $sum: 1 }
      }
    }
  ]);
  const formatted = {};
  result.forEach(r => {
    formatted[r._id] = r.count;
  });
  res.json(formatted);
});

exports.getReturnOrdersReport = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments({ returnRequested: true });
  res.json({ returnRequestedOrders: count });
});

exports.getCancelledOrdersReport = asyncHandler(async (req, res) => {
  const count = await Order.countDocuments({ "cancellation.isCancelled": true });
  res.json({ cancelledOrders: count });
});

exports.getOrdersBetweenDates = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return res.status(400).json({ message: 'Please provide from and to dates.' });
  }

  const orders = await Order.find({
    placedAt: {
      $gte: new Date(from),
      $lte: new Date(to)
    }
  });

  res.json(orders);
});

exports.getTopCustomersReport = asyncHandler(async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$userId",
        totalOrders: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        username: "$user.username",
        email: "$user.email",
        totalOrders: 1
      }
    },
    { $sort: { totalOrders: -1 } },
    { $limit: 10 }
  ]);
  res.json(result);
});
