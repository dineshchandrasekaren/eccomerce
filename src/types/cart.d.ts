import { Document, Types } from "mongoose";
import { IProduct } from "./product";

export interface ProductInCart extends Document {
  product: Types.ObjectId | IProduct;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  products: ProductInCart[];
  totalPrice: number;
}
