import { Schema, model, Types } from "mongoose";
import { ERROR_MESSAGES, SCHEMA_IDS, SCHEMA_VALUES } from "../constants";
import { CloudinaryServices } from "../services/fileupload.service";
import CustomError from "../services/CustomError";
import { IPhoto, IPhotoModel } from "../types/photo";

const photoSchema = new Schema<IPhoto>(
  {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    collectionFor: {
      type: String,
      enum: SCHEMA_VALUES,
      default: "unknown",
    },
  },
  {
    timestamps: true,
  }
);
photoSchema.statics.getPhotoById = async function (
  id: Types.ObjectId
): Promise<IPhoto["url"]> {
  return this.findById(id)?.url;
};
photoSchema.statics.createAndSave = async function (
  file: any,
  collection: (typeof SCHEMA_VALUES)[number] = "unknown"
): Promise<Types.ObjectId> {
  const result = await CloudinaryServices.uploadFile(file, collection);
  if (result.error) throw new CustomError(result.error, result.code);

  const savePhoto = await new this({
    public_id: result.public_id,
    url: result.secure_url,
    collectionFor: collection,
  });

  await savePhoto.save();
  return savePhoto._id as Types.ObjectId;
};

photoSchema.statics.findAndUpdatePhoto = async function (
  id: Types.ObjectId,
  file: any
) {
  const photoData = await this.findById(id);

  if (!photoData) throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);
  const destroyResult = await CloudinaryServices.destroyFile(
    photoData.public_id
  );
  if (destroyResult.error)
    throw new CustomError(destroyResult.error, destroyResult.code);
  const result = await CloudinaryServices.uploadFile(
    file,
    photoData.collectionFor
  );
  if (result.error) throw new CustomError(result.error, result.code);

  photoData.public_id = result.public_id;
  photoData.url = result.secure_url;
  await photoData.save();

  return photoData._id;
};
photoSchema.statics.deletePhoto = async function (id: Types.ObjectId) {
  const deletedData = await this.findByIdAndDelete(id, {
    populate: "public_id",
  });

  if (!deletedData) throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);
  const destroyResult = await CloudinaryServices.destroyFile(
    deletedData.public_id
  );
  if (destroyResult.error)
    throw new CustomError(destroyResult.error, destroyResult.code);
  return destroyResult.result ? true : false;
};
const PhotoModel: IPhotoModel = model<IPhoto, IPhotoModel>(
  SCHEMA_IDS.Photo,
  photoSchema,
  SCHEMA_IDS.Photo
);

export default PhotoModel;
