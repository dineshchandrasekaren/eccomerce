import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import CategoryModel from "../models/category.schema";
import CustomError from "../utils/customError.util";
import { ERROR_MESSAGES } from "../constants";

export const getAllCategories = asyncHandler(
  async (_: Request, res: Response) => {
    const categories = await CategoryModel.find();

    res.status(200).send({ success: true, categories });
  }
);

export const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || !description)
    throw new CustomError("Please provide a name and description", 404);

  const category = new CategoryModel({ name, description });
  await category.save();
  res.status(200).json({ success: true, category });
});

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const category = req.context;

    res.status(200).json({ success: true, category });
  }
);

export const updateCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const { name = undefined, description = undefined } = req.body;
    // if(!category) throw new CustomError("Kindly provide category",401);
    const newData = {
      name: name ?? req.context.name,
      description: description ?? req.context.description,
    };

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.context._id,
      newData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCategory)
      throw new CustomError(ERROR_MESSAGES.CATEGORY_NOT_EXIST, 404);
    res.status(200).json({ success: true, category: updatedCategory });
  }
);

export const deleteCategoryById = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.context._id;
    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory)
      throw new CustomError(ERROR_MESSAGES.CATEGORY_NOT_EXIST, 404);
    res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  }
);
