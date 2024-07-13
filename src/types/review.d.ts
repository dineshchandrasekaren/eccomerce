import { Document } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  title: string;
  content: string;
  rating: number;
}
