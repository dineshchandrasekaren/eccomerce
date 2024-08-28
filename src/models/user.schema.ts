import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import crypto from "crypto";
import CustomError from "../utils/customError.util";
import { ERROR_MESSAGES, AUTH_ROLES, SCHEMA_IDS } from "../constants";
import { IUser, IUserModel } from "../types/user";

const passwordValidator = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(
    password
  );

const capitalize = (name: string) =>
  name.replace(/\b\w/g, (char) => char.toUpperCase());

//creating Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minLength: [3, "Name should be atleast 4 characters."],
      maxLength: [60, "Name cannot exceed 60 characters."],
      set: capitalize,
      trim: true,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true, // Enforces uniqueness at the database level
      validate: [
        {
          validator: async function (
            this: IUser,
            value: string
          ): Promise<boolean> {
            if (this.role === AUTH_ROLES.SHOP && !value) {
              return false;
            }
            return true;
          },
          message: "Username is required.",
        },
        {
          validator: async function (
            this: IUser,
            value: string
          ): Promise<boolean> {
            if (!value) return true;
            const user = await this.model(SCHEMA_IDS.User).findOne({
              username: value,
            });
            if (user && user._id.toString() !== this._id.toString()) {
              return false;
            }
            return true;
          },
          message: "Username already exists.",
        },
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please enter valid email e.g., joe@email.com",
      ],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [8, "Password must be minimum 8 characters"],
      // validate: {
      //   validator: passwordValidator,
      //   message: (props) =>
      //     `${props.value} is not a valid password! Password must contain at least 8 characters, including one number, one uppercase and one lowercase letter.`,
      // },
      select: false,
    },
    photo: {
      type: Types.ObjectId,
      ref: SCHEMA_IDS.Photo,
    },
    role: {
      type: String,
      default: AUTH_ROLES.USER,
      enum: [AUTH_ROLES.USER, AUTH_ROLES.ADMIN, AUTH_ROLES.SHOP],
    },
    about: String,
    slug: String,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    verifyToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

//Statics
UserSchema.statics.forgotPasswordHash = async function (token) {
  //generate and set a token in database
  return await crypto
    .createHmac("sha256", config.FORGOT_PASSWORD_SECRET)
    .update(token)
    .digest("hex");
};

UserSchema.statics.findUserByToken = async function (
  resetPasswordToken
): Promise<IUser> {
  const forgotPasswordToken = await (this as IUserModel).forgotPasswordHash(
    resetPasswordToken
  );

  let userFound = await this.findOne({ forgotPasswordToken });
  if (!userFound) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);

  userFound.forgotPasswordToken = undefined;
  userFound.forgotPasswordExpiry = undefined;

  return await userFound.save();
};

//hooks
//Save hashed password in db
UserSchema.pre("save", async function (next): Promise<void> {
  const passwordNotChanged = !this.isModified("password");
  if (passwordNotChanged) return next();
  this.password = await bcrypt.hash(this.password, 8);
  return next();
});

// methods
UserSchema.methods.emailVerifyToken = async function () {
  let token = "";
  if (this.verifyToken) {
    token = this.verifyToken;
  } else {
    token = crypto.randomBytes(20).toString("hex");
  }
  this.verifyToken = token;
  await this.save();
  return await this.verifyToken;
};

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
  await this.save();
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
