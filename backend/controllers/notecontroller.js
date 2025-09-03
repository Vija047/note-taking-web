const Note = require('../model/note');
const VerifiedUser = require('../model/verifiedUser');

// Create a new note
const createNote = async (req, res) => {
    try {
        const { title, content, userId, tags, isImportant, color } = req.body;

        // Validate required fields
        if (!title || !content || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Title, content, and userId are required'
            });
        }

        // Check if user exists
        const user = await VerifiedUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create new note
        const newNote = new Note({
            title,
            content,
            userId,
            tags: tags || [],
            isImportant: isImportant || false,
            color: color || '#ffffff'
        });

        const savedNote = await newNote.save();

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: savedNote
        });

    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create note',
            error: error.message
        });
    }
};

// Get all notes for a user
const getUserNotes = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if user exists
        const user = await VerifiedUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get notes with optional filtering and sorting
        const { tag, important, sortBy = 'updatedAt', order = 'desc' } = req.query;

        let filter = { userId };

        if (tag) {
            filter.tags = { $in: [tag] };
        }

        if (important === 'true') {
            filter.isImportant = true;
        }

        const sortOrder = order === 'asc' ? 1 : -1;
        const sortOptions = { [sortBy]: sortOrder };

        const notes = await Note.find(filter).sort(sortOptions);

        res.status(200).json({
            success: true,
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch notes',
            error: error.message
        });
    }
};

// Get a single note by ID
const getNoteById = async (req, res) => {
    try {
        const { noteId } = req.params;

        if (!noteId) {
            return res.status(400).json({
                success: false,
                message: 'Note ID is required'
            });
        }

        const note = await Note.findById(noteId).populate('userId', 'name email');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            note
        });

    } catch (error) {
        console.error('Error fetching note:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch note',
            error: error.message
        });
    }
};

// Update a note
const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { title, content, tags, isImportant, color } = req.body;

        if (!noteId) {
            return res.status(400).json({
                success: false,
                message: 'Note ID is required'
            });
        }

        // Find the note
        const note = await Note.findById(noteId);
        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        // Update fields if provided
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (tags !== undefined) note.tags = tags;
        if (isImportant !== undefined) note.isImportant = isImportant;
        if (color !== undefined) note.color = color;

        const updatedNote = await note.save();

        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            note: updatedNote
        });

    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update note',
            error: error.message
        });
    }
};

// Delete a note
const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;

        if (!noteId) {
            return res.status(400).json({
                success: false,
                message: 'Note ID is required'
            });
        }

        const deletedNote = await Note.findByIdAndDelete(noteId);

        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully',
            deletedNote
        });

    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete note',
            error: error.message
        });
    }
};

// Search notes
const searchNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { query, tag } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        if (!query && !tag) {
            return res.status(400).json({
                success: false,
                message: 'Search query or tag is required'
            });
        }

        // Check if user exists
        const user = await VerifiedUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let searchFilter = { userId };

        if (query) {
            searchFilter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ];
        }

        if (tag) {
            searchFilter.tags = { $in: [tag] };
        }

        const notes = await Note.find(searchFilter).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            notes
        });

    } catch (error) {
        console.error('Error searching notes:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search notes',
            error: error.message
        });
    }
};

// Get all unique tags for a user
const getUserTags = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // Check if user exists
        const user = await VerifiedUser.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const tags = await Note.distinct('tags', { userId });

        res.status(200).json({
            success: true,
            tags: tags.filter(tag => tag) // Remove empty tags
        });

    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
};

module.exports = {
    createNote,
    getUserNotes,
    getNoteById,
    updateNote,
    deleteNote,
    searchNotes,
    getUserTags
};