# Note Taking App Backend

A robust Node.js backend for a note-taking application with user authentication and comprehensive note management features.

## Features

### User Management
- User registration with OTP verification
- Email-based authentication
- User login system

### Note Management
- Create, read, update, and delete notes
- Tag system for note organization
- Mark notes as important
- Color coding for notes
- Search functionality (by content and tags)
- Filter and sort notes

### API Features
- RESTful API design
- CORS support for frontend integration
- Error handling and logging
- Request validation
- MongoDB integration

## Project Structure

```
backend/
├── controllers/
│   ├── notecontroller.js    # Note CRUD operations
│   └── usercontroller.js    # User authentication
├── middleware/
│   └── middleware.js        # Custom middleware functions
├── model/
│   ├── note.js             # Note data model
│   ├── user.js             # Temporary user model (OTP)
│   └── verifiedUser.js     # Verified user model
├── routes/
│   ├── noteRoutes.js       # Note API routes
│   └── userRoutes.js       # User API routes
├── db.js                   # Database connection
├── index.js                # Main server file
├── test-api.js             # API testing utility
└── API_DOCUMENTATION.md    # Complete API documentation
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone or navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://127.0.0.1:27017/note-taking`

5. **Start the server**
   ```bash
   # Development mode (with auto-restart)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### User Authentication
- `POST /api/users/create` - Register new user
- `POST /api/users/verify-otp` - Verify OTP
- `POST /api/users/login` - User login

### Note Management
- `POST /api/notes/create` - Create new note
- `GET /api/notes/user/:userId` - Get all user notes
- `GET /api/notes/:noteId` - Get specific note
- `PUT /api/notes/:noteId` - Update note
- `DELETE /api/notes/:noteId` - Delete note
- `GET /api/notes/user/:userId/search` - Search notes
- `GET /api/notes/user/:userId/tags` - Get user tags

## Testing

1. **Start the server**
   ```bash
   npm run dev
   ```

2. **Run API tests**
   ```bash
   npm test
   ```

3. **Manual testing**
   - Server should be running at `http://localhost:3000`
   - Check API documentation for detailed endpoint usage

## Frontend Integration

### Example: Creating a Note
```javascript
const createNote = async (noteData) => {
    const response = await fetch('http://localhost:3000/api/notes/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: "My Note",
            content: "Note content",
            userId: "user_id_here",
            tags: ["work", "important"]
        })
    });
    
    const result = await response.json();
    return result;
};
```

### Example: Getting User Notes
```javascript
const getUserNotes = async (userId) => {
    const response = await fetch(`http://localhost:3000/api/notes/user/${userId}`);
    const result = await response.json();
    return result.notes;
};
```

### Example: Deleting a Note
```javascript
const deleteNote = async (noteId) => {
    const response = await fetch(`http://localhost:3000/api/notes/${noteId}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    return result;
};
```

## Database Schema

### Note Model
```javascript
{
    title: String (required),
    content: String (required),
    userId: ObjectId (required),
    tags: [String],
    isImportant: Boolean,
    color: String,
    createdAt: Date,
    updatedAt: Date
}
```

### User Models
- **UserOtp**: Temporary storage for user registration with OTP
- **VerifiedUser**: Permanent storage for verified users

## Development

### Adding New Features
1. Create/modify models in `model/` directory
2. Add controller logic in `controllers/` directory
3. Define routes in `routes/` directory
4. Update main server file if needed

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `EMAIL_USER`: Gmail username for OTP emails
- `EMAIL_PASS`: Gmail app password

## Error Handling

The API includes comprehensive error handling:
- Validation errors (400)
- Not found errors (404)
- Server errors (500)
- Custom error messages for debugging

## Security Features

- Input validation
- CORS configuration
- Error message sanitization
- Request logging

## Future Enhancements

- JWT-based authentication
- File upload for note attachments
- Note sharing functionality
- Real-time collaboration
- Rate limiting
- API versioning

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if MongoDB is running
   - Verify port 3000 is available
   - Check `.env` file configuration

2. **Database connection failed**
   - Ensure MongoDB is installed and running
   - Check database URL in `db.js`

3. **Email OTP not working**
   - Verify email credentials in `.env`
   - Check Gmail app password setup
   - Review email configuration in `usercontroller.js`

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include appropriate logging
4. Update API documentation
5. Test all endpoints before committing

## License

This project is part of an internship assignment.
