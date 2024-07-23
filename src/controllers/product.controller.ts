import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import CustomError from "../utils/customError.util";
import PhotoModel from "../models/photo.schema";
import { ERROR_MESSAGES, SCHEMA_IDS } from "../constants";
import ProductModel from "../models/product.schema";
import { IProduct, IReview } from "../types/product";
import WhereClause from "../utils/whereClause.util";

export const addProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, price, category, stock }: IProduct = req.body;

  let imageArray = [];

  if (!req.files || !req.files.photos) {
    throw new CustomError("images are required", 401);
  }

  const photos = Array.isArray(req.files.photos)
    ? req.files.photos
    : [req.files.photos];

  for (const file of photos) {
    const photo = await PhotoModel.createAndSave(file, SCHEMA_IDS.Product);
    imageArray.push(photo);
  }
  const product = new ProductModel({
    name,
    description,
    price,
    category,
    stock,
    photos: imageArray,
  });
  await product.save();
  res.status(200).json({ success: true, product });
});

export const getProductById = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await req.context;

    res.status(200).json({ success: true, product });
  }
);

export const getAllProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { query } = req;
    const resultPerPage = 12;
    const totalProduct = await ProductModel.countDocuments();
    const Product = new WhereClause(query, ProductModel).search().filter();

    const filteredCount = (await Product.base).length;
    Product.pagination(resultPerPage);
    const products = await Product.base
      .populate("photos", "url")
      .lean()
      .clone();

    res.status(200).json({
      success: true,
      products,
      resultPerPage,
      filteredCount,
      totalProduct,
    });
  }
);
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const checkedProduct = req.context;

    const { name, description, price, stock, category } = req.body;

    const updatedProduct = {
      name: name ? name : checkedProduct.name,
      description: description ? description : checkedProduct.description,
      price: price ? price : checkedProduct.price,
      stock: stock ? stock : checkedProduct.stock,
      category: category ? category : checkedProduct.category,
      photos: checkedProduct.photos,
    };
    if (req.files?.photos) {
      updatedProduct.photos = [];
      for (let i = 0; i < checkedProduct.photos.length; i++) {
        const element = checkedProduct.photos[i];
        if (!(await PhotoModel.deletePhoto(element)))
          throw new CustomError("Photo not deleted", 401);
      }

      for (let file in req.files.photos) {
        const photo = await PhotoModel.createAndSave(file, SCHEMA_IDS.Product);

        updatedProduct.photos.push(photo);
      }
    }

    const product = await ProductModel.findByIdAndUpdate(
      checkedProduct._id,
      updateProduct,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, product });
  }
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    if (req.context.photos.length)
      for (let i = 0; i < req.context.photos.length; i++) {
        const photoId = req.context.photos[i];
        if (await PhotoModel.deletePhoto(photoId)) {
          throw new CustomError(ERROR_MESSAGES.PHOTO_NOT_FOUND, 404);
        }
      }

    const product = await ProductModel.findByIdAndDelete(req.context._id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  }
);

export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const { _id: userId, review, rating } = req.body;

  const product = await ProductModel.findByIdAndUpdate(
    req.context._id,
    { $push: { reviews: { user: userId, review, rating } } },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, product });
});

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const review = req.context.reviews;

    const filteredReview = review.filter(
      (review: IReview) => review._id !== req.body.reviewId
    );

    const product = await ProductModel.findByIdAndUpdate(
      req.context._id,
      { reviews: filteredReview },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, product });
  }
);
