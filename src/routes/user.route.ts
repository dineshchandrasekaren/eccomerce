import { Router } from "express";
import {
  getUserById,
  deleteUserById,
  updateUserById,
  changePassword,
} from "../controllers/user.controller";
import { isAuth } from "../middlewares/auth.middleware";
import { getUserByAuth } from "../middlewares/user.middleware";

const router = Router();

router.use(isAuth);
router.use(getUserByAuth);
router
  .route("/byId")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.route("/changePassword").put(changePassword);

// router.route("/").get((req) => {
//   console.log(req.context);
// });

export default router;
