import { Router } from "express";
import {
  getUserById,
  deleteUserById,
  updateUserById,
  changePassword,
} from "../controllers/user.controller";
import { getByParams } from "../middlewares/params.middleware";
import { SCHEMA_IDS } from "../constants";
import { isAuth } from "../middlewares/auth.middleware";

const router = Router();
router.param("userId", getByParams(SCHEMA_IDS.User));

router.use(isAuth);
router
  .route("/:userId")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.route("/changePassword").put(changePassword);

// router.route("/").get((req) => {
//   console.log(req.context);
// });

export default router;
