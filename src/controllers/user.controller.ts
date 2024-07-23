import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import PhotoModel from "../models/photo.schema";
import { ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import UserModel from "../models/user.schema";
import CustomError from "../utils/customError.util";
import { Types } from "mongoose";

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = { ...req.context.toObject() };

  if (req.context.photo) {
    const url = await PhotoModel.getPhotoUrlById(req.context.photo);
    user.photo = { url, _id: req.context.photo };
  }
  res.status(200).json({ success: true, user });
});

export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const allData = req.context;
    const { name = undefined, email = undefined } = req.body;
    let newData: { name: string; email: string; photo?: Types.ObjectId } = {
      name: name ?? allData.name,
      email: email ?? allData.email,
    };
    if (req.files?.photo) {
      if (allData.photo?._id) {
        newData.photo = await PhotoModel.findAndUpdatePhoto(
          allData.photo._id,
          req.files.photo
        );
      } else {
        newData.photo = await PhotoModel.createAndSave(
          req.files.photo,
          SCHEMA_IDS.User
        );
      }
    }

    const user = await UserModel.findByIdAndUpdate(req.context._id, newData, {
      runValidators: true,
      new: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, user });
  }
);

export const deleteUserById = asyncHandler(
  async (req: Request, res: Response) => {
    await UserModel.findByIdAndDelete(req.context._id);
    if (req.context.photo._id) {
      await PhotoModel.deletePhoto(req.context.photo._id);
    }

    res.status(200).json({ success: true });
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId, oldPassword, newPassword, confirmPassword } = req.body;
    const user = await UserModel.findById(userId).populate("+password");
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);

    if (!(await user.comparePassword(oldPassword)))
      throw new CustomError(ERROR_MESSAGES.INVALID_OLD_PASSWORD, 403);

    if (newPassword !== confirmPassword)
      throw new CustomError(ERROR_MESSAGES.PASSWORD_NOT_MATCH, 403);

    user.password = newPassword;
    await user.save({
      validateBeforeSave: true,
    });

    res.status(200).json({ success: true });
  }
);
