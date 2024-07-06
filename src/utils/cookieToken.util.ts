import { Response } from "express";
import { IUser } from "../models/user.schema";
import { hours } from "./time.util";

export const cookieToken = async (res: Response, user: IUser) => {
  const token = await user.generateToken();
  res
    .cookie("token", token, {
      httpOnly: true,
      maxAge: hours(3),
    })
    .json({ success: true, token, user });
};
