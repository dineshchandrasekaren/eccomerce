import mongoose, { Document, Schema, Model, model } from "mongoose";
import AuthRole from "../constants/roles.constant";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import crypto from "crypto";
import CustomError from "../services/CustomError";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  photo?: string;
  password: string;
  role: string;
  forgotPasswordToken?: string;
  forgotPasswordExpiry?: string;
  comparePassword: (password: string) => Promise<boolean>;
  generateToken: () => Promise<string>;
  verifyForgotPasswordToken: () => void;
}
// Define static methods interface for UserModel
interface IUserModel extends Model<IUser> {
  forgotPasswordHash(token: string): Promise<string>;
  findUserByToken(resetPasswordToken: string): Promise<string> | void;
}
//creating Schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name should be atleast 4 characters."],
      maxLength: [60, "Name cannot exceed 60 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter valid email e.g., joe@email.com",
      ],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: false,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      default: AuthRole.USER,
      enum: [AuthRole.USER, AuthRole.ADMIN],
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.forgotPasswordHash = async function (token) {
  //generate and set a token in database
  return await crypto
    .createHmac("sha256", config.FORGOT_PASSWORD_SECRET)
    .update(token)
    .digest("hex");
};

UserSchema.statics.findUserByToken = async function (resetPasswordToken) {
  const forgotPasswordToken = await (this as IUserModel).forgotPasswordHash(
    resetPasswordToken
  );

  let userFound = await this.findOne({ forgotPasswordToken });
  if (!userFound) throw new CustomError("User not found", 404);

  userFound.forgotPasswordToken = undefined;
  userFound.forgotPasswordExpiry = undefined;

  userFound.save();

  return userFound;
};

//Save hashed password in db
UserSchema.pre("save", async function (next): Promise<void> {
  const passwordNotChanged = !this.isModified("password");
  if (passwordNotChanged) return next();
  this.password = await bcrypt.hash(this.password, 8);
  return next();
});

// compare password while login
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate jwt token
UserSchema.methods.generateToken = async function (): Promise<string> {
  return await jwt.sign({ _id: this._id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
};

// forgotPassword token
UserSchema.methods.getForgotPasswordToken = async function (): Promise<string> {
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // set a token in database (this.constructor gives a direct access of static methods inside class )
  this.forgotPasswordToken = await (
    this.constructor as IUserModel
  ).forgotPasswordHash(forgotToken);
  //add expiry to the token
  this.forgotPasswordExpiry =
    Date.now() + parseInt(config.FORGOT_PASSWORD_EXPIRY) * 60 * 100;

  // return the token
  return forgotToken;
};

// exporting userModal
export default model<IUser, IUserModel>("User", UserSchema);
