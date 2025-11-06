# Setup Guide - M-Bytes Forum Election System

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mbytes-election?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Important:** Replace the MongoDB URI with your actual MongoDB Atlas connection string.

Start the backend:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Create Admin User

After starting the backend, you need to create an admin user. You can do this in two ways:

#### Option 1: Using MongoDB Compass or MongoDB Atlas

1. Connect to your MongoDB database
2. Navigate to the `users` collection
3. Insert a new document or update an existing user:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "$2a$10$...", // Hashed password (use bcrypt)
  "role": "admin",
  "votedPosts": [],
  "createdAt": new Date()
}
```

#### Option 2: Using Registration API

1. Register a user through the frontend
2. Update the user's role to "admin" in MongoDB:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

#### Option 3: Create Admin via Registration with Role

You can modify the registration endpoint temporarily to accept a role parameter, or create a script:

```javascript
// createAdmin.js (run with: node createAdmin.js)
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@mbytes.com',
      password: 'admin123', // Will be hashed automatically
      role: 'admin'
    });
    console.log('Admin created:', admin);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
```

### 4. Initial Setup Steps

1. **Login as Admin**: Use your admin credentials to log in
2. **Add Candidates**: Click "Manage Candidates" on any post card to add candidates
3. **Students Register**: Students can now register and vote
4. **Announce Results**: After voting period, admin can announce results for each post

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Replace `<password>` and `<dbname>` in the connection string
7. Add it to your `.env` file as `MONGODB_URI`

## Testing the Application

### Test Student Flow:
1. Register a new student account
2. Login with student credentials
3. View posts and candidates
4. Vote for candidates
5. See thank you page
6. View announced results (if any)

### Test Admin Flow:
1. Login with admin credentials
2. View dashboard with post statistics
3. Add candidates for posts
4. View all registered users
5. Announce results for posts
6. Export results/votes

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Check your MongoDB URI in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

**Port Already in Use:**
- Change `PORT` in `.env` to a different port
- Or kill the process using port 5000

**JWT Secret Error:**
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong, random string (at least 32 characters)

### Frontend Issues

**API Connection Error:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Check CORS settings in backend

**Socket Connection Error:**
- Ensure backend is running
- Check `VITE_SOCKET_URL` in frontend `.env`
- Verify Socket.io is properly initialized

### Common Issues

**Cannot Vote:**
- Check if user has already voted for that post
- Verify candidate exists
- Check backend logs for errors

**Results Not Updating:**
- Check Socket.io connection
- Verify backend is emitting events
- Check browser console for errors

## Production Deployment

### Backend:
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Update `CLIENT_URL` with production frontend URL
4. Use environment variables for sensitive data
5. Use PM2 or similar for process management

### Frontend:
1. Build: `npm run build`
2. Serve `dist` folder using nginx or similar
3. Update API URLs in production environment
4. Enable HTTPS

## Support

For issues or questions, please check:
- Backend logs in terminal
- Frontend console in browser
- MongoDB Atlas logs
- Network tab in browser DevTools

