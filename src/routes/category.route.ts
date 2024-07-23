import { Router } from "express";
import { getByParams } from "../middlewares/params.middleware";
import { SCHEMA_IDS } from "../constants";
import {
  addCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "../controllers/category.controller";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();
router.use(isAuth);
router.param("categoryId", getByParams(SCHEMA_IDS.Category));

router.route("/add").post(addCategory);

router
  .route("/:categoryId")
  .get(getCategoryById)
  .put(updateCategoryById)
  .delete(deleteCategoryById);

router.route("/getAll").get(getAllCategories);

export default router;
