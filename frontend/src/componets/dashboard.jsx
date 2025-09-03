import React, { useState } from 'react';
import './dashboard.css';

const Dashboard = ({ user, onSignOut }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateNote, setShowCreateNote] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState('');

    // Fetch notes when component mounts
    React.useEffect(() => {
        const fetchNotesOnMount = async () => {
            if (user && user.id) {
                try {
                    setLoading(true);
                    const response = await fetch(`http://localhost:5000/api/notes/user/${user.id}`);
                    const data = await response.json();

                    if (response.ok) {
                        setNotes(data.notes || []);
                    } else {
                        setMessage(data.message || 'Failed to load notes');
                    }
                } catch (error) {
                    setMessage('Failed to connect to server');
                    console.error('Error fetching notes:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotesOnMount();
    }, [user]);

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (newNote.title.trim() && newNote.content.trim()) {
            setIsCreating(true);
            setMessage('');

            try {
                const response = await fetch('http://localhost:5000/api/notes/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: newNote.title,
                        content: newNote.content,
                        userId: user.id
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setNotes([...notes, data.note]);
                    setNewNote({ title: '', content: '' });
                    setShowCreateNote(false);
                    setMessage('Note created successfully!');
                } else {
                    setMessage(data.message || 'Failed to create note');
                }
            } catch (error) {
                setMessage('Failed to connect to server');
                console.error('Error creating note:', error);
            } finally {
                setIsCreating(false);
            }
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setNotes(notes.filter(note => note._id !== noteId));
                    setMessage('Note deleted successfully!');
                } else {
                    const data = await response.json();
                    setMessage(data.message || 'Failed to delete note');
                }
            } catch (error) {
                setMessage('Failed to connect to server');
                console.error('Error deleting note:', error);
            }
        }
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="user-info">
                        <div className="user-avatar">
                            <span>HD</span>
                        </div>
                        <h1 className="dashboard-title">Dashboard</h1>
                    </div>
                    <button onClick={onSignOut} className="sign-out-btn">
                        Sign Out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="dashboard-content">
                    {/* Welcome Section */}
                    <section className="welcome-section">
                        <div className="welcome-card">
                            <h2 className="welcome-title">Welcome, {user?.name || 'Jonas Kahnwald'} !</h2>
                            <p className="welcome-email">Email: {user?.email || 'jonas_kahnwald@gmail.com'}</p>
                            <button
                                onClick={() => setShowCreateNote(true)}
                                className="create-note-btn"
                            >
                                Create Note
                            </button>
                        </div>
                    </section>

                    {/* Notes Section */}
                    <section className="notes-section">
                        <h3 className="notes-title">Notes</h3>

                        {message && (
                            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}

                        {loading ? (
                            <div className="loading">Loading notes...</div>
                        ) : notes.length === 0 ? (
                            <div className="no-notes">No notes found. Create your first note!</div>
                        ) : (
                            <div className="notes-grid">
                                {notes.map((note) => (
                                    <div key={note._id || note.id} className="note-card">
                                        <div className="note-content">
                                            <h4 className="note-title">{note.title}</h4>
                                            <p className="note-text">{note.content}</p>
                                            <div className="note-date">
                                                Created: {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Unknown'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNote(note._id || note.id)}
                                            className="delete-note-btn"
                                            aria-label="Delete note"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Create Note Modal */}
            {showCreateNote && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Create New Note</h3>
                            <button
                                onClick={() => setShowCreateNote(false)}
                                className="modal-close-btn"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateNote} className="note-form">
                            <div className="form-group">
                                <label htmlFor="noteTitle">Title</label>
                                <input
                                    type="text"
                                    id="noteTitle"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                    placeholder="Enter note title"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="noteContent">Content</label>
                                <textarea
                                    id="noteContent"
                                    value={newNote.content}
                                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                    placeholder="Enter note content"
                                    rows="4"
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateNote(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn" disabled={isCreating}>
                                    {isCreating ? 'Creating...' : 'Save Note'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
