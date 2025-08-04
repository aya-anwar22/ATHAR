const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User.js');
const sendSMS = require('../utils/sendSMS.js');
const asyncHandler = require("express-async-handler");
const transporter = require('../config/mailConfig');
const EMAIL_VERIFICATION_TIMEOUT = 10 * 60 * 1000;
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();
// generateTokens 
async function generateTokens(user, regenerateRefreshToken = false) {
    const accessToken = jwt.sign(
        { userId: user.id,role: user.role, userName:user.userName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    let refreshToken = user.refreshToken;
    let refreshTokenExpiry = user.refreshTokenExpiry;

    if (regenerateRefreshToken || !refreshToken || new Date() > refreshTokenExpiry) {
        refreshToken = jwt.sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "10d" }
        );
        refreshTokenExpiry = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

        user.set({ refreshToken, refreshTokenExpiry });
        await user.save(); 
    }

    return { accessToken, refreshToken, refreshTokenExpiry };
}

// sendVerificationEmail 
const sendVerificationEmail = async (user) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: 'ATHAR - Verify Your Email Address',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f5f2; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; overflow: hidden; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header with Brand Logo -->
          <div style="background-color: #b47d49; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px;">ATHAR</h1>
            <p style="color: #f0e7df; margin: 5px 0 0; font-size: 14px;">Elevate Your Style</p>
          </div>
          
          <!-- Email Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; font-size: 24px; margin-top: 0; text-align: center;">Welcome to ATHAR</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Dear <strong>${user.userName || 'Valued Customer'}</strong>,
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Thank you for joining the ATHAR community! To complete your registration, please verify your email address using the code below:
            </p>
            
            <!-- Verification Code -->
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 2px; color: #b47d49; background-color: #f8f5f2; padding: 15px 30px; border-radius: 4px; border: 1px dashed #b47d49;">
                ${user.emailVerificationCode}
              </span>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              This code will expire in 10 minutes. If you didn't create an account with ATHAR, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f5f2; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              &copy; ${new Date().getFullYear()} ATHAR Fashion. All rights reserved.
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0;">
              Follow us: 
              <a href="#" style="color: #b47d49; text-decoration: none; margin: 0 5px;">Instagram</a> | 
              <a href="#" style="color: #b47d49; text-decoration: none; margin: 0 5px;">Facebook</a> | 
              <a href="#" style="color: #b47d49; text-decoration: none; margin: 0 5px;">Twitter</a>
            </p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// sendCodeEmail 
const sendCodeEmail = async (user) => {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: user.email,
    subject: 'ATHAR - Password Reset Request',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8f5f2; padding: 40px 0;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; overflow: hidden; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          
          <!-- Header with Brand Logo -->
          <div style="background-color: #b47d49; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px; letter-spacing: 1px;">ATHAR</h1>
            <p style="color: #f0e7df; margin: 5px 0 0; font-size: 14px;">Elevate Your Style</p>
          </div>
          
          <!-- Email Content -->
          <div style="padding: 30px;">
            <h2 style="color: #333; font-size: 24px; margin-top: 0; text-align: center;">Password Reset</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Hello <strong>${user.userName || 'Valued Customer'}</strong>,
            </p>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              We received a request to reset your ATHAR account password. Use the verification code below to proceed:
            </p>
            
            <!-- Reset Code -->
            <div style="text-align: center; margin: 30px 0;">
              <span style="display: inline-block; font-size: 28px; font-weight: bold; letter-spacing: 2px; color: #b47d49; background-color: #f8f5f2; padding: 15px 30px; border-radius: 4px; border: 1px dashed #b47d49;">
                ${user.resetPasswordCode}
              </span>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              For security reasons, this code will expire in 10 minutes. If you didn't request a password reset, please secure your account.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="#" style="display: inline-block; background-color: #b47d49; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">Visit ATHAR</a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f5f2; padding: 20px; text-align: center; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              Need help? <a href="mailto:support@athar.com" style="color: #b47d49; text-decoration: none;">Contact our support team</a>
            </p>
            <p style="color: #999; font-size: 12px; margin: 10px 0 0;">
              &copy; ${new Date().getFullYear()} ATHAR Fashion
            </p>
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};


// Login With Google 
exports.googleAuthCallback = async (req, res) => {
  try {
    const user = req.user;

    const { accessToken, refreshToken } = await generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "Strict",
      maxAge: 10 * 24 * 60 * 60 * 1000
    });


    return res.redirect(`http://localhost:4200/oauth-callback?token=${accessToken}`);

  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong during Google login",
    });
  }
};





