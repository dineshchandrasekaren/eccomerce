import { v2 as cloudinary } from "cloudinary";
import config from ".";
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
};
export { cloudinary };
export default () => cloudinary.config(cloudinaryConfig);
