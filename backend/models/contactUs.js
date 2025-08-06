const mongoose = require('mongoose');
const validator = require('validator');

const contactUsSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
          validator: validator.isEmail,
          message: 'Please provide a valid email address'
        }
      },
      subject:{
        type: String,
      },
      message:String,
      isReplyed :{
        type:Boolean,
        default:false,
      },
      adminReply:String
}, { timestamps: true });
const ContactUs = mongoose.model('ContactUs', contactUsSchema);
module.exports = ContactUs