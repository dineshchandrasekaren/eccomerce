import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  MONGOURL: process.env.MONGOURL || "mongodb://localhost:27017/ecommerce",
  JWT_SECRET: process.env.JWT_SECRET || "ohmygod",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "3h",
  FORGOT_PASSWORD_EXPIRY: process.env.FORGOT_PASSWORD_EXPIRY || "",
  FORGOT_PASSWORD_SECRET: process.env.FORGOT_PASSWORD_SECRET || "",
};

export default config;
