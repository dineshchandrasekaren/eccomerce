import { NextFunction, Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import CustomError from "../services/CustomError";

export const getByParams =
  (collection: string) =>
  async (req: Request, _: Response, next: NextFunction, id: Types.ObjectId) => {
    try {
      const document = await mongoose.model(collection).findById(id).lean();
      if (!document) throw new CustomError(`${collection} not found`, 404);
      req.context = document;

      next();
    } catch (error) {
      await next(error);
    }
  };
