const express = require('express');
const router = express.Router()
const reviewControllers = require('../controllers/reviewControllers')
const authenticate = require('../middleWare/authenticate');

router.post('/', reviewControllers.addRevirw)
router.get('/', reviewControllers.getAllReview)
router.get('/admin',authenticate,  reviewControllers.getAllReviewByAdmin)
router.put('/:reviewId',authenticate,  reviewControllers.acceccptReview)
router.delete('/:reviewId',authenticate,  reviewControllers.deleteReview)




module.exports = router;