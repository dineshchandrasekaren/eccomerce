import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import PhotoModel from "../models/photo.schema";
import { AUTH_ROLES, ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import UserModel from "../models/user.schema";
import CustomError from "../utils/customError.util";
import { cookieToken } from "../utils/cookieToken.util";
import { isEmail } from "../utils/check.util";
import mailService from "../services/mail.service";
import SessionModel from "../models/session.schema";
import { IUser } from "../types/user";
import crypto from "crypto";

const collectionFor = SCHEMA_IDS.User;

const getUrl = ({ protocol, headers }: Request) =>
  `${protocol}://${headers.host}`;

async function welcomeTemplate({
  email,
  name,
  url,
}: {
  email: string;
  name: string;
  url: string;
}): Promise<string | null> {
  await mailService(
    {
      to: email,
      subject: "Verify Email",
      cc: "chandrasekarendinesh@gmail.com",
    },
    (error: any) => {
      if (error) {
        return error.message;
      }
    },
    {
      fileName: "welcome.ejs",
      payload: {
        name,
        email,
        url,
      },
    }
  );
  return null;
}

const sendVerifyEmail = async (req: Request, user: IUser) => {
  const token = await user.emailVerifyToken();
  return await welcomeTemplate({
    email: user.email,
    name: user.name,
    url: await `${getUrl(req)}/auth/verify-token/${token}`,
  });
};

/**********************************************************
 * @AUTH
 * @route https://localhost:5000/auth/verify-token/:token
 * @param {token}
 * @description used to verify the user email
 *********************************************************/
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token: verifyToken } = req.params;
  const user = await UserModel.findOneAndUpdate(
    { verifyToken },
    { isVerified: true },
    {
      new: true,
    }
  ).populate("photo", "url");

  if (!user) throw new CustomError(ERROR_MESSAGES.INVALID_TOKEN, 400);
  user.verifyToken = undefined;
  await user.save();
  res.status(200).json({ success: true, user });
});

/**********************************************************
 * @AUTH
 * @route https://localhost:5000/auth/signup
 * @description used to signup and send welcome mail with verify user button to verify user.
 * @returns success
 *********************************************************/
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role = AUTH_ROLES.USER } = req.body;
  let emailError;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    if (!existingUser.isVerified) {
      emailError = await sendVerifyEmail(req, existingUser);
      throw new CustomError(ERROR_MESSAGES.VERIFY_EMAIL, 401);
    }

    throw new CustomError(ERROR_MESSAGES.USER_ALREADY_EXIST, 409);
  }

  let photoId = undefined;
  if (req.files?.photo) {
    photoId = await PhotoModel.createAndSave(req.files.photo, collectionFor);
  }

  // Create a new user document with a reference to the photo
  const user = new UserModel({
    name,
    email,
    password:
      role === AUTH_ROLES.SHOP
        ? crypto.randomBytes(10).toString("hex")
        : password,
    photo: photoId,
    role,
  });

  await user.save();

  const populatedUser = await user.populate("photo", "url");
  await populatedUser.emailVerifyToken();
  emailError = await sendVerifyEmail(req, populatedUser);
  populatedUser.password = "";
  populatedUser.verifyToken = "";

  res.status(200).json({
    success: true,
    message: "Signup succesfully",
    email: emailError ? emailError : "email send successfully",
  });
});

/**********************************************************
 * @AUTH
 * @route https://localhost:5000/auth/login
 * @description used to login
 * @returns  User , token, success
 *********************************************************/
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email })
    .populate("photo", "url")
    .select("+password");
  if (user?.verifyToken) {
    await sendVerifyEmail(req, user);
    throw new CustomError(ERROR_MESSAGES.VERIFY_EMAIL, 401);
  }
  if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 409);

  if (!(await user.comparePassword(password)))
    throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, 409, "password");

  user.password = "";
  await cookieToken(res, user);
});

/**********************************************************
 * @AUTH
 * @route https://localhost:5000/auth/logout
 * @description used to logout user and remove the session data  and clear a cookie
 * @returns  success
 *********************************************************/
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body.userId;
  await SessionModel.findOneAndDelete({ user });

  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "Logout successful" });
});

/**********************************************************
 * @AUTH
 * @route https://localhost:5000/auth/forgotPassword
 * @description used to send a mail with reset password token to user
 * @returns  success
 *********************************************************/
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    let emailError;
    const { email = "" } = req.body;
    if (!(email && isEmail(email)))
      throw new CustomError(ERROR_MESSAGES.INVALID_EMAIL, 404, "email");
    const user = await UserModel.findOne({ email });
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    const token = await user.getForgotPasswordToken();
    const url = `${getUrl(req)}/auth/password/reset/${token}`;
    await mailService(
      {
        to: user.email,
        subject: "Reset Password",
        cc: "chandrasekarendinesh@gmail.com",
      },
      (error: any) => {
        if (error) {
          emailError = error.message;
        }
      },
      {
        fileName: "resetPassword.ejs",
        payload: {
          name: user.name,
          url,
        },
      }
    );
    res.status(200).json({
      success: true,
      url: emailError ? url : undefined,
      email: emailError ? emailError : "email send successfully",
    });
  }
);

/**********************************************************
 * @AUTH
 * @route https://localhost:5000/auth/password/reset/:token
 * @param {token}
 * @description used to send a mail with reset password token to user
 * @returns  success
 *********************************************************/
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    if (!token) throw new CustomError(ERROR_MESSAGES.TOKEN_NOT_FOUND, 400);
    if (password !== confirmPassword)
      throw new CustomError(ERROR_MESSAGES.PASSWORD_NOT_MATCH, 403);
    const user = await UserModel.findUserByToken(token);
    user.password = password;
    await user.save();

    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
    res
      .status(200)
      .json({ success: true, message: "Password successfully reset" });
  }
);
