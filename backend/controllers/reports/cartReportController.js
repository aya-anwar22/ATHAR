const Cart = require('../../models/Cart');

exports.getCartReport = async (req, res) => {
  try {
    const report = await Cart.aggregate([
      {
        $project: {
          userId: 1,
          numberOfItems: { $size: '$items' },
          totalCartValue: {
            $sum: {
              $map: {
                input: '$items',
                as: 'item',
                in: { $multiply: ['$$item.quantity', '$$item.currentPrice'] }
              }
            }
          },
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Cart report generated successfully',
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating cart report',
      error: error.message
    });
  }
};
