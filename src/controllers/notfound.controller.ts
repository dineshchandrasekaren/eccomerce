import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import userSchema from "../models/user.schema";

export const defaultController = (_: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
export const test = asyncHandler(async (req, res) => {
  let UserData = await userSchema.create({
    name: "rtrtrt",
    email: "g@g.com",
  });
  res.json({ user: UserData });
});
