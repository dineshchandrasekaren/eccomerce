import { Response } from "express";
import { IUser } from "../types/user";
import ms from "ms";
import config from "../config";
import SessionModel from "../models/session.schema";

/**
 * @description this util is used to generate a token, start a session,
 *              send a response to client.
 * @param res to get a response object and send a response
 * @param User to get a user information and generate a token
 */

export const cookieToken = async (res: Response, User: IUser) => {
  //generate token
  const token = await User.generateToken();

  // create session
  let session = await new SessionModel({ user: User._id, token });
  await session.save();

  // convert to plain object and remove password
  const user = User.toObject();
  user.password = undefined;

  //set a cookie and send a response
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: ms(config.AUTH_EXPIRY),
    })
    .json({ success: true, token, user });
};
