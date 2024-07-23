import { Schema, model } from "mongoose";
import { IOrder } from "../types/order";
import { SCHEMA_IDS } from "../constants";
import { cartSchema } from "./cart.schema";

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA_IDS.User,
      required: true,
    },
    shippingInfo: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA_IDS.Address,
      required: true,
    },
    cart: cartSchema,
    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentRef: {
      type: String,
      required: false,
    },
    deliveredAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const OrderModel = model<IOrder>(
  SCHEMA_IDS.Order,
  orderSchema,
  SCHEMA_IDS.Order
);

export default OrderModel;
