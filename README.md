# Note-Taking Web Application

A full-stack note-taking web application built with React (frontend) and Node.js (backend). This application allows users to create, manage, and organize their notes with features like user authentication, tagging, color coding, and search functionality.

##  Features

### Frontend (React + Vite)
- Modern React application with Vite for fast development
- Responsive UI with Tailwind CSS
- User authentication (signup/login)
- Dashboard for note management
- Real-time note editing and organization

### Backend (Node.js + Express)
- RESTful API with Express.js
- MongoDB database integration
- User authentication with OTP verification
- Email notifications
- Comprehensive note management system
- Search and filtering capabilities

##  Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- [Git](https://git-scm.com/)

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Vija047/note-taking-web.git
cd note-taking-web
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

#### Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/note-taking-app
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/note-taking-app

# Email Configuration (for OTP verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Note:** For Gmail, you'll need to use an App Password instead of your regular password. Enable 2-factor authentication and generate an App Password from your Google Account settings.

#### Start the Backend Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

#### Start the Frontend Development Server

```bash
npm run dev
```

The frontend development server will start on `http://localhost:5173`

##  Available Scripts

### Backend Scripts
- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run API tests

### Frontend Scripts
- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code linting

##  Building for Production

### Backend Production Build

The backend doesn't require a build step, but make sure to:

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB database
3. Configure proper email credentials

### Frontend Production Build

```bash
cd frontend
npm run build
```

This will create a `dist` folder with the production-ready files.

To preview the production build:
```bash
npm run preview
```

## Project Structure

```
note-taking-web/
├── README.md
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── notecontroller.js
│   │   └── usercontroller.js
│   ├── middleware/           # Custom middleware
│   │   └── middleware.js
│   ├── model/               # Database models
│   │   ├── note.js
│   │   ├── user.js
│   │   └── verifiedUser.js
│   ├── routes/              # API routes
│   │   ├── noteRoutes.js
│   │   └── userRoutes.js
│   ├── db.js               # Database connection
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── vercel.json         # Vercel deployment config
└── frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # Images and static files
    │   ├── componets/      # React components
    │   │   ├── dashboard.jsx
    │   │   ├── login.jsx
    │   │   └── signup.jsx
    │   ├── App.jsx         # Main App component
    │   ├── main.jsx        # React entry point
    │   └── index.css       # Global styles
    ├── package.json        # Frontend dependencies
    ├── vite.config.js      # Vite configuration
    └── vercel.json         # Vercel deployment config
```

##  Development Workflow

1. **Start Backend**: Run `npm run dev` in the `backend` directory
2. **Start Frontend**: Run `npm run dev` in the `frontend` directory
3. **Make Changes**: Edit files and see changes reflected automatically
4. **Test API**: Use tools like Postman or the frontend interface to test functionality

##  Deployment

### Backend Deployment (Vercel)

The backend includes a `vercel.json` configuration file for easy deployment to Vercel:

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the backend directory
3. Follow the prompts to deploy

### Frontend Deployment (Vercel)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Vercel or any static hosting service

##  Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the `MONGODB_URI` in your `.env` file

2. **Email OTP Not Working**
   - Check your email credentials in the `.env` file
   - For Gmail, ensure you're using an App Password

3. **Frontend Not Loading**
   - Ensure the backend server is running
   - Check if there are any CORS issues in the browser console

4. **Port Already in Use**
   - Change the port in your `.env` file or kill the process using the port

### Getting Help

If you encounter any issues:
1. Check the console logs for error messages
2. Ensure all dependencies are installed correctly
3. Verify your environment configuration
4. Check if all services (MongoDB, Node.js) are running

##  API Documentation

The backend provides a RESTful API with the following main endpoints:

- **User Authentication**
  - `POST /api/users/register` - User registration
  - `POST /api/users/login` - User login
  - `POST /api/users/verify-otp` - OTP verification

- **Note Management**
  - `GET /api/notes` - Get all notes
  - `POST /api/notes` - Create a new note
  - `PUT /api/notes/:id` - Update a note
  - `DELETE /api/notes/:id` - Delete a note
  - `GET /api/notes/search` - Search notes

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request
