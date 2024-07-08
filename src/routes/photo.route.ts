import { Router } from "express";
import {
  getAllPhotos,
  getPhotoById,
  deletePhotoById,
  updatePhotoById,
  addNewPhoto,
  getPhotoUrlById,
} from "../controllers/photo.controller";
import { SCHEMA_IDS } from "../constants";
import { getByParams } from "../middlewares/params.middleware";

const router = Router();
router.param("photoId", getByParams(SCHEMA_IDS.Photo));
router.route("/").get(getAllPhotos);
router.route("/addPhoto").post(addNewPhoto);
router
  .route("/:photoId")
  .get(getPhotoById)
  .put(updatePhotoById)
  .delete(deletePhotoById);

router.route("/url/:photoId").get(getPhotoUrlById);

export default router;
