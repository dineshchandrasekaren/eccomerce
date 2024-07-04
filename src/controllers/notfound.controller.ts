import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import UserSchema, { IUser } from "../models/user.schema";

export const defaultController = (_: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
export const test = asyncHandler(async (req, res) => {
  await UserSchema.findUserByToken("dsdsdsd");
  let UserData: IUser = await UserSchema.create({
    name: "ggg",
    email: "gg@token.com",
    password: "123456789",
    role: "user",
  });
  res.json({ user: UserData });
});
