const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VerifiedUser',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    isImportant: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: '#ffffff'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
noteSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;
