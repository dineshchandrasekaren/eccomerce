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
      const duplicateKeyErrors: { [key: string]: string } = {};
      for (const key in error.keyPattern) {
        duplicateKeyErrors[key] = `${key} already exist.`;
      }
      return res
        .status(400)
        .json({ success: false, errors: duplicateKeyErrors });
    }
    // Handle other specific MongoServerError types if needed
    // For example, handle network errors, timeout errors, etc.
    return res.status(500).json({ success: false, message });
  }

  if (error instanceof CustomError) {
    return res
      .status(error.code)
      .json({ success: false, message: error.message });
  }
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
}

export default errorHandler;
