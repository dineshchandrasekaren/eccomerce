import { Response } from "express";
import { IUser } from "../types/user";
import { hours } from "./time.util";

export const cookieToken = async (res: Response, User: IUser) => {
  const token = await User.generateToken();
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: hours(3),
  });
  const user = User.toObject();
  user.password = undefined;
  user.email = undefined;
  res.json({ success: true, token, user });
};
