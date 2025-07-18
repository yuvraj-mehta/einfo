const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let error = {
    success: false,
    message: "Internal server error",
    status: 500,
  };

  // Prisma errors
  if (err.code === "P2002") {
    error.message = "A record with this information already exists";
    error.status = 409;
  } else if (err.code === "P2025") {
    error.message = "Record not found";
    error.status = 404;
  } else if (err.code && err.code.startsWith("P")) {
    error.message = "Database error";
    error.status = 400;
  }

  // Validation errors
  if (err.name === "ValidationError") {
    error.message = "Validation failed";
    error.status = 400;
    error.errors = Object.values(err.errors).map(e => e.message);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token";
    error.status = 401;
  } else if (err.name === "TokenExpiredError") {
    error.message = "Token expired";
    error.status = 401;
  }

  // Multer errors
  if (err.code === "LIMIT_FILE_SIZE") {
    error.message = "File too large";
    error.status = 400;
  } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
    error.message = "Unexpected file field";
    error.status = 400;
  }

  // Custom errors
  if (err.status) {
    error.status = err.status;
  }
  if (err.message) {
    error.message = err.message;
  }

  // Don't expose sensitive information in production
  if (process.env.NODE_ENV === "production") {
    delete error.stack;
  } else {
    error.stack = err.stack;
  }

  res.status(error.status).json(error);
};

module.exports = errorHandler;
