# M-Bytes Forum Election System

A full-stack web application for conducting college forum elections built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

### Student (Voter) Features
- ✅ User registration and login (email or student ID)
- ✅ View 8 election posts
- ✅ View candidates for each post with details (name, department, year, manifesto, photo)
- ✅ Vote once per post (prevents multiple votes)
- ✅ Thank you page after voting
- ✅ Real-time result updates via Socket.io
- ✅ View announced winners in "Forum Committee Members" section

### Admin Features
- ✅ Admin login and protected routes
- ✅ Dashboard with 8 post cards showing statistics
- ✅ Announce results for each post (automatically calculates winner)
- ✅ Add/remove candidates
- ✅ View all registered users
- ✅ Export results as CSV or PDF
- ✅ Export votes as CSV
- ✅ Real-time result broadcasting to all connected clients

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT authentication
- Socket.io for real-time updates
- bcryptjs for password hashing
- express-validator for input validation
- csv-writer & pdfkit for exports

### Frontend
- React 18 with Vite
- React Router for navigation
- Context API for state management
- TailwindCSS for styling
- Axios for API calls
- Socket.io-client for real-time updates
- React Hot Toast for notifications

## Project Structure

```
MBytes-Election/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Candidate.js
│   │   ├── Vote.js
│   │   └── Result.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── candidateController.js
│   │   ├── voteController.js
│   │   ├── resultController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── candidateRoutes.js
│   │   ├── voteRoutes.js
│   │   ├── resultRoutes.js
│   │   ├── userRoutes.js
│   │   └── exportRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   └── exportUtils.js
│   ├── socket.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── WinnerCard.jsx
│   │   │   ├── CandidateCard.jsx
│   │   │   ├── AdminPostCard.jsx
│   │   │   ├── CandidateModal.jsx
│   │   │   ├── ResultModal.jsx
│   │   │   └── UsersModal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── PostDetail.jsx
│   │   │   └── ThankYou.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mbytes-election?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Candidates
- `GET /api/candidates` - Get all candidates (optional query: ?post=President)
- `GET /api/candidates/:id` - Get single candidate
- `POST /api/candidates` - Create candidate (admin only)
- `PUT /api/candidates/:id` - Update candidate (admin only)
- `DELETE /api/candidates/:id` - Delete candidate (admin only)

### Votes
- `POST /api/votes` - Submit vote (protected)
- `GET /api/votes/my-votes` - Get user's votes (protected)
- `GET /api/votes` - Get all votes (admin only)

### Results
- `GET /api/results` - Get all results
- `GET /api/results/:post` - Get result for specific post
- `GET /api/results/stats/all` - Get all posts statistics (admin only)
- `GET /api/results/stats/:post` - Get post statistics (admin only)
- `POST /api/results/announce/:post` - Announce result (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user (admin only)

### Export
- `GET /api/export/results/csv` - Export results as CSV (admin only)
- `GET /api/export/results/pdf` - Export results as PDF (admin only)
- `GET /api/export/votes/csv` - Export votes as CSV (admin only)

## Election Posts

The system supports 8 election posts:
1. President
2. Vice President
3. Secretary
4. Joint Secretary
5. Treasurer
6. Event Organizer
7. Sports Coordinator
8. Media Coordinator

## Database Models

### User
- name, email, studentId, password, role, votedPosts[], createdAt

### Candidate
- name, post, department, year, manifesto, photo, votesCount, createdAt

### Vote
- user, candidate, post, votedAt

### Result
- post, winner, winnerName, winnerDepartment, winnerYear, totalVotes, announced, announcedAt

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected routes (admin and user)
- Input validation with express-validator
- One vote per post restriction
- CORS configuration

## Real-time Features

- Socket.io integration for live result updates
- Automatic result broadcasting when admin announces
- Real-time winner display on student dashboards

## Usage

1. **Create Admin Account**: Register a user and manually set `role: 'admin'` in MongoDB, or create an admin account through the registration endpoint with admin role.

2. **Add Candidates**: Admin can add candidates for each post through the "Manage Candidates" button.

3. **Students Vote**: Students can view posts, see candidates, and vote once per post.

4. **Announce Results**: Admin can announce results for each post, which automatically calculates the winner and broadcasts to all connected clients.

5. **Export Data**: Admin can export results and votes in various formats.

## Production Deployment

### Quick Deployment
For quick deployment instructions, see **[DEPLOYMENT_QUICK.md](./DEPLOYMENT_QUICK.md)**

### Detailed Deployment Guide
For comprehensive deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Deployment Checklist
Use **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** to ensure everything is configured correctly.

### Recommended Platforms
- **Backend**: [Render](https://render.com) (Free tier available)
- **Frontend**: [Vercel](https://vercel.com) (Free tier available)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Free tier available)

### Quick Steps
1. Deploy backend to Render (see DEPLOYMENT_QUICK.md)
2. Deploy frontend to Vercel (see DEPLOYMENT_QUICK.md)
3. Update environment variables
4. Test deployment
5. Create admin user

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

