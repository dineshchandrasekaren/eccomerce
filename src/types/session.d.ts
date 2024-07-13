import { Document, Types } from "mongoose";
import { IUser } from "./user";

export interface ISession extends Document {
  user: Types.ObjectId | IUser;
  token: string;
  lastAccessedAt: Date;
}
