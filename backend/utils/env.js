const requiredProductionVariables = [
  "MONGODB_URI",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const validateEnvironment = () => {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missingVariables = requiredProductionVariables.filter(
    (variable) => !process.env[variable],
  );

  if (!process.env.JWT_SECRET && !process.env.SESSION_SECRET) {
    missingVariables.push("JWT_SECRET");
  }

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }
};

export { validateEnvironment };
