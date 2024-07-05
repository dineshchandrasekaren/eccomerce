import { Router } from "express";
import { signup } from "../controllers/auth.controller";

let router = Router();

router.route("/").post(signup);

export default router;
