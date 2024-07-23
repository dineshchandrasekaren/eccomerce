import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "./asyncHandler";
import UserModel from "../models/user.schema";
import { stringToObjectId } from "../utils/idconvertions.util";
import CustomError from "../utils/customError.util";
import { ERROR_MESSAGES } from "../constants";

export const getUserByAuth = asyncHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const { _id: userId = "" } = req.body;

    const user = await UserModel.findById(stringToObjectId(userId));
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    Object.defineProperty(req, "context", {
      value: user,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    next();
  }
);
