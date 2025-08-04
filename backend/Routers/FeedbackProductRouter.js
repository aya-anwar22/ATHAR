const express = require('express');
const router = express.Router();
const feedbackProductController = require('../controllers/FeedbackProductController');
const authenticate = require('../middleWare/authenticate');
const authorize = require('../middleWare/role.middleWare.js')
// Add feedback (user)
router.post('/', feedbackProductController.addFeedback);
router.get('/admin/all', authenticate, authorize('admin'), feedbackProductController.getAllFeedbacksForAdmin);

// Approve feedback (admin only)
router.patch('/:id/approve', authenticate, authorize('admin'), feedbackProductController.approveFeedback);

// Get approved feedbacks for a product (public)
router.get('/', feedbackProductController.getApprovedFeedbacks);

module.exports = router;
