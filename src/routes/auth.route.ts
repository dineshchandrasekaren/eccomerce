import { Router } from "express";
import {
  login,
  signup,
  resetPassword,
  forgotPassword,
} from "../controllers/auth.controller";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

export default router;
