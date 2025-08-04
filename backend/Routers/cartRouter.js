const express = require('express');
const router = express.Router()
const cartControllers = require('../controllers/cartControllers')
const authenticate = require('../middleWare/authenticate');

router.post('/', authenticate, cartControllers.addToCart);
router.get('/', authenticate, cartControllers.getCart);
router.patch('/', authenticate, cartControllers.updateCartItem);
router.delete('/:productId', authenticate, cartControllers.removeFromCart);


module.exports = router;