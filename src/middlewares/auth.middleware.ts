import { NextFunction, Request, Response } from "express";
import CustomError from "../services/CustomError";
import { asyncHandler } from "./asyncHandler";
import JWT, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import UserModel from "../models/user.schema";
import { ERROR_MESSAGES } from "../constants/error.constant";

export const isAuth = asyncHandler(
  async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    let token: string = "";

    if (
      req.header("Authorization")?.startsWith("Bearer ") ||
      req.cookies.token
    ) {
      token =
        req.header("Authorization")?.replace("Bearer ", "") ||
        req.cookies.token;
    }

    if (!token) {
      throw new CustomError(ERROR_MESSAGES.ACCESS_DENIED, 401);
    }

    try {
      const decodedJWTPayload = (await JWT.verify(
        token,
        config.JWT_SECRET
      )) as JwtPayload;

      const User = await UserModel.findById(decodedJWTPayload._id);
      if (!User) {
        throw new CustomError(ERROR_MESSAGES.ACCESS_DENIED, 401);
      }
      req.body.userId = decodedJWTPayload._id;
      req.body.role = decodedJWTPayload.role;
      next();
    } catch (error) {
      throw new CustomError(ERROR_MESSAGES.ACCESS_DENIED, 401);
    }
  }
);

export const CustomRole = (...roles: string[]) =>
  asyncHandler(
    async (req: Request, _: Response, next: NextFunction): Promise<void> => {
      if (!roles.includes(req.body.role))
        throw new CustomError(ERROR_MESSAGES.ACCESS_DENIED, 401);

      next();
    }
  );
