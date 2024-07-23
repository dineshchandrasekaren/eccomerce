import { Document, Types } from "mongoose";
import { ICategory } from "./category";
import { IPhoto } from "./photo";

export interface IReview extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  review: string;
  rating: number;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId | ICategory;
  photos: Types.ObjectId[];
  reviews?: IReview[];
  stock: number;
  sold?: number;
}
