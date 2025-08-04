const transporter  = require('../config/mailConfig');
const contactUs = require('../models/contactUs');
const asyncHandler = require('express-async-handler');

exports.contactUs = asyncHandler(async(req, res) =>{
    const {name, email, subject, message} = req.body;
    if(!email){
        return res.status(400).json({
            message: "Email required"
        })
    }
    const newContactMessage = new contactUs({
        name, email, subject, message
    })
    await newContactMessage.save();
    const mailOptions = {
            from: email,
            to: process.env.ADMIN_EMAIL,
            subject: `${subject}`,
            text: `You have received a new message from:
                   \nName: ${name}
                   \nEmail: ${email}
                   \nMessage: ${message}`,
        };

        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Message sent successfully' });
});


exports.getAllMessage = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await contactUs.find()
    res.status(200).json(messages)
})

exports.replyToMessage = asyncHandler(async(req, res) =>{
    const isAdmin = req.user && req.user.role === 'admin';
    console.log(`isAdmin ${isAdmin}`)
    if (!isAdmin) {
        return res.status(403).json({ message: 'Access denied' });
    }
    const {messageId, adminReply} =req.body;
    const message = await contactUs.findById(messageId);
    if(!message){
        return res.status(404).json({
            message: "Message not found"
        });
    }
    message.isReplyed= true
    message.adminReply= adminReply;
    await message.save();
    const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: message.email,
            subject: 'Reply to Your Message',
            text: `Dear ${message.name},\n\n${adminReply}\n\nBest regards,\nAdmin`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({
        message: "Admin reply Successfully"
    })
})