import { Router } from "express";
import {
  login,
  signup,
  resetPassword,
  forgotPassword,
  verifyEmail,
  logout,
} from "../controllers/auth.controller";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/verify-token/:token").put(verifyEmail);
router.route("/logout").put(isAuth, logout);

export default router;
