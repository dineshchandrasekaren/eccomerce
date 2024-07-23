import dotenv from "dotenv";

dotenv.config();

const config = {
  // Server configuration
  PORT: process.env.PORT || 4000,

  // Database configuration
  MONGOURL: process.env.MONGOURL || "mongodb://localhost:27017/ecommerce",

  // Authentication configuration
  AUTH_SECRET: process.env.AUTH_SECRET || "ohmygod",
  AUTH_EXPIRY: process.env.AUTH_EXPIRY || "3h",
  FORGOT_PASSWORD_EXPIRY: process.env.FORGOT_PASSWORD_EXPIRY || "",
  FORGOT_PASSWORD_SECRET: process.env.FORGOT_PASSWORD_SECRET || "",

  // Cloudinary configuration
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",

  // Email configuration
  FROM_EMAIL: process.env.FROM_EMAIL || "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
};

export default config;
