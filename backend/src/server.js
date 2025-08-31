const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const path = require("path");
require("dotenv").config();

const logger = require("./utils/logger");
const { checkMigrations } = require("./scripts/check-migrations");

// Import routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const linkRoutes = require("./routes/links");
const portfolioRoutes = require("./routes/portfolio");
const experienceRoutes = require("./routes/experience");
const educationRoutes = require("./routes/education");
const achievementRoutes = require("./routes/achievements");
const extracurricularRoutes = require("./routes/extracurriculars");
const uploadRoutes = require("./routes/upload");
const analyticsRoutes = require("./routes/analytics");
const publicRoutes = require("./routes/public");
const adminRoutes = require("./routes/admin");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting)
app.set("trust proxy", 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map(o => o.trim());
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Rate limiting (disabled in development)
if (process.env.NODE_ENV !== "development") {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth requests per windowMs
    message: {
      success: false,
      message: "Too many authentication attempts, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Speed limiter for additional protection
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // Allow 50 requests per 15 minutes, then...
    delayMs: () => 500, // Begin adding 500ms of delay per request above 50
    validate: { delayMs: false }, // Disable the warning
  });

  // Apply rate limiting to all routes
  app.use("/api/", limiter);
  app.use("/api/auth/", authLimiter); // Stricter limits for auth
  app.use("/api/", speedLimiter);
  
  logger.info("Rate limiting enabled");
} else {
  logger.info("Rate limiting disabled for development environment");
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/experience", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/extracurriculars", extracurricularRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
// const HOST = process.env.API_HOST || "localhost";
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : (process.env.API_HOST || "localhost");

// Add root route for Render health checks
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "E-Info Backend API is running!",
    status: "healthy",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Startup function with migration check
async function startServer() {
  try {
    // Check migrations before starting (with better error handling)
    if (process.env.NODE_ENV === 'production' && process.env.SKIP_MIGRATION_CHECK !== 'true') {
      logger.info('Checking migration status before startup...');
      
      try {
        const migrationStatus = await checkMigrations();
        
        if (migrationStatus.status !== 'current') {
          logger.error('Cannot start server: pending migrations detected', {
            pendingMigrations: migrationStatus.pendingMigrations
          });
          console.error('\n❌ Cannot start server: Database migrations are not current!');
          console.error('Pending migrations:', migrationStatus.pendingMigrations);
          console.error('Run "npm run migrate-deploy" first, then restart the server.\n');
          process.exit(1);
        }
        
        logger.info('✅ All migrations are current, starting server...');
      } catch (migrationError) {
        logger.warn('Migration check failed, proceeding with server start in production', {
          error: migrationError.message,
          code: migrationError.code
        });
        console.warn('⚠️  Migration check failed, but proceeding in production mode');
        console.warn('Error:', migrationError.message);
      }
    } else if (process.env.SKIP_MIGRATION_CHECK === 'true') {
      logger.info('Migration check skipped (SKIP_MIGRATION_CHECK=true)');
    } else {
      logger.info('Skipping migration check (development mode)');
    }
    
    // Start the server
    app.listen(PORT, HOST, () => {
      logger.info("Server started successfully", {
        port: PORT,
        host: HOST,
        environment: process.env.NODE_ENV || "development",
        service: "einfo-backend",
        urls: {
          server: `http://${HOST}:${PORT}`,
          health: `http://${HOST}:${PORT}/health`
        }
      });
      
      console.log(`\n🚀 Server is running on http://${HOST}:${PORT}`);
      console.log(`📝 Health check: http://${HOST}:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 Host binding: ${HOST} (${HOST === '0.0.0.0' ? 'accessible from outside' : 'local only'})\n`);
    });
    
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    console.error('\n❌ Server startup failed:', error.message);
    process.exit(1);
  }
}

// Start the server
startServer();

module.exports = app;
