import { Document } from "express";

declare module "express-serve-static-core" {
  interface Request {
    context?: Document;
  }
}
