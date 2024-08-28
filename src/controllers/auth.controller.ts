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
import generatePassword from "../utils/passwordGenerator.util";

const collectionFor = SCHEMA_IDS.User;

const getUrl = ({ protocol, headers }: Request) =>
  `${protocol}://${headers.host}`;

async function welcomeTemplate({
  user,
  password,
  url,
}: {
  user: IUser;
  password: string;
  url: string;
}): Promise<string | null> {
  await mailService(
    {
      to: user.email,
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
        name: user.name,
        email: user.email,
        username: user.username,
        password,
        url,
      },
    }
  );
  return null;
}

const sendVerifyEmail = async (req: Request, user: IUser, password: string) => {
  const token = await user.emailVerifyToken();
  return await welcomeTemplate({
    user,
    password,
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
  const {
    username = "",
    name = "",
    email = "",
    password = "",
    role = AUTH_ROLES.USER,
  } = req.body;
  let emailError;

  const existingUsername = username
    ? await UserModel.findOne({ username })
    : null;

  // if (existingUsername) {
  //   throw new CustomError(ERROR_MESSAGES.USERNAME_ALREADY_EXIST, 409);
  // }
  const existingUser = await UserModel.findOne({ email }).select("+password");

  if (existingUser) {
    if (
      role !== AUTH_ROLES.SHOP &&
      !(await existingUser.comparePassword(password))
    ) {
      throw new CustomError(
        ERROR_MESSAGES.EXIST_USER_PASSWORD_NOT_MATCH,
        401,
        "password"
      );
    }

    if (!existingUser.isVerified) {
      try {
        emailError = await sendVerifyEmail(req, existingUser, password);
      } catch (error) {
        throw new CustomError(ERROR_MESSAGES.EMAIL_FAILED, 200);
      }
      res.status(200).json({
        success: true,
        message: "Signup successfully",
        email: emailError ? emailError : ERROR_MESSAGES.VERIFY_EMAIL,
      });
      return;
    }

    throw new CustomError(ERROR_MESSAGES.USER_ALREADY_EXIST, 409);
  }

  let photoId = null;
  if (req.files?.photo) {
    photoId = await PhotoModel.createAndSave(req.files.photo, collectionFor);
  }
  if (
    password &&
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(
      password
    )
  ) {
    throw new CustomError(ERROR_MESSAGES.NOT_VALID_PASSWORD, 200, "password");
  }
  const finalPassword =
    role === AUTH_ROLES.SHOP ? generatePassword() : password;
  console.log(finalPassword);

  const user = new UserModel({
    username,
    name,
    email,
    password: finalPassword,
    photo: photoId,
    role,
  });

  await user.save();

  const populatedUser = await user.populate("photo", "url");
  await populatedUser.emailVerifyToken();

  try {
    emailError = await sendVerifyEmail(req, populatedUser, finalPassword);
  } catch (error) {
    throw new CustomError(ERROR_MESSAGES.EMAIL_FAILED, 500);
  }

  populatedUser.password = "";
  populatedUser.verifyToken = undefined;

  res.status(200).json({
    success: true,
    message: "Signup successfully",
    email: emailError ? emailError : ERROR_MESSAGES.VERIFY_EMAIL,
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

  let errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)) {
    errors.email = "Please enter a valid email e.g., joe@email.com";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    res.status(200).json({ success: false, errors });
    return;
  }

  const user = await UserModel.findOne({ email })
    .populate("photo", "url")
    .select("+password");
  if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 200);

  if (user && !(await user.comparePassword(password)))
    throw new CustomError(ERROR_MESSAGES.INVALID_PASSWORD, 200, "password");
  if (user?.verifyToken) {
    await sendVerifyEmail(req, user, password);
    throw new CustomError(ERROR_MESSAGES.VERIFY_EMAIL, 200);
  }
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
      throw new CustomError(ERROR_MESSAGES.INVALID_EMAIL, 200, "email");
    const user = await UserModel.findOne({ email });
    if (!user) throw new CustomError(ERROR_MESSAGES.USER_NOT_FOUND, 200);
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
