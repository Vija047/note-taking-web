require('dotenv').config();
const express = require("express");
const connectd = require("./db");
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const { requestLogger, notFound, errorHandler } = require('./middleware/middleware');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// CORS middleware (for frontend integration)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Connect to database
connectd();

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Note Taking App Backend API',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            notes: '/api/notes'
        }
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Note Taking App Backend running on port ${PORT}`);
    console.log(`Access the API at: http://localhost:${PORT}`);
});