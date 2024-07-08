import { Request, Response, NextFunction } from "express";
import { Error, mongo } from "mongoose";
import CustomError from "../services/CustomError";

type ValidationError = {
  [key: string]: string;
};

// Error handler middleware
async function errorHandler(
  error: any,
  _: Request,
  res: Response,
  _next: NextFunction
): Promise<Response> {
  //validation error
  if (error instanceof Error.ValidationError) {
    let { errors } = error;
    const validationErrors: ValidationError = {};
    for (const key in errors) {
      validationErrors[key] = errors[key].message;
    }
    return res.status(400).json({ success: false, errors: validationErrors });
  }

  // Duplicate key error
  if (error instanceof mongo.MongoServerError) {
    let message = "Database error occurred";
    if (error.code === 11000) {
      const duplicateKeyErrors: ValidationError = {};
      for (const key in error.keyPattern) {
        duplicateKeyErrors[key] = `${key} already exist.`;
      }
      return res
        .status(400)
        .json({ success: false, errors: duplicateKeyErrors });
    }
    return res.status(500).json({ success: false, message });
  }

  if (error instanceof CustomError) {
    const jsonResponse = error.key
      ? { success: false, error: { [error.key || "message"]: error.message } }
      : { success: false, message: error.message };
    return res.status(error.code).json(jsonResponse);
  }
  console.log(error);

  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
}

export default errorHandler;
