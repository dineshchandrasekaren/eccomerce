import { NextFunction, Request, Response } from "express";
import { Types, model } from "mongoose";
import CustomError from "../utils/customError.util";

export const getByParams =
  (collection: string) =>
  async (req: Request, _: Response, next: NextFunction, id: Types.ObjectId) => {
    try {
      const document = await model(collection).findById(id);
      if (!document) throw new CustomError(`${collection} not found`, 404);
      Object.defineProperty(req, "context", {
        value: document,
        writable: false,
        enumerable: false,
        configurable: false,
      });
      next();
    } catch (error) {
      await next(error);
    }
  };
