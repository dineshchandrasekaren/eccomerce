import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.config";

async function uploadFile(file: any, folderName: string) {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: new mongoose.Types.ObjectId().toString(),
      folder: folderName,
    });
    return { public_id: result.public_id, secure_url: result.secure_url };
  } catch (e: any) {
    return { error: e.message, code: e.http_code };
  }
}

async function destroyFile(public_id: string) {
  try {
    const result = await cloudinary.uploader.destroy(public_id);

    return { result };
  } catch (e: any) {
    return { error: e.message, code: e.http_code };
  }
}

export const CloudinaryServices = {
  uploadFile,
  destroyFile,
};
