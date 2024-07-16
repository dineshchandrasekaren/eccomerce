import { Schema, model } from "mongoose";
import { ICategory } from "../types/category";
import { SCHEMA_IDS } from "../constants";

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Please add a category"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters."],
    },
  },
  { timestamps: true }
);

const CategoryModel = model<ICategory>(
  SCHEMA_IDS.Category,
  categorySchema,
  SCHEMA_IDS.Category
);

export default CategoryModel;
