import { Request, Response } from "express";
import CartModel from "../models/cart.schema";
import { asyncHandler } from "../middlewares/asyncHandler";
import ProductModel from "../models/product.schema";
import CustomError from "../utils/customError.util";
import { ERROR_MESSAGES } from "../constants";
import { stringToObjectId } from "../utils/idconvertions.util";
import { Types } from "mongoose";

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { _id: userId, productId } = req.body;

  // Find the product by ID
  const product = await ProductModel.findById(productId);
  if (!product) throw new CustomError(ERROR_MESSAGES.PRODUCT_NOT_EXIST, 404);

  // Define the new product to be added or updated
  const newProduct = {
    product: product._id as Types.ObjectId,
    price: product.price,
    quantity: 1,
    total: product.price,
  };

  // Find the cart for the user
  let foundCart = await CartModel.findOne({ user: stringToObjectId(userId) });

  if (!foundCart) {
    // If cart doesn't exist, create a new one
    foundCart = new CartModel({
      user: stringToObjectId(userId),
      products: [newProduct],
    });
  } else {
    // If cart exists, check if the product is already in the cart
    const existingProductIndex = foundCart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (
      existingProductIndex > -1 &&
      foundCart.products[existingProductIndex].quantity
    ) {
      foundCart.products[existingProductIndex].quantity += 1;
    } else {
      // If the product does not exist, add it to the cart
      foundCart.products.push(newProduct);
    }
  }

  // Save the cart
  await foundCart.save();

  res.status(200).json({ success: true, cart: foundCart });
});

export const updateQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: user, productId, inc = false } = req.body;

    const foundCart = await CartModel.findOneAndUpdate(
      { user, "products.product": productId },
      { $inc: { "products.$.quantity": inc ? 1 : -1 } },
      { new: true }
    );

    if (!foundCart) {
      throw new CustomError("Cart was Cleared or Product Not Found", 401);
    }
    await foundCart.save().catch((_err: any) => {
      throw new CustomError("Cart was Cleared or Product Not Found", 401);
    });
    // No need to call save() as findOneAndUpdate already returns updated document
    res.status(200).json({ success: true, cart: foundCart });
  }
);

export const getCartbyUserId = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id: user } = req.body;

    const cart = await CartModel.findOne({ user });

    if (!cart) throw new CustomError(ERROR_MESSAGES.CART_NOT_FOUND, 404);

    res.status(200).json({ success: true, cart });
  }
);
