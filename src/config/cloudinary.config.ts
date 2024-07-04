import { v2 as cloudinary } from "cloudinary";
import config from ".";
interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

const cloudinaryConfig: CloudinaryConfig = {
  cloud_name: "drkfrijp2",
  api_key: "235712588721615",
  api_secret: config.CLOUDINARY_API_SECRET,
  secure: true,
};
export { cloudinary };
export default () => cloudinary.config(cloudinaryConfig);
