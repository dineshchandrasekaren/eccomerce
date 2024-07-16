import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import AddressModel from "../models/address.schema";
import CustomError from "../utils/customError.util";
import { ERROR_MESSAGES } from "../constants";

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const {
    userId,
    address,
    phone,
    deliveryto,
    postalcode,
    country,
    city,
    state,
  } = req.body;

  const newAddress = new AddressModel({
    userId,
    address,
    phone,
    deliveryto,
    postalcode,
    country,
    city,
    state,
  });

  await newAddress.save();
  res.status(201).json({ success: true, address: newAddress });
});

export const updateAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { address, phone, deliveryto, postalcode, country, city, state } =
      req.body;

    const newData = {
      address: address ?? req.context.address,
      phone: phone ?? req.context.phone,
      deliveryto: deliveryto ?? req.context.deliveryto,
      postalcode: postalcode ?? req.context.postalcode,
      country: country ?? req.context.country,
      city: city ?? req.context.city,
      state: state ?? req.context.state,
    };
    const updatedAddress = await AddressModel.findByIdAndUpdate(
      req.context._id,
      newData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateAddress)
      throw new CustomError(ERROR_MESSAGES.ADDRESS_NOT_EXIST, 404);
    res.status(200).json({ success: true, address: updatedAddress });
  }
);

export const deleteAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const deletedAddress = await AddressModel.findByIdAndDelete(
      req.context._id
    );
    if (!deletedAddress)
      throw new CustomError(ERROR_MESSAGES.ADDRESS_NOT_EXIST, 404);
    res
      .status(200)
      .json({ success: true, message: "Address deleted successfully" });
  }
);

export const getAddressById = asyncHandler(
  async (req: Request, res: Response) => {
    res.status(200).json({ success: true, address: req.context });
  }
);
