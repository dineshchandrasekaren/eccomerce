import { Document, Types } from "mongoose";
import { ICategory } from "./category";
import { IPhoto } from "./photo";
import { IReview } from "./review";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId | ICategory;
  photos: Types.ObjectId[] | IPhoto[];
  stock: number;
  sold: number;
  reviews: Types.ObjectId[] | IReview[];
}
