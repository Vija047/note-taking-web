const express = require('express');
const {
    createNote,
    getUserNotes,
    getNoteById,
    updateNote,
    deleteNote,
    searchNotes,
    getUserTags
} = require('../controllers/notecontroller');

const router = express.Router();

// Create a new note
router.post('/create', createNote);

// Get all notes for a user
router.get('/user/:userId', getUserNotes);

// Get a single note by ID
router.get('/:noteId', getNoteById);

// Update a note
router.put('/:noteId', updateNote);

// Delete a note
router.delete('/:noteId', deleteNote);

// Search notes for a user
router.get('/user/:userId/search', searchNotes);

// Get all tags for a user
router.get('/user/:userId/tags', getUserTags);

module.exports = router;
