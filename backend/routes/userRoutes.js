const express = require('express');
const { createuser, verifyOtp, requestLoginOtp, verifyLoginOtp, loginUser } = require('../controllers/usercontroller');
const router = express.Router();

router.post("/create", createuser);
router.post("/verify-otp", verifyOtp);
router.post("/request-login-otp", requestLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);
router.post("/login", loginUser); // Keep for backward compatibility

module.exports = router;


