import { Router } from "express";
import { getShopIdByUsername } from "../controllers/shop.controller";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();

router.route("/getShop/:username").get(getShopIdByUsername);

export default router;
