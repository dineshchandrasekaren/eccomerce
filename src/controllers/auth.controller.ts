import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { cloudinary } from "../config/cloudinary.config";

export const signup = asyncHandler(async (req: Request, res: Response) => {});
