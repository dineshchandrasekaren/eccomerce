import { Response } from "express";
import { IUser } from "../types/user";
import ms from "ms";
import config from "../config";

export const cookieToken = async (res: Response, User: IUser) => {
  const token = await User.generateToken();
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: ms(config.AUTH_EXPIRY),
  });
  const user = User.toObject();
  user.password = undefined;
  user.email = undefined;
  res.json({ success: true, token, user });
};
