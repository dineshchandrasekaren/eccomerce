import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import crypto from "crypto";
import CustomError from "../services/CustomError";
import { ERROR_MESSAGES, AUTH_ROLES, SCHEMA_IDS } from "../constants";
import { IUser, IUserModel } from "../types/user";

//creating Schema
const UserSchema: Schema<IUser> = new Schema(
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
      type: Types.ObjectId,
      ref: SCHEMA_IDS.Photo,
    },
    role: {
      type: String,
      default: AUTH_ROLES.USER,
      enum: [AUTH_ROLES.USER, AUTH_ROLES.ADMIN],
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

UserSchema.statics.findUserByToken = async function (
  resetPasswordToken
): Promise<IUser | void> {
  const forgotPasswordToken = await (this as IUserModel).forgotPasswordHash(
    resetPasswordToken
  );

  let userFound = await this.findOne({ forgotPasswordToken });
  if (!userFound) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);

  userFound.forgotPasswordToken = undefined;
  userFound.forgotPasswordExpiry = undefined;

  await userFound.save();

  return userFound;
};

//Save hashed password in db
UserSchema.pre("save", async function (next): Promise<void> {
  const passwordNotChanged = !this.isModified("password");
  if (passwordNotChanged) return next();
  this.password = await bcrypt.hash(this.password, 8);
  return next();
});
UserSchema.pre<IUser>("save", async function (this: IUser, next) {
  // Access current data
  const currentData = this;

  // Access old data (original document)
  const oldData = await this.toObject();
  console.log(oldData);
});
// compare password while login
UserSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

//generate jwt token
UserSchema.methods.generateToken = async function (): Promise<string> {
  return await jwt.sign(
    { _id: this._id, role: this.role },
    config.AUTH_SECRET,
    {
      expiresIn: config.AUTH_EXPIRY,
    }
  );
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
const UserModel: IUserModel = model<IUser, IUserModel>(
  SCHEMA_IDS.User,
  UserSchema,
  SCHEMA_IDS.User
);

export default UserModel;
