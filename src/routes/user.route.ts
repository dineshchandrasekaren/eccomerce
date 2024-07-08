import { Router } from "express";
import {
  getUserById,
  deleteUserById,
  updateUserById,
} from "../controllers/user.controller";
import { getByParams } from "../middlewares/params.middleware";
import { SCHEMA_IDS } from "../constants";

const router = Router();
router.param("userId", getByParams(SCHEMA_IDS.User));
router
  .route("/:userId")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.route("/").get((req) => {
  console.log(req.context);
});

export default router;
