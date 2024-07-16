import { asyncHandler } from "../middlewares/asyncHandler";
import { Request, Response } from "express";
import PhotoModel from "../models/photo.schema";
import CustomError from "../utils/customError.util";
import { ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import { stringToObjectId } from "../utils/idconvertions.util";

export const addNewPhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.files?.photo) throw new CustomError(ERROR_MESSAGES.SEND_PHOTO, 400);

  const photoId = await PhotoModel.createAndSave(
    req.files.photo,
    req.body.collection ? req.body.collection : SCHEMA_IDS.Photo
  );
  const photo = await PhotoModel.findById(photoId);
  if (!photo) throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);
  res.status(200).json({ success: true, photo });
});

export const getAllPhotos = asyncHandler(
  async (_req: Request, res: Response) => {
    const photos = await PhotoModel.find();
    if (!photos) throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);
    res.status(200).json({ success: true, photos });
  }
);

export const getPhotoById = asyncHandler(
  async (req: Request, res: Response) => {
    const { photoId = "" } = req.params;
    if (!photoId) throw new CustomError(ERROR_MESSAGES.ID_NOT_FOUND, 400);

    const photo = await PhotoModel.findById(photoId);
    if (!photo) throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);

    res.status(200).json({ success: true, photo });
  }
);

export const updatePhotoById = asyncHandler(
  async (req: Request, res: Response) => {
    const { photoId = "" } = req.params;
    if (!photoId || !req.files?.photo)
      throw new CustomError(
        !photoId ? ERROR_MESSAGES.ID_NOT_FOUND : ERROR_MESSAGES.SEND_PHOTO,
        400
      );

    const updatedPhotoId = await PhotoModel.findAndUpdatePhoto(
      stringToObjectId(photoId),
      req.files.photo
    );
    const photo = await PhotoModel.findById(updatedPhotoId);
    res.status(200).json({ success: true, photo });
  }
);

export const deletePhotoById = asyncHandler(
  async (req: Request, res: Response) => {
    const { photoId = "" } = req.params;
    if (!photoId) throw new CustomError(ERROR_MESSAGES.ID_NOT_FOUND, 400);

    const updatedPhotoId = await PhotoModel.deletePhoto(
      stringToObjectId(photoId)
    );
    if (!updatedPhotoId)
      throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);

    res
      .status(200)
      .json({ success: true, message: "Photo deleted Successfully" });
  }
);

export const getPhotoUrlById = asyncHandler(
  async (req: Request, res: Response) => {
    const { photoId = "" } = req.params;
    if (!photoId) throw new CustomError(ERROR_MESSAGES.ID_NOT_FOUND, 400);
    const photoUrl = await PhotoModel.getPhotoUrlById(
      stringToObjectId(photoId)
    );

    res.status(200).json({ success: true, url: photoUrl });
  }
);
