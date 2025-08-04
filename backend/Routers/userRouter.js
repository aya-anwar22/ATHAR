const express = require('express');
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const authenticate = require('../middleWare/authenticate');
const paginateMiddleWare = require('../middleWare/paginate.middleWare')
const User = require('../models/User.js');
const authorize = require('../middleWare/role.middleWare.js')
// for user
router.get('/profile', authenticate, userControllers.getUserProfile)
router.put('/profile', authenticate, userControllers.updateProfile)
router.delete('/profile', authenticate, userControllers.deleteProfile)

// for admin
router.get('/',paginateMiddleWare(User, {
    searchField: 'userName',
    select: '-password -emailVerificationCode -verificationCodeExpiry -resetPasswordCode -resetPasswordExpiry -refreshToken -refreshTokenExpiry'
  }), authenticate,authorize('admin'), userControllers.getAllUser)
router.get('/:userId', authenticate,authorize('admin'), userControllers.getUserById)
router.put('/:userId', authenticate, authorize('admin'), userControllers.updateUser)
router.delete('/:userId', authenticate, authorize('admin'), userControllers.deleteUser)



module.exports = router;