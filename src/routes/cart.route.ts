import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import {
  addToCart,
  updateQuantity,
  getCartbyUserId,
} from "../controllers/cart.controller";
// import { getByParams } from "../middlewares/params.middleware";
// import { SCHEMA_IDS } from "../constants";
const router = Router();

router.use(isAuth);
// router.param("cartId", getByParams(SCHEMA_IDS.Cart));

router.route("/add").post(addToCart);
router.route("/product/update").put(updateQuantity);

router.route("/getCart/:userId").get(getCartbyUserId);
export default router;
