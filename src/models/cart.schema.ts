import { model, Schema } from "mongoose";
import { ICart } from "../types/cart";
import { SCHEMA_IDS } from "../constants";

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const CartModel = model<ICart>(SCHEMA_IDS.Cart, cartSchema, SCHEMA_IDS.Cart);

export default CartModel;
