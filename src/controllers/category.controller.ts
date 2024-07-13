import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import CategoryModel from "../models/category.schema";

export const getAllCategories = asyncHandler(
  async (req: Request, res: Response) => {
    const categories = await CategoryModel.find();

    res.status(200).send({ success: true, categories });
  }
);

export const getCategoryById = asyncHandler(
  async (req: Request, res: Response) => {}
);
