import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 4000,
  MONGOURL: process.env.MONGOURL || "mongodb://localhost:27017/ecommerce",
};

export default config;
