import {
  CallbackWithoutResultAndOptionalError,
  Document,
  model,
  Schema,
} from "mongoose";
import { ICart, ProductInCart } from "../types/cart";
import { SCHEMA_IDS } from "../constants";
import { NextFunction } from "express";
import CustomError from "../utils/customError.util";

export const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA_IDS.User,
      unique: true,
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: SCHEMA_IDS.Product,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
async function checkAndUpdate(
  cart: ICart,
  next: CallbackWithoutResultAndOptionalError
) {
  if (!cart.products || cart.products.length === 0) {
    return next(); // If no products, no need to process further
  }
  const copyOfProduct: ProductInCart[] = [...cart.products];

  const finalProduct: ProductInCart[] = [];
  let totalPrice = 0;
  let productsModified = false;
  for (let i = 0; i < copyOfProduct.length; i++) {
    const product = copyOfProduct[i];
    if (product.quantity === 0) {
      productsModified = true;
      continue;
    }
    const newTotal = product.price * (product.quantity || 1);
    if (product.total !== newTotal) {
      productsModified = true;
      product.total = newTotal;
    }
    totalPrice += product.total;
    finalProduct.push(product);
  }

  if (!finalProduct.length) {
    try {
      await cart.deleteOne();
    } catch (err: any) {
      return next(err);
    }
  }
  if (productsModified) {
    cart.totalPrice = totalPrice;
    cart.products = finalProduct;
    cart.markModified("products");
  }

  next();
}
cartSchema.pre("save", async function (next) {
  const cart = this as ICart & Document;
  await checkAndUpdate(cart, next);
});

const CartModel = model<ICart>(SCHEMA_IDS.Cart, cartSchema, SCHEMA_IDS.Cart);

export default CartModel;
