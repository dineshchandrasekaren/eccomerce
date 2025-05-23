import { Document, Schema, Model, model, Types } from "mongoose";
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  photo?: Types.ObjectId;
  password: string;
  role: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: string;
  purchase: Types.ObjectId[];
  about: string;
  slug: string;
  verifyToken?: string;
  isVerified: boolean;
  comparePassword: (enteredPassword: string) => Promise<boolean>;
  generateToken: () => Promise<string>;
  verifyForgotPasswordToken: () => void;
  getForgotPasswordToken: () => Promise<string>;
  emailVerifyToken: () => Promisse<string>;
}

export interface IUserModel extends Model<IUser> {
  forgotPasswordHash(token: string): Promise<string>;
  findUserByToken(resetPasswordToken: string): Promise<IUser>;
}
