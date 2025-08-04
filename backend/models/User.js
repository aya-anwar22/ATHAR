const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    googleId: String,

  userName: {
    type: String,
    // required:true,
    // minlength: [3, 'Name cannot be smaller than 3 characters'],
    // maxlength: [100, 'Name cannot be longer than 50 characters'],
  },
  email: {
    type: String,
    unique: true,
  
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
      'Please enter a valid email'
    ],
  },

  password: {
    type: String,
    // required: true,
    // minlength: [10, 'Too short Password']
  },

  emailVerificationCode: {
    type: String,
    default: null,
    minlength: [6, 'email Verification Code cannot be smaller than 6 characters'],
    maxlength: [6, 'email Verification Code cannot be longer than 6 characters'],
  },
  verificationCodeExpiry: { // Verification code expiration date
    type: Date,
    default: null
  },
  resetPasswordCode: {
    type: String,
    default: null,
    minlength: [6, 'reset Password Code cannot be smaller than 6 characters'],
    maxlength: [6, 'reset Password Code cannot be longer than 6 characters'],
  },
  resetPasswordExpiry: {
    type: Date,
    default: null
  },


  isVerified: {
    type: Boolean,
    default: false
  },
  phoneNumber: {
    type: String,
    // required:true,
    // unique: true,
    // validate:{
    //     validator:function(v){
    //         return /\d{11/.test(v);
    //     },
    //     message: number => `${number.value} Not a valid phone number! Must be 11 digits.`
    // }

  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: function () {
      return this.email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    }
  },
  addresses: [
    {
      label: String,
      details: String,
      isDefault: Boolean
    }
  ],
  isDeleted:{
              type: Boolean,
              default:false,
          },
          deletedAt: {
              type: Date,
              default: null
        },
        deletedBy:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default:null
        },                          
  refreshToken: {
    type: String,
    default: null
  },
  refreshTokenExpiry: {
    type: Date,
    default: null
  },



}, { timestamps: true });


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Encrypt the password before saving
  this.password = await bcrypt.hash(this.password, 10);
  this.updated_at = Date.now();
  next();
});


userSchema.methods.correctPassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
}
const User = mongoose.model('User', userSchema);
module.exports = User;