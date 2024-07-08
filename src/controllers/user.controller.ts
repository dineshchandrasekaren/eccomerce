import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import PhotoModel from "../models/photo.schema";
import { ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import UserModel from "../models/user.schema";
import CustomError from "../services/CustomError";

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, user: req.context });
});

export const updateUserById = asyncHandler(
  async (req: Request, res: Response) => {
    const allData = req.context;
    const { name = undefined, email = undefined } = req.body;
    let newData = { ...allData, name, email };
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
  async (req: Request, res: Response) => {}
);
