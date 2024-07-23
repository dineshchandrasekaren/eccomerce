import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError.util";
import { asyncHandler } from "./asyncHandler";
import JWT, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { ERROR_MESSAGES } from "../constants/error.constant";
import SessionModel from "../models/session.schema";

export const isAuth = asyncHandler(
  async (req: Request, _: Response, next: NextFunction): Promise<void> => {
    try {
      let token: string = req.header("Authorization")?.startsWith("Bearer ")
        ? req.header("Authorization")?.replace("Bearer ", "")
        : req.cookies?.token;

      if (!token) {
        throw new CustomError(ERROR_MESSAGES.ACCESS_DENIED, 401);
      }

      const decodedJWTPayload = (await JWT.verify(
        token,
        config.AUTH_SECRET
      )) as JwtPayload;

      const session = await SessionModel.findOneAndUpdate(
        { user: decodedJWTPayload._id, token },
        { lastAccessedAt: Date.now() },
        {
          runValidators: false,
        }
      );

      if (!session) throw new CustomError(ERROR_MESSAGES.ACCESS_DENIED, 401);

      Object.defineProperty(req.body, "_id", {
        value: decodedJWTPayload._id,
        writable: false,
        enumerable: false,
        configurable: false,
      });
      Object.defineProperty(req.body, "role", {
        value: decodedJWTPayload.role,
        writable: false,
        configurable: false,
      });

      next();
    } catch (error: any) {
      throw new CustomError(
        error?.message || ERROR_MESSAGES.ACCESS_DENIED,
        401
      );
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
