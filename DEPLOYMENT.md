# Deployment Guide for Vercel

This guide will help you deploy both the frontend and backend to Vercel.

## 🔧 Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## 📦 Backend Deployment

### 1. Deploy Backend to Vercel

Option A: **Via Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Set the **Root Directory** to `server`
4. Click **Deploy**

Option B: **Via Vercel CLI**
```bash
cd server
npm i -g vercel
vercel
```

### 2. Configure Backend Environment Variables

After deployment, go to your backend project on Vercel:

1. Navigate to **Settings** → **Environment Variables**
2. Add the following variables:

```
FRONTEND_URL = https://your-frontend-app.vercel.app
NODE_ENV = production
```

3. **Redeploy** the backend after adding environment variables

### 3. Note Your Backend URL

After deployment, copy your backend URL. It will look like:
```
https://your-backend-api.vercel.app
```

## 🎨 Frontend Deployment

### 1. Create Local Environment File

Create a `.env` file in the **root directory** (not in `server/`):

```bash
# .env
VITE_API_URL=https://your-backend-api.vercel.app/api
```

Replace `your-backend-api.vercel.app` with your actual backend Vercel URL.

### 2. Deploy Frontend to Vercel

Option A: **Via Vercel Dashboard**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository again (or add as a new project)
3. This time, **leave Root Directory as `.`** (the root)
4. Add environment variable in Vercel:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-api.vercel.app/api`
5. Click **Deploy**

Option B: **Via Vercel CLI**
```bash
# From project root
vercel
```

### 3. Update Backend FRONTEND_URL

After your frontend is deployed:
1. Go back to your **backend** project on Vercel
2. Update the `FRONTEND_URL` environment variable with your actual frontend URL:
   ```
   FRONTEND_URL = https://your-actual-frontend.vercel.app
   ```
3. **Redeploy** the backend

## ✅ Verify CORS Configuration

After both deployments:

1. Visit your frontend URL
2. Open browser DevTools (F12) → Console
3. Try accessing the statistics or student list
4. You should NOT see any CORS errors

## 🐛 Troubleshooting

### Still Getting CORS Errors?

1. **Check environment variables are set correctly:**
   - Backend: `FRONTEND_URL` matches your frontend URL
   - Frontend: `VITE_API_URL` matches your backend URL

2. **Verify URLs don't have trailing slashes:**
   - ✅ Good: `https://api.vercel.app/api`
   - ❌ Bad: `https://api.vercel.app/api/`

3. **Check Vercel deployment logs:**
   - Go to your project → Deployments → Click on latest deployment
   - Check the build and runtime logs

4. **Redeploy after environment variable changes:**
   - Environment variables only take effect after redeployment

### Database Issues on Vercel

⚠️ **Important**: SQLite databases are **ephemeral** on Vercel serverless functions. The database will reset on each deployment.

For production, consider using:
- **Vercel Postgres** (recommended)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Turso** (SQLite edge database)

## 📝 Local Development

For local development, create `.env` files:

**Root `.env` (Frontend):**
```
VITE_API_URL=http://localhost:5000/api
```

**server/.env (Backend):**
```
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

