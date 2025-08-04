const asyncHandler = require('express-async-handler');
const About = require('../models/aboutUs')
const cloudinary = require('../config/cloudinary');

exports.addAbout = asyncHandler(async(req, res) =>{
      console.log('User from req:', req.user); 
        const isAdmin = req.user && req.user.role === 'admin';

    console.log(`isAdmin ${isAdmin}`)
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    const {bio, title} = req.body;
    if(!bio || !title){
        return res.status(400).json({message: "all filed bio, title, photoUrl  required"})
    }

    const photoUrl = req.file.path;
    const newAbout = await About.create({
        bio, title, photoUrl
    })
    await newAbout.save();
    res.status(201).json({
        message: "About creat Seccessfully"
    })
})

exports.getAbout = asyncHandler(async(req, res) =>{
    const about = await About.find();

    res.status(200).json({about});
})

exports.updateAbout = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { bio, title } = req.body;
    const photoUrl = req.file ? req.file.path : req.body.photoUrl;
    const aboutId = req.params.aboutId;

    const about = await About.findById(aboutId);
    if (!about) {
        return res.status(404).json({ message: "About not found" });
    }

    about.bio = bio || about.bio;
    about.title = title || about.title;
    about.photoUrl = photoUrl || about.photoUrl;
    
    await about.save();
    res.status(200).json({ about });
});

exports.deletAbout = asyncHandler(async(req, res) =>{
   const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    const aboutId = req.params.aboutId
    
    const about = await About.findByIdAndDelete(aboutId);
    if(!about){
        return res.status(404).json({message: "About not found"})
    }
    res.status(202).json({message : "About delete Sucessfully"});
})