const bcrypt = require("bcryptjs");
const User = require('../models/User.js');
const asyncHandler = require("express-async-handler");
// for admin


// get all user
exports.getAllUser = asyncHandler(async(req, res) =>{    
    return res.status(200).json({
    activeUsers: res.paginateMiddleWare.active,
    deletedUsers: res.paginateMiddleWare.deleted
  });
})

// get userById
exports.getUserById = asyncHandler(async(req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password -emailVerificationCode -verificationCodeExpiry -resetPasswordCode -resetPasswordExpiry -refreshToken -refreshTokenExpiry');
    if(!user){
        return res.status(404).json({message: "user not found"})
    }
    res.status(200).json(user)

})

// update user
exports.updateUser = asyncHandler(async(req, res) =>{
    const userId = req.params.userId;
    const { role } = req.body;
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    user.role = role;
    await user.save();
    res.status(200).json({
        message: "user Update Successfully"
    })


})

////////delete and restore User////
exports.deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User Not Found' });
    }

    if (user.isDeleted) {
        user.isDeleted = false;
        user.deletedAt = null;
        user.deletedBy = null;
        await user.save();
        return res.status(200).json({ message: 'User restored successfully' });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    await user.save();

    res.status(200).json({ message: 'User soft-deleted successfully' });
});

// for user

// get User Profile
exports.getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    const user = await User.findById(userId).select('-emailVerificationCode -verificationCodeExpiry -resetPasswordCode -resetPasswordExpiry -refreshToken -refreshTokenExpiry -deletedBy')
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }
    res.status(200).json(user);
});

//update User Profile
exports.updateProfile = asyncHandler(async(req, res) =>{
    const userId = req.user._id; 
    const user = await User.findById(userId)
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    if (user.isDeleted) {
        return res.status(403).json({ message: "Access denied. User is deleted." });
    }
    
    const {userName, password, phoneNumber, addresses} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    user.userName = userName;
    user.password = hashedPassword;
    user.phoneNumber = phoneNumber;
    user.addresses = addresses;
    await user.save();
    res.status(200).json({
        message : "User Update Sucessfully"
    })

})
//delete User Profile
exports.deleteProfile = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message: "User Not Found"
        })
    }
    user.isDeleted = true;
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    await user.save()
    res.status(200).json({ message: 'user soft-deleted successfully' });
    

})