import { Document, Schema, Model, model, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  password: string;
  role: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: string;
  verifyToken?: string;
  isVerified: boolean;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => Promise<string>;
  verifyForgotPasswordToken: () => void;
  getForgotPasswordToken: () => Promise<string>;
  emailVerifyToken: () => Promisse<string>;
}

export interface IUserModel extends Model<IUser> {
  forgotPasswordHash(token: string): Promise<string>;
  findUserByToken(resetPasswordToken: string): Promise<IUser>;
}
