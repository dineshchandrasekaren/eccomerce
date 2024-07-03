import { Router } from "express";
import { test } from "../controllers/auth.controller";

let router = Router();

router.route("/").get(test);

export default router;
