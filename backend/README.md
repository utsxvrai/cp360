# Codeforces Daily POTD Tracker

A high-performance, optimized, and scalable web application that delivers daily Codeforces POTD problems and visualizes user activity using a custom week-wise heatmap, powered by Supabase.

## 🎯 Features

- **Daily POTD Generation**: Automatically generates 3 problems daily (Easy, Medium, Hard) from recent Codeforces contests
- **Custom Week-wise Heatmap**: Visualize user activity with 3 boxes per day (E/M/H) organized by weeks
- **JWT Authentication**: Secure user authentication with JWT tokens
- **Derived Progress**: No stored progress - all solve status is computed on-demand from Codeforces API
- **Optimized Performance**: Caching, rate limiting, and efficient API usage
- **Cron-based Automation**: Daily POTD generation via scheduled cron jobs

## 🚀 Setup

### Prerequisites

- Node.js (v14 or higher)
- Supabase account and project
- PostgreSQL database (via Supabase)

### Installation

1. **Clone the repository and install dependencies:**

```bash
cd backend
npm install
```

2. **Set up environment variables:**

Create a `.env` file in the `backend` directory:

```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your-secret-key-change-in-production-min-32-chars
JWT_EXPIRY=7d
```

3. **Set up Supabase database:**

Run the migration files in your Supabase SQL editor:

- `migrations/000_create_users_table.sql`
- `migrations/001_create_profiles_table.sql`
- `migrations/002_create_daily_problem_sets_table.sql`

4. **Start the server:**

```bash
npm run siu
```

The server will start on `http://localhost:3000`

## 📊 Database Schema

### `users` Table
- `id` (UUID): Primary key
- `email` (TEXT): Unique user email
- `password_hash` (TEXT): Bcrypt hashed password
- `created_at`, `updated_at` (TIMESTAMP)

### `profiles` Table
- `id` (UUID): Primary key, references users.id
- `email` (TEXT): User email
- `codeforces_handle` (TEXT): Unique Codeforces handle
- `created_at`, `updated_at` (TIMESTAMP)

### `daily_problem_sets` Table
- `id` (UUID): Primary key
- `date` (DATE): Unique date for the problem set
- `easy_contest_id`, `easy_index`, `easy_rating`: Easy problem details
- `medium_contest_id`, `medium_index`, `medium_rating`: Medium problem details
- `hard_contest_id`, `hard_index`, `hard_rating`: Hard problem details
- `created_at` (TIMESTAMP)

## 🔌 API Endpoints

### Authentication

#### `POST /api/v1/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "codeforces_handle": "tourist"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "codeforces_handle": "tourist"
    },
    "token": "jwt_token"
  }
}
```

#### `POST /api/v1/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POTD (Problem of the Day)

#### `GET /api/v1/potd/today`
Get today's POTD (public endpoint).

#### `GET /api/v1/potd/date/:date`
Get POTD for a specific date (format: YYYY-MM-DD).

#### `POST /api/v1/potd/generate`
Manually generate POTD for a date (requires authentication).

**Request Body (optional):**
```json
{
  "date": "2026-01-15"
}
```

### Progress

#### `GET /api/v1/progress/date/:date`
Get solve status for a specific date (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2026-01-15",
    "easy": true,
    "medium": false,
    "hard": true
  }
}
```

#### `GET /api/v1/progress/range?from=YYYY-MM-DD&to=YYYY-MM-DD`
Get solve status for a date range (requires authentication).

### Heatmap

#### `GET /api/v1/heatmap?from=YYYY-MM-DD&to=YYYY-MM-DD`
Get week-wise heatmap data (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "week_1": [
      { "date": "2026-01-01", "easy": true, "medium": false, "hard": false },
      { "date": "2026-01-02", "easy": false, "medium": true, "hard": false },
      ...
    ],
    "week_2": [...]
  }
}
```

### Profile

#### `GET /api/v1/profile`
Get current user's profile (requires authentication).

#### `PATCH /api/v1/profile`
Update profile (requires authentication).

**Request Body:**
```json
{
  "codeforces_handle": "new_handle"
}
```

## 🔄 Daily POTD Generation Algorithm

The system selects problems from recent Codeforces contests:

1. **Easy**: Rating 800-1000
2. **Medium**: Rating 1100-1400
3. **Hard**: Rating 1500-1600 (under 1600 as specified)

From each contest, the algorithm selects one problem per difficulty level. The cron job runs daily at 00:00 UTC.

## 📅 Custom Heatmap Structure

The heatmap is organized week-wise:

- Each week = 7 rows (Monday to Sunday)
- Each day = 3 boxes in a single row:
  - Box 1 → Easy
  - Box 2 → Medium
  - Box 3 → Hard
- Color coding:
  - Gray = Not solved
  - Green = Solved

## ⚡ Performance Optimizations

- **Caching**: Codeforces API responses cached for 5 minutes
- **Rate Limiting**: Respects Codeforces API rate limits (1 request per 2 seconds)
- **Batch Processing**: Efficient submission checking using cached user submissions
- **Derived State**: No stored progress - all computed on-demand

## 🛡️ Error Handling

- Graceful degradation on Codeforces API failures
- Invalid handle validation
- Duplicate cron run protection (idempotent)
- API timeout handling

## 📝 Notes

- The system never stores solved problems - all progress is derived from Codeforces API
- Codeforces handle validation happens during signup
- All progress computation is on-demand and cached appropriately
- The cron job is idempotent - safe to run multiple times

## 🔧 Development

```bash
# Run with nodemon (auto-restart on changes)
npm run siu

# The server will start on http://localhost:3000
```

## 📄 License

ISC
