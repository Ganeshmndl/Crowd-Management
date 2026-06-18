const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = error.message || "Internal server error";

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(", ");
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${error.path}`;
  } else if (error.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message = "Image must be 5 MB or smaller";
  } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Upload one image using the photo field";
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};

export { errorHandler, notFound };
