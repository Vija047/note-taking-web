const mongoose = require('mongoose');

const verifiedUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthday: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now }
});

const VerifiedUser = mongoose.model('VerifiedUser', verifiedUserSchema);
module.exports = VerifiedUser;
