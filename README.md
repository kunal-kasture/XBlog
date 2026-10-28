# XBlog

A full-stack blog application built using React, Node.js, Express, MongoDB, and Firebase Authentication.

- **Live Frontend**: https://xblog-eight.vercel.app/
- **Live Backend**: https://xblog-ayj1.onrender.com

## Features

- User authentication with JWT and bcrypt password hashing
- Google Login and Signup using Firebase Authentication with automatic fallback user creation
- Blog post management (Create, Read, Update, Delete) with image upload support
- Like and unlike functionality on posts
- Commenting system on blog posts
- Search posts by keyword and filter by tags
- User profile management with post count tracking
- Admin panel for managing and moderating posts

## Tech Stack

- **Frontend**: React (Vite), React Router, Axios, Firebase SDK
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, CORS
- **Hosting**: Vercel (Client), Render (API), MongoDB Atlas, Firebase

## Local Development

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or Atlas URI
- Firebase project credentials

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blogapp
JWT_SECRET=your_jwt_secret_key
```

Run the server:

```bash
npm start
```

### Client Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the frontend:

```bash
npm start
```

The application will be available at `http://localhost:3000`.
