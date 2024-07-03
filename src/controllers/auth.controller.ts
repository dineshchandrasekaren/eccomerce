import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";

export const test = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "successfully called",
  });
});
