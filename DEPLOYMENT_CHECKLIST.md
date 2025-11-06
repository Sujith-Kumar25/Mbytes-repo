# Deployment Checklist

Use this checklist to ensure everything is configured correctly before and after deployment.

## Pre-Deployment

### Backend (Render)
- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB user created with password
- [ ] MongoDB network access configured (0.0.0.0/0 or specific IPs)
- [ ] MongoDB connection string copied
- [ ] JWT secret generated (32+ characters)
- [ ] All environment variables prepared

### Frontend (Vercel)
- [ ] Code pushed to GitHub
- [ ] Build works locally (`npm run build`)
- [ ] All environment variables prepared
- [ ] Backend URL ready (from Render)

---

## Deployment Steps

### Step 1: Deploy Backend (Render)
- [ ] Created Render account
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Added environment variables:
  - [ ] `PORT=10000`
  - [ ] `MONGODB_URI=...`
  - [ ] `JWT_SECRET=...`
  - [ ] `JWT_EXPIRE=7d`
  - [ ] `NODE_ENV=production`
  - [ ] `CLIENT_URL=...` (update after frontend deploy)
- [ ] Deployed successfully
- [ ] Copied backend URL

### Step 2: Deploy Frontend (Vercel)
- [ ] Created Vercel account
- [ ] Created new project
- [ ] Connected GitHub repository
- [ ] Set Root Directory to `frontend`
- [ ] Framework preset: Vite
- [ ] Added environment variables:
  - [ ] `VITE_API_URL=https://your-backend.onrender.com/api`
  - [ ] `VITE_SOCKET_URL=https://your-backend.onrender.com`
- [ ] Deployed successfully
- [ ] Copied frontend URL

### Step 3: Update Backend CORS
- [ ] Updated `CLIENT_URL` in Render with Vercel URL
- [ ] Backend auto-redeployed
- [ ] Verified CORS is working

---

## Post-Deployment Testing

### Backend Tests
- [ ] Health check: `https://your-backend.onrender.com/api/health`
- [ ] Returns: `{"success": true, "message": "Server is running"}`
- [ ] MongoDB connection working (check logs)
- [ ] No errors in Render logs

### Frontend Tests
- [ ] Frontend loads without errors
- [ ] Registration works
- [ ] Login works
- [ ] Can view posts
- [ ] Can view candidates
- [ ] Can vote (if candidates exist)
- [ ] Thank you page shows after voting
- [ ] Dashboard displays correctly

### Admin Tests
- [ ] Admin login works
- [ ] Can add candidates
- [ ] Can view all users
- [ ] Can announce results
- [ ] Can export data (CSV/PDF)
- [ ] Real-time updates work

### Real-time Tests
- [ ] Socket.io connection established
- [ ] Results broadcast in real-time
- [ ] Multiple clients receive updates
- [ ] No connection errors in console

---

## Environment Variables Reference

### Backend (Render)
```env
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mbytes-election?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

---

## Common Issues & Solutions

### Issue: Backend won't start
**Solution:**
- Check Render logs for errors
- Verify MongoDB URI is correct
- Ensure PORT is set
- Check all environment variables are set

### Issue: CORS errors
**Solution:**
- Verify `CLIENT_URL` matches Vercel URL exactly
- No trailing slashes
- Include `https://` protocol
- Restart backend after updating

### Issue: Frontend can't connect to API
**Solution:**
- Verify `VITE_API_URL` is correct
- Check backend is running
- Test backend health endpoint
- Check browser console for errors

### Issue: Socket.io not connecting
**Solution:**
- Verify `VITE_SOCKET_URL` is correct
- Check Socket.io CORS settings
- Ensure both use HTTPS
- Check browser console for errors

### Issue: MongoDB connection fails
**Solution:**
- Verify connection string is correct
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct
- Check network access settings

---

## Performance Optimization

### Render Free Tier
- ⚠️ Service sleeps after 15 min inactivity
- First request after sleep: 30-60 seconds
- Consider upgrading for production use

### Optimization Tips
- Keep service alive with monitoring (UptimeRobot, etc.)
- Use MongoDB connection pooling
- Optimize database queries
- Enable caching where possible

---

## Security Checklist

- [ ] Strong JWT secret (32+ characters, random)
- [ ] MongoDB user has limited permissions
- [ ] CORS configured correctly
- [ ] Environment variables not exposed
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] Passwords hashed (bcrypt)
- [ ] Input validation enabled
- [ ] Rate limiting considered (for production)

---

## Monitoring

### Render
- Check logs regularly
- Monitor service health
- Watch for errors
- Monitor resource usage

### Vercel
- Check deployment logs
- Monitor function logs
- Watch for build errors
- Monitor bandwidth usage

### MongoDB Atlas
- Monitor database usage
- Check connection metrics
- Watch for slow queries
- Monitor storage usage

---

## Backup & Recovery

- [ ] MongoDB backups configured
- [ ] Environment variables documented
- [ ] Database connection string saved securely
- [ ] JWT secret saved securely
- [ ] Deployment process documented

---

## Next Steps

After successful deployment:
1. Create admin user
2. Add candidates
3. Test full election flow
4. Set up monitoring
5. Configure backups
6. Document customizations
7. Plan for scaling (if needed)

---

## Support Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Socket.io Docs: https://socket.io/docs

---

## Notes

- Render free tier services sleep after inactivity
- First request after sleep may be slow
- Consider upgrading for production use
- Monitor costs if using paid tiers
- Keep dependencies updated
- Regular security audits recommended

