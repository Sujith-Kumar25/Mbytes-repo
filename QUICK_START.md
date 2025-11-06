# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

### 3. Create Admin User

**Option A: Via MongoDB**
1. Register a user through the frontend
2. In MongoDB, update the user:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

**Option B: Direct Registration**
Use the registration API and manually set role in database.

## Usage

1. **Admin Login**: Login with admin credentials
2. **Add Candidates**: Click "Manage Candidates" on any post
3. **Students Vote**: Students register and vote for candidates
4. **Announce Results**: Admin announces results when ready
5. **Export Data**: Admin can export results/votes

## Default Ports
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

## Need Help?
See `SETUP.md` for detailed instructions and troubleshooting.

