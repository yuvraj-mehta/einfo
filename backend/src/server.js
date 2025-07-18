const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const linkRoutes = require("./routes/links");
const portfolioRoutes = require("./routes/portfolio");
const experienceRoutes = require("./routes/experience");
const educationRoutes = require("./routes/education");
const uploadRoutes = require("./routes/upload");
const analyticsRoutes = require("./routes/analytics");
const publicRoutes = require("./routes/public");

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
    
    console.log("CORS Debug:", {
      origin: origin,
      allowedOrigins: allowedOrigins,
      includes: allowedOrigins.includes(origin)
    });
    
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

// Rate limiting
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

// Speed limiter for additional protection
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per 15 minutes, then...
  delayMs: () => 500, // Begin adding 500ms of delay per request above 50
  validate: { delayMs: false }, // Disable the warning
});

// Apply rate limiting to all routes
app.use("/api/", limiter);
app.use("/api/", speedLimiter);

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
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/public", publicRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
const HOST = process.env.API_HOST || "localhost";

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
