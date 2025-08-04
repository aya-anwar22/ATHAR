const express = require('express');
const router = express.Router()
const orderControllers = require('../controllers/orderControllers')
const authenticate = require('../middleWare/authenticate');

//////////////////////for admin ///////////////
router.get('/orders', authenticate, orderControllers.getAllOrders);
router.get("/orders/:orderId", authenticate, orderControllers.getOrderDetails);
router.patch("/orders/:orderId", authenticate, orderControllers.updateOrderStatus);
router.get('/cart', authenticate, orderControllers.getAllCarts);


router.post('/', authenticate, orderControllers.createOrder);
router.get('/:orderId', authenticate, orderControllers.getOrderById);
router.get('/', authenticate, orderControllers.getOrders);
router.patch('/:orderId', authenticate, orderControllers.requestReturn);
router.patch('/:orderId/cancel', authenticate, orderControllers.cancelOrder);



module.exports = router;