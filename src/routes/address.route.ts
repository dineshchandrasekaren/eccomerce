import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import { getByParams } from "../middlewares/params.middleware";
import { SCHEMA_IDS } from "../constants";
import {
  addAddress,
  deleteAddress,
  getAddressById,
  updateAddress,
} from "../controllers/address.controller";

const router = Router();

router.use(isAuth);
router.param("addressId", getByParams(SCHEMA_IDS.Address));

router
  .route("/:addressId")
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

router.route("/create").post(addAddress);

export default router;
