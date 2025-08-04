// controllers/dashboardController.js
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

exports.getDashboardData = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('userId');

    const topProducts = await Product.find().sort({ soldCount: -1 }).limit(4);

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
