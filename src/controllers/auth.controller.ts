import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import PhotoModel from "../models/photo.schema";
import { Types } from "mongoose";
import { ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import UserModel, { IUser } from "../models/user.schema";
import CustomError from "../services/CustomError";
import { cookieToken } from "../utils/cookieToken.util";

const collectionFor = SCHEMA_IDS.User;

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log(await UserModel.findOne({ email }));

  if (await UserModel.findOne({ email }))
    throw new CustomError(ERROR_MESSAGES.USER_ALREADY_EXIST, 409);

  let photoId = undefined;
  if (req.files?.photo) {
    photoId = await PhotoModel.createAndSave(req.files.photo, collectionFor);
  }

  // Create a new user document with a reference to the photo
  const user = new UserModel({
    name,
    email,
    password,
    photo: photoId,
  });

  await user.save();

  // Populate the 'photo' field in the user document
  const populatedUser = await user.populate("photo", "url");
  populatedUser.password = "";

  await cookieToken(res, populatedUser);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const User = await UserModel.findOne({ email })
    .populate("photo", "url")
    .select("+password");
  if (!User) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 409);

  let matchPassword = await User.comparePassword(password);
  if (!matchPassword)
    throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, 409, "password");

  User.password = "";
  await cookieToken(res, User);
});
