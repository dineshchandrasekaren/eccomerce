import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import CustomError from "../utils/customError.util";
import UserModel from "../models/user.schema";

export const getShopIdByUsername = asyncHandler(
  async (req: Request, res: Response) => {
    const { username = "" } = req.params;

    if (!username) {
      throw new CustomError("Please give the Username", 200);
    }

    const shop = await UserModel.findOne({ username });
    if (!shop) {
      throw new CustomError("Shop not found in this username", 200);
    }

    res.status(200).json({ success: true, shopId: shop._id });
  }
);
