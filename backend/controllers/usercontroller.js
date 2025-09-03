const express = require('express');
const UserOtp = require('../model/user');
const VerifiedUser = require('../model/verifiedUser');
const nodemailer = require('nodemailer');

// Test email configuration using Ethereal Email (for development/testing)
const createTestTransporter = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test email account created:', testAccount.user);
    console.log('Test email web interface: https://ethereal.email/messages');

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Failed to create test email account:', error);
    return null;
  }
};

// Gmail configuration (use when you have proper credentials)
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Choose which transporter to use
const getTransporter = async () => {
  const hasGmailCredentials = process.env.EMAIL_USER &&
    process.env.EMAIL_USER !== 'your-actual-email@gmail.com' &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your-actual-app-password';

  if (hasGmailCredentials) {
    console.log('Using Gmail configuration');
    return createGmailTransporter();
  } else {
    console.log('Using test email configuration (Ethereal Email)');
    return await createTestTransporter();
  }
};

// Function to send OTP email
const sendOtpEmail = async (email, otp, name) => {
  const transporter = await getTransporter();

  if (!transporter) {
    console.error('Failed to create email transporter');
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'test@ethereal.email',
    to: email,
    subject: 'Your OTP for Registration',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome ${name}!</h2>
        <p>Your OTP for registration is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #666;">This OTP will expire in 5 minutes.</p>
        <p style="color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email);

    // If using test email, show preview URL
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Email error details:', {
      code: error.code,
      response: error.response,
      command: error.command
    });
    return false;
  }
};

const createuser = async (req, res) => {
  try {
    const { name, email, birthday } = req.body;

    // Validation
    if (!name || !email || !birthday) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists in verified users
    const existingVerifiedUser = await VerifiedUser.findOne({ email });
    if (existingVerifiedUser) {
      return res.status(400).json({ message: "User with this email is already registered and verified" });
    }

    // Check if user already exists in pending verification
    const existingUser = await UserOtp.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists. Please verify your OTP or wait for it to expire." });
    }

    // Generate OTP - more robust approach
    const generateNumericOTP = () => {
      return Math.floor(100000 + Math.random() * 900000); // Generates 6-digit number
    };

    const otpNumber = generateNumericOTP();

    // Create user with OTP
    const user = await UserOtp.create({
      name,
      email,
      OTP: otpNumber,
      birthday: new Date(birthday)
    });

    // Send OTP email (convert to string for email)
    const emailSent = await sendOtpEmail(email, otpNumber.toString(), name);

    if (!emailSent) {
      // If email sending fails, still return success but mention email issue
      return res.status(201).json({
        message: "User registered successfully, but email sending failed. Check server logs for details.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          birthday: user.birthday
        },
        otp: otpNumber // In production, remove this line for security
      });
    }

    return res.status(201).json({
      message: "User registered successfully and OTP sent to email",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday
      },
      otp: otpNumber // TODO: Remove in production for security
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// Function to verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Convert OTP to number safely
    const otpNumber = parseInt(otp, 10);
    if (isNaN(otpNumber)) {
      return res.status(400).json({ message: "Invalid OTP format" });
    }

    // Find user with email and OTP
    const user = await UserOtp.findOne({
      email: email,
      OTP: otpNumber
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    // OTP is valid - save user to verified users collection
    const verifiedUser = await VerifiedUser.create({
      name: user.name,
      email: user.email,
      birthday: user.birthday
    });

    // Delete the OTP record after successful verification
    await UserOtp.deleteOne({ _id: user._id });

    return res.status(200).json({
      message: "OTP verified successfully. User registered and can now login.",
      user: {
        id: verifiedUser._id,
        name: verifiedUser.name,
        email: verifiedUser.email,
        birthday: verifiedUser.birthday
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// Function to request login OTP
const requestLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find verified user with email
    const user = await VerifiedUser.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Generate OTP for login
    const generateNumericOTP = () => {
      return Math.floor(100000 + Math.random() * 900000); // Generates 6-digit number
    };

    const otpNumber = generateNumericOTP();

    // Store OTP temporarily in UserOtp collection for login verification
    await UserOtp.findOneAndDelete({ email: email }); // Remove any existing OTP
    const loginOtpRecord = await UserOtp.create({
      name: user.name,
      email: user.email,
      OTP: otpNumber,
      birthday: user.birthday,
      isLoginOtp: true // Flag to distinguish login OTP from signup OTP
    });

    // Send OTP email
    const emailSent = await sendOtpEmail(email, otpNumber.toString(), user.name);

    if (!emailSent) {
      return res.status(201).json({
        message: "Login OTP generated but email sending failed. Check server logs for details.",
        otpSent: true,
        otp: otpNumber // In production, remove this line for security
      });
    }

    return res.status(200).json({
      message: "Login OTP sent to your email successfully",
      otpSent: true,
      otp: otpNumber // TODO: Remove in production for security
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// Function to verify login OTP
const verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Convert OTP to number safely
    const otpNumber = parseInt(otp, 10);
    if (isNaN(otpNumber)) {
      return res.status(400).json({ message: "Invalid OTP format" });
    }

    // Find OTP record for login
    const otpRecord = await UserOtp.findOne({
      email: email,
      OTP: otpNumber,
      isLoginOtp: true
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    // Find the verified user
    const user = await VerifiedUser.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the OTP record after successful verification
    await UserOtp.deleteOne({ _id: otpRecord._id });

    // Update last login time
    await VerifiedUser.updateOne(
      { _id: user._id },
      { lastLogin: new Date() }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        lastLogin: new Date()
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// Function to login user with email (deprecated - keeping for backward compatibility)
const loginUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find verified user with email
    const user = await VerifiedUser.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    // Update last login time
    await VerifiedUser.updateOne(
      { _id: user._id },
      { lastLogin: new Date() }
    );

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        lastLogin: new Date()
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

module.exports = { createuser, verifyOtp, requestLoginOtp, verifyLoginOtp, loginUser };
