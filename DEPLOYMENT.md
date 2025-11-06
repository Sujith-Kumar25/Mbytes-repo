# Deployment Guide - Render (Backend) + Vercel (Frontend)

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas account
- Render account (free tier available)
- Vercel account (free tier available)

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

1. **Update CORS settings** in `backend/server.js` to allow your Vercel domain
2. **Ensure environment variables** are properly configured
3. **Push code to GitHub**

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your backend code

### Step 3: Configure Render Service

**Basic Settings:**
- **Name**: `mbytes-election-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend` (important!)

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Add these in the Render dashboard:

```env
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
```

**Important Notes:**
- Render provides a default PORT (usually 10000), but you can use any port
- Update `CLIENT_URL` after deploying frontend
- Make sure MongoDB Atlas allows connections from Render's IPs (use 0.0.0.0/0 for development)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete
4. Copy your backend URL (e.g., `https://mbytes-election-backend.onrender.com`)

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Deployment

1. **Update API URL** in frontend environment variables
2. **Update Socket URL** for real-time features
3. **Ensure build works locally**: `npm run build`

### Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository

### Step 3: Configure Vercel Project

**Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend` (click "Edit" and set it)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Environment Variables:**
Add these in Vercel dashboard:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
VITE_SOCKET_URL=https://your-backend-url.onrender.com
```

**Important:**
- Replace `your-backend-url.onrender.com` with your actual Render backend URL
- Vercel environment variables starting with `VITE_` are exposed to the client

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy automatically
3. Wait for deployment to complete
4. Copy your frontend URL (e.g., `https://mbytes-election.vercel.app`)

### Step 5: Update Backend CORS

1. Go back to Render dashboard
2. Update the `CLIENT_URL` environment variable with your Vercel URL
3. Redeploy the backend service (or it will auto-redeploy)

---

## Part 3: Update Configuration Files

### Backend: Update server.js for Production

The server.js should already handle CORS properly, but verify:

```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Frontend: Update API Configuration

The `frontend/src/utils/api.js` should use environment variables:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## Part 4: MongoDB Atlas Configuration

### Allow Render IPs

1. Go to MongoDB Atlas → Network Access
2. Add IP Address: `0.0.0.0/0` (allows all IPs - use for development)
   - For production, you can whitelist specific Render IPs if needed
3. Save changes

### Verify Connection String

Ensure your MongoDB connection string includes:
- Correct username and password
- Database name: `mbytes-election` (or your preferred name)
- Connection options: `?retryWrites=true&w=majority`

---

## Part 5: Testing Deployment

### Test Backend
1. Visit: `https://your-backend.onrender.com/api/health`
2. Should return: `{"success": true, "message": "Server is running"}`

### Test Frontend
1. Visit your Vercel URL
2. Try registering a new user
3. Test login functionality
4. Verify API calls work

### Test Real-time Features
1. Open two browser windows
2. Login as admin in one, student in another
3. Announce a result as admin
4. Verify student sees the update in real-time

---

## Part 6: Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] MongoDB connection working
- [ ] Authentication working
- [ ] Real-time features working
- [ ] Admin can manage candidates
- [ ] Students can vote
- [ ] Results can be announced
- [ ] Export functionality works

---

## Troubleshooting

### Backend Issues

**Build Fails:**
- Check build logs in Render
- Verify `package.json` has correct scripts
- Ensure all dependencies are listed

**MongoDB Connection Error:**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure connection string includes database name

**CORS Errors:**
- Verify `CLIENT_URL` matches your Vercel URL exactly
- Check CORS configuration in `server.js`
- Ensure no trailing slashes in URLs

### Frontend Issues

**API Calls Fail:**
- Verify `VITE_API_URL` is set correctly
- Check browser console for errors
- Ensure backend is running and accessible

**Socket Connection Fails:**
- Verify `VITE_SOCKET_URL` is set correctly
- Check Socket.io configuration
- Ensure backend Socket.io is properly initialized

**Build Fails:**
- Check build logs in Vercel
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

### Common Solutions

**Environment Variables Not Working:**
- Restart the service after adding variables
- Verify variable names are correct (case-sensitive)
- Check for typos in values

**Real-time Features Not Working:**
- Verify Socket.io URLs are correct
- Check browser console for connection errors
- Ensure both frontend and backend are using HTTPS

---

## Production Best Practices

1. **Use Strong JWT Secret**: Generate a random 32+ character string
2. **Enable HTTPS**: Both Render and Vercel provide HTTPS by default
3. **Monitor Logs**: Check Render and Vercel logs regularly
4. **Set Up Monitoring**: Use Render's built-in monitoring or external services
5. **Backup Database**: Regularly backup MongoDB data
6. **Update Dependencies**: Keep packages updated for security
7. **Use Environment-Specific Configs**: Separate dev/staging/prod configs

---

## Cost Estimation

### Render (Free Tier)
- 750 hours/month free
- Sleeps after 15 minutes of inactivity (free tier)
- Wakes up on first request (may take 30-60 seconds)

### Vercel (Free Tier)
- Unlimited deployments
- 100GB bandwidth/month
- Perfect for this project

### MongoDB Atlas (Free Tier)
- 512MB storage
- Shared cluster
- Perfect for development and small projects

---

## Next Steps

1. Set up custom domains (optional)
2. Configure CI/CD for automatic deployments
3. Set up error monitoring (Sentry, etc.)
4. Configure analytics
5. Set up backup strategies

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments → View Function Logs
3. Check MongoDB Atlas logs
4. Review browser console for frontend errors
5. Review server logs for backend errors

