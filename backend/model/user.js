const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    OTP: { type: Number, required: true },
    createdAt: { type: Date, expires: '5m', default: Date.now },
    birthday: { type: Date, required: true },   // use Date type
    isLoginOtp: { type: Boolean, default: false }  // Flag to distinguish login OTP from signup OTP
});

const UserOtp = mongoose.model('user0', userSchema);
module.exports = UserOtp;
