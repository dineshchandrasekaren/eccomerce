import { Router } from "express";
import authRoute from "./auth.route";
import { defaultController, test } from "../controllers/notfound.controller";
let router = Router();

router.use("/auth", authRoute);
router.post("/tests", test);
router.use("*", defaultController);
export default router;
