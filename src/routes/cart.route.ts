import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import {
  addToCart,
  updateQuantity,
  getCartbyUserId,
} from "../controllers/cart.controller";
const router = Router();

router.use(isAuth);

router.route("/add").post(addToCart);
router.route("/product/update").put(updateQuantity);

router.route("/getCart/:userId").get(getCartbyUserId);
export default router;
