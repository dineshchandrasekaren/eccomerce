import { Router } from "express";
import {
  getAllPhotos,
  getPhotoById,
  deletePhotoById,
  updatePhotoById,
  addNewPhoto,
  getPhotoUrlById
} from "../controllers/photo.controller";

const router = Router();

router.route("/").get(getAllPhotos);
router.route("/addPhoto").post(addNewPhoto);
router
  .route("/:photoId")
  .get(getPhotoById)
  .put(updatePhotoById)
  .delete(deletePhotoById);

  router.route('/url/:photoId').get(getPhotoUrlById)

export default router;
