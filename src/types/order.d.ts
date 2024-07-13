import { Document, Types } from "mongoose";
import { ICart } from "./cart";
import { IAddress } from "./address";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  shippingInfo: IAddress;
  cart: ICart;
  deliveryCharge: number;
  taxAmount: number;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentMethod: "cash" | "card" | "online";
  paymentStatus: "pending" | "paid" | "failed";
  paymentRef: string;
  deliveredAt: Date;
}
