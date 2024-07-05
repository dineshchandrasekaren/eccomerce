import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import PhotoModel from "../models/photo.schema";
import { Types } from "mongoose";
export const signup = asyncHandler(async (req: Request, res: Response) => {
  // const { name, email, password } = req.body;
  let photo;
  // if (req.files?.photo) {
  // const file = req.files?.photo;
  //   let result = await CloudinaryServices.uploadFile(file, "users");
  //   if (result.error) throw new CustomError(result.error, result.code);
  let result = await PhotoModel.deletePhoto(
    Types.ObjectId.createFromHexString("6687cd5074b3bfb380e72275")
  );
  photo = result;
  // }

  console.log(photo);

  // await UserModel.create({
  //   name: "test",
  //   email: "test@test.com",
  //   password: "12334566",
  //   photo: { public_id: "tes11111t1", url: "resd111111fd" },
  // });
});
