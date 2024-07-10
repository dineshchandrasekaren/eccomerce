import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import PhotoModel from "../models/photo.schema";
import { ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import UserModel from "../models/user.schema";
import CustomError from "../services/CustomError";
import { cookieToken } from "../utils/cookieToken.util";
import { isEmail } from "../utils/check.utils";

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

  if (!(await User.comparePassword(password)))
    throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, 409, "password");

  User.password = "";
  await cookieToken(res, User);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {});
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email = "" } = req.body;
    if (!(email && isEmail(email)))
      throw new CustomError(ERROR_MESSAGES.INVALID_EMAIL, 404, "email");
    const user = await UserModel.findOne({ email });
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    const token = await user.getForgotPasswordToken();
    const resetPasswordUrl = `${req.protocol}://${req.headers.host}/password/reset/${token}`;
    res.status(200).json({ success: true, resetPasswordUrl });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.params;
    if (!token) throw new CustomError("Token not found", 400);

    const user = await UserModel.findUserByToken(token);
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    res
      .status(200)
      .json({ success: true, message: "Password successfully reset" });
  }
);
