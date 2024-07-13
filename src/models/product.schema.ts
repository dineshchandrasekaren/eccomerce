import { Schema, model } from "mongoose";
import { IProduct } from "../types/product";
import { SCHEMA_IDS } from "../constants";

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a product description"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: SCHEMA_IDS.Category,
      required: true,
    },
    photos: {
      type: [Schema.Types.ObjectId],
      ref: SCHEMA_IDS.Photo,
      required: true,
    },
    stock: {
      type: Number,
      required: [true, "Please add a product stock"],
      min: 0,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: SCHEMA_IDS.Review,
      required: false,
    },
  },
  { timestamps: true }
);

const ProductModel = model<IProduct>(
  SCHEMA_IDS.Product,
  productSchema,
  SCHEMA_IDS.Product
);

export default ProductModel;
