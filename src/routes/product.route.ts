import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product.controller";
import { isAuth } from "../middlewares/auth.middleware";
import { getByParams } from "../middlewares/params.middleware";
import { SCHEMA_IDS } from "../constants";

const router = Router();
router.use(isAuth);
router.param("productId", getByParams(SCHEMA_IDS.Product));
router.route("/addProduct").post(addProduct);
router.route("/getAll").get(getAllProduct);
router
  .route("/:productId")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
