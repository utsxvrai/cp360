# Quick Start Guide

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set Up Environment**
   - Create `.env` file in the `frontend` directory
   - Add: `VITE_API_BASE_URL=http://localhost:3000/api/v1`
   - (Or your backend URL if different)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 📋 First Time Setup Checklist

- [ ] Backend server is running on `http://localhost:3000`
- [ ] Supabase database is set up and migrations are run
- [ ] `.env` file is created with `VITE_API_BASE_URL`
- [ ] Dependencies are installed (`npm install`)

## 🎮 Testing the App

1. **Register a New Account**
   - Go to the login page
   - Click "NEED AN ACCOUNT? REGISTER"
   - Enter:
     - Email: `test@example.com`
     - Password: `password123`
     - Codeforces Handle: `tourist` (or any valid handle)

2. **View Dashboard**
   - After registration, you'll be redirected to dashboard
   - You'll see:
     - Today's POTD (3 problems: Easy/Medium/Hard)
     - Your streak counter (starts at 0)
     - Activity heatmap (week-wise)

3. **Test Features**
   - Click on any POTD card to open Codeforces problem
   - View your progress in the heatmap
   - Check streak updates (after solving problems)

## 🎨 Design Features

- **Retro Terminal Aesthetic**: Black background, white text, monospace fonts
- **Streak System**: Tracks consecutive days with at least one solved problem
- **Week-wise Heatmap**: 3 boxes per day (Easy/Medium/Hard)
- **Mechanical Animations**: Step-end timing for retro feel
- **Scanline Overlay**: CRT monitor effect

## 🔧 Troubleshooting

### "Failed to fetch" errors
- Check if backend is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### No POTD showing
- Backend may need to generate POTD first
- Try clicking on a POTD card to trigger generation
- Check backend logs for errors

### Streak not updating
- Make sure you've solved at least one problem on Codeforces
- Check that your Codeforces handle is correct
- Progress updates may take a few seconds

### Colors not showing in heatmap
- Make sure Tailwind CSS is properly configured
- Check browser console for CSS errors
- Try clearing browser cache

## 📝 Next Steps

- Solve problems on Codeforces to see progress
- Watch your streak grow!
- Customize the retro theme if needed

