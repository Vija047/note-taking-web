import React, { useState } from 'react';
import './dashboard.css';

const Dashboard = ({ onSignOut }) => {
    const [notes, setNotes] = useState([
        { id: 1, title: 'Note 1', content: 'Sample note content...' },
        { id: 2, title: 'Note 2', content: 'Another note content...' }
    ]);
    const [showCreateNote, setShowCreateNote] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '' });

    const handleCreateNote = (e) => {
        e.preventDefault();
        if (newNote.title.trim() && newNote.content.trim()) {
            const note = {
                id: Date.now(),
                title: newNote.title,
                content: newNote.content
            };
            setNotes([...notes, note]);
            setNewNote({ title: '', content: '' });
            setShowCreateNote(false);
        }
    };

    const handleDeleteNote = (noteId) => {
        setNotes(notes.filter(note => note.id !== noteId));
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
                            <h2 className="welcome-title">Welcome, Jonas Kahnwald !</h2>
                            <p className="welcome-email">Email: jonas_kahnwald@gmail.com</p>
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
                        <div className="notes-grid">
                            {notes.map((note) => (
                                <div key={note.id} className="note-card">
                                    <div className="note-content">
                                        <h4 className="note-title">{note.title}</h4>
                                        <p className="note-text">{note.content}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="delete-note-btn"
                                        aria-label="Delete note"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
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
                                <button type="submit" className="save-btn">
                                    Save Note
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