// register
exports.register = asyncHandler(async (req, res) => {
  const { userName, email, password, confirmPassword } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide an email address.",
    });
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "Please enter both password and confirm password.",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "failed",
      message: "Password and confirm password do not match.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isVerified) {
      return res.status(409).json({
        status: "failed",
        message: "This email is already registered and verified.",
      });
    } else {
      const newCode = generateCode();
      existingUser.emailVerificationCode = newCode;
      existingUser.verificationCodeExpiry = new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT);
      await existingUser.save();
      await sendVerificationEmail(existingUser);
      return res.status(200).json({
        status: "success",
        message: "A new verification code has been sent to your email.",
      });
    }
  }

  const newCode = generateCode();

  const newUser = new User({
    userName,
    email,
    password,
    isVerified: false,
    emailVerificationCode: newCode,
    verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT),
    role: email === process.env.ADMIN_EMAIL ? "admin" : "user",
  });

  await newUser.save();
  await sendVerificationEmail(newUser);

  res.status(201).json({
    status: "success",
    message: "Registration successful. A verification code has been sent. Please verify your account.",
  });
});

// verifyEmail
exports.verifyEmail = asyncHandler(async(req, res) =>{
  const {email, code} = req.body;
  if(!email || !code){
    return res.status(400).json({ status: "faild", message: "Please Provide email and code" })
  };

  const user = await User.findOne({ email });
  if(!user){
    return res.status(404).json({status: "faild", message: "user not found" });
  }

  if (!user.emailVerificationCode || user.emailVerificationCode !== code || new Date() > user.verificationCodeExpiry) {
    return res.status(400).json({ status: "faild",message: 'Invalid or expired verification code' });
  }

  user.isVerified = true;
  user.emailVerificationCode = null;
  user.verificationCodeExpiry = null;
  await user.save();
  return res.status(201).json({
  status: "success",
    message: "Email virified successfully "
  })
})

//login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "failed",
      message: "Please provide an email address.",
    });
  }

  if (!password) {
    return res.status(400).json({
      status: "failed",
      message: "Please enter a password.",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found.",
    });
  }

  if (!user || !(await user.correctPassword(password))) {
  return res.status(400).json({
    message: "Email or password failed"
  });
}


  if (!user.isVerified) {
    return res.status(400).json({
      status: "failed",
      message: "Please verify your email first.",
    });
  }

  const { accessToken, refreshToken } = await generateTokens(user, true);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "development",
    sameSite: "Strict",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });

  return res.status(200).json({
    status: "success",
    message: "Login successful.",
    accessToken: accessToken,
  });
});

// forgetPassword
exports.forgetPassword = asyncHandler(async(req, res) =>{
  const { email } = req.body;
  const user = await User.findOne({ email });
  if(!user){
    return res.status(404).json({status: "faild",message: "user not found"});
  }
  const code = generateCode();
  user.resetPasswordCode = code;
  user.resetPasswordExpiry =new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT);
  await user.save()
  await sendCodeEmail(user);
  res.status(200).json({status: "success",message: "Reset password email sent"})


})
// resetPassword 
exports.resetPassword = asyncHandler(async(req, res) =>{
  const {email, code, newPassword} = req.body;

  const user = await User.findOne({ email });
  if(!user){
    return res.status(404).json({status: "faild",message: "User not found"});
  }

  if (!user.resetPasswordCode || user.resetPasswordCode !== code || new Date() > user.resetPasswordExpiry) {
    return res.status(400).json({status: "faild", message: 'Invalid or expired reset Password Code' });
  }
  user.resetPasswordCode = null;
  user.resetPasswordExpiry = null;
  user.password = newPassword;
  await user.save();
  return res.status(200).json({status: "success",message: "Password reset successful. You can now log in with your new password."})
});
// refreshToken 
exports.refreshToken = asyncHandler(async(req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(400).json({ message: 'No refresh token provided' });
  }

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(404).json({ message: 'Invalid refresh token' });
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});


    return res.status(200).json({ accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
  }
});

// logout 
exports.logout = asyncHandler(async(req, res) =>{
  const { refreshToken } = req.body;
  const user = await User.findOne({ refreshToken });
  if(!user){
    return res.status(404).json({message: "Invaild refresh Token"});
  }
  user.refreshToken=null;
  user.refreshTokenExpiry = null
  await user.save();
  return res.status(200).json({message: "Logout sucessfully"})
});