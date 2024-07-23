import { Document, Types } from "mongoose";
import { IProduct } from "./product";

export interface ProductInCart {
  product: Types.ObjectId | IProduct;
  quantity?: number;
  price: number;
  total?: number;
}

export interface ICart extends Document {
  user: Types.ObjectId;
  products: ProductInCart[];
  totalPrice?: number;
}
