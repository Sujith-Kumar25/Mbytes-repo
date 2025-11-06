# Quick Deployment Guide

## 🚀 Render (Backend) - 5 Minutes

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Render Service
1. Go to [render.com](https://render.com) → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository
4. Select your repository

### 3. Configure Render
- **Name**: `mbytes-election-backend`
- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Add Environment Variables
Click "Advanced" → "Add Environment Variable":

```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_32_chars_min
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### 5. Deploy
Click **"Create Web Service"** and wait for deployment.

**Copy your backend URL**: `https://your-backend.onrender.com`

---

## ⚡ Vercel (Frontend) - 3 Minutes

### 1. Create Vercel Project
1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **"Add New..."** → **"Project"**
3. Import GitHub repository
4. Select your repository

### 2. Configure Vercel
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend` ⚠️ **IMPORTANT** (Click "Edit")
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### 3. Add Environment Variables
Click "Environment Variables":

```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

**Replace `your-backend.onrender.com` with your actual Render URL**

### 4. Deploy
Click **"Deploy"** and wait for deployment.

**Copy your frontend URL**: `https://your-app.vercel.app`

### 5. Update Backend CORS
1. Go back to Render dashboard
2. Update `CLIENT_URL` environment variable with your Vercel URL
3. Service will auto-redeploy

---

## ✅ Test Deployment

### Backend Health Check
Visit: `https://your-backend.onrender.com/api/health`
Should see: `{"success": true, "message": "Server is running"}`

### Frontend
Visit your Vercel URL and test:
- [ ] Registration
- [ ] Login
- [ ] View posts
- [ ] Vote (if candidates added)
- [ ] Real-time updates

---

## 🔧 MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Network Access** → Add IP Address: `0.0.0.0/0`
3. **Database Access** → Create user (if not exists)
4. **Clusters** → Connect → Get connection string
5. Replace `<password>` and add to Render environment variables

---

## 📝 Important Notes

### Render Free Tier
- ⚠️ Service sleeps after 15 min inactivity
- First request after sleep takes 30-60 seconds
- Consider upgrading for production

### Vercel Free Tier
- ✅ No sleep time
- ✅ Instant responses
- ✅ Perfect for frontend

### Environment Variables
- Backend: Set in Render dashboard
- Frontend: Set in Vercel dashboard (must start with `VITE_`)

### CORS
- Backend `CLIENT_URL` must match Vercel URL exactly
- No trailing slashes
- Include `https://` protocol

---

## 🐛 Troubleshooting

**Backend not starting?**
- Check Render logs
- Verify MongoDB URI is correct
- Check PORT is set

**Frontend can't connect to API?**
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

**Socket.io not working?**
- Verify `VITE_SOCKET_URL` is correct
- Check browser console for errors
- Ensure both use HTTPS

---

## 🎉 Done!

Your app is now live at:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

For detailed instructions, see `DEPLOYMENT.md`

