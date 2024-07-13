import { Router } from "express";
import authRoute from "./auth.route";
import photoRoute from "./photo.route";
import userRoute from "./user.route";
import addressRoute from "./address.route";
import { defaultController, test } from "../controllers/notfound.controller";
const router = Router();

router.use("/auth", authRoute);
router.use("/photo", photoRoute);
router.use("/user", userRoute);
router.use("/address", addressRoute);

// testing routes
router.post("/tests", test);
router.use("*", defaultController);
export default router;
