import { Document, Model, Types } from "mongoose";

interface IPhoto extends Document {
  public_id: string;
  url: string;
  collectionFor: (typeof SCHEMA_VALUES)[number];
}

interface IPhotoModel extends Model<IPhoto> {
  createAndSave: (
    file: any,
    collection: (typeof SCHEMA_VALUES)[number]
  ) => Promise<Types.ObjectId>;
  findAndUpdatePhoto: (
    id: Types.ObjectId,
    file: any
  ) => Promise<Types.ObjectId>;
  deletePhoto: (id: Types.ObjectId) => Promise<boolean>;
  getPhotoUrlById: (id: Types.ObjectId) => Promise<IPhoto["url"]>;
}
