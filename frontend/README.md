# Retro Codeforces POTD Tracker - Frontend

A retro-styled, black & white frontend for the Codeforces Daily POTD Tracker.

## 🎨 Design Philosophy

- **Retro Terminal Aesthetic**: Monospace fonts, hard borders, no rounded corners
- **Strict Black & White**: Only difficulty colors (Green/Purple/Red) allowed in heatmap
- **Mechanical Animations**: No smooth easing, only step-end animations
- **Streak-Aware**: Prominent streak counter with daily activity tracking

## 🚀 Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Set `VITE_API_BASE_URL` to your backend URL (default: `http://localhost:3000/api/v1`)

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthForm.jsx       # Login/Register form
│   ├── Dashboard.jsx      # Main dashboard
│   ├── Header.jsx         # Header with streak display
│   ├── POTDGrid.jsx       # Today's problems grid
│   ├── POTDCard.jsx       # Individual problem card
│   ├── Heatmap.jsx        # Week-wise heatmap
│   ├── HeatmapWeek.jsx    # Single week component
│   ├── HeatmapDay.jsx     # Single day row
│   └── HeatmapCell.jsx    # Individual cell (E/M/H)
├── context/
│   └── AuthContext.jsx    # Authentication context
├── services/
│   └── api.js            # API service layer
├── utils/
│   ├── streak.js         # Streak calculation
│   └── date.js           # Date utilities
├── App.jsx               # Main app with routing
└── main.jsx              # Entry point
```

## 🎯 Features

### Authentication
- Terminal-style login/register form
- Blinking cursor animation in inputs
- Inline error messages

### Dashboard
- **Header**: User info + streak counter
- **POTD Grid**: 3 boxes (Easy/Medium/Hard) with Codeforces links
- **Heatmap**: Week-wise activity visualization

### Streak System
- A day counts if at least ONE problem is solved (Easy OR Medium OR Hard)
- Visual indicator (green = active today, gray = not active)
- Prominent display in header

## 🎨 Color Palette

- **Background**: `#000000` (black)
- **Text**: `#ffffff` (white)
- **Borders**: `#ffffff` (white)
- **Muted**: `#aaaaaa` (gray)
- **Disabled**: `#555555` (dark gray)
- **Easy**: `#00ff00` (green) - only in heatmap
- **Medium**: `#ff00ff` (purple) - only in heatmap
- **Hard**: `#ff0000` (red) - only in heatmap

## ⚡ Animations

- `blink`: Cursor blinking
- `flicker`: CRT flicker effect
- `jitter`: Hover jitter on cards
- `scanline`: Global scanline overlay
- `fade-in`: Staggered heatmap entry
- `border-flash`: Border flash on interactions

All animations use `step-end` timing for mechanical feel.

## 🔌 API Integration

The frontend connects to the backend API endpoints:
- `/auth/signup` - User registration
- `/auth/login` - User login
- `/potd/today` - Get today's POTD
- `/progress/range` - Get progress for date range
- `/heatmap` - Get week-wise heatmap data
- `/profile` - Get user profile

## 📝 Notes

- No UI libraries used (pure React + Tailwind)
- No animation libraries (CSS keyframes only)
- All components are memoized for performance
- Retro aesthetic is strictly enforced
- Streak calculation happens client-side from progress data
