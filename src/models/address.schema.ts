import { SCHEMA_IDS } from "../constants";
import { Schema, Types, model } from "mongoose";
import { IAddress } from "../types/address";

const addressSchema = new Schema<IAddress>({
  userId: {
    type: Types.ObjectId,
    ref: SCHEMA_IDS.User,
    required: [true, "Please send userId"],
  },
  address: {
    type: String,
    trim: true,
    required: [true, "Please enter address"],
  },
  phone: {
    type: String,
    minlength: 10,
    trim: true,
    required: [true, "Please enter Phone Number"],
  },
  deliveryto: { type: String, enum: ["home", "work", "gym"] },
  postalcode: {
    type: String,
    trim: true,
    required: [true, "Please enter Postal Code"],
  },
  country: {
    type: String,
    trim: true,
    required: [true, "Please enter the country"],
  },
  city: { type: String, trim: true, required: [true, "Please enter the city"] },
  state: {
    type: String,
    trim: true,
    required: [true, "Please enter the city"],
  },
});

const AddressModel = model<IAddress>(
  SCHEMA_IDS.Address,
  addressSchema,
  SCHEMA_IDS.Address
);
export default AddressModel;
