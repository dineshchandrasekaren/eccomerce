import { Schema, model, Types } from "mongoose";
import { IProduct, IReview } from "../types/product";
import { SCHEMA_IDS } from "../constants";

const reviewSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      default: new Types.ObjectId(),
    },
    review: {
      type: String,
      required: [true, "content is required"],
      maxlength: [1000, "content should not exceed 1000 characters"],
      trim: true,
    },
    user: {
      type: Types.ObjectId,
      ref: SCHEMA_IDS.User,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: [1, "rating should be between 1 and 5"],
      max: [5, "rating should be between 1 and 5"],
    },
  },
  { timestamps: true }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add a product name"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please add a product description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a product price"],
      min: 0,
    },
    category: {
      type: Types.ObjectId,
      ref: SCHEMA_IDS.Category,
      required: [true, "Please select a category"],
    },
    photos: [
      {
        type: Types.ObjectId,
        ref: SCHEMA_IDS.Photo,
        required: true,
      },
    ],
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
    reviews: [reviewSchema],
  },
  { timestamps: true }
);
// productSchema.pre(/^find/, function (next) {
// (this as IProduct).populate("photos");
// (this as IProduct).populate('photos');
// next();
// });
const ProductModel = model<IProduct>(
  SCHEMA_IDS.Product,
  productSchema,
  SCHEMA_IDS.Product
);

export default ProductModel;
