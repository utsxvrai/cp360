const express = require("express");
const cors = require("cors");
const { ServerConfig, Logger } = require('./config');
const apiRoutes = require('./routes');
const { startCron } = require('./cron/daily-potd-cron');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.listen(ServerConfig.PORT, () => {
  console.log(`Listening on port ${ServerConfig.PORT}`);
  Logger.info("Successfully started the Server", {});
  
  // Start cron jobs
  startCron();
});
