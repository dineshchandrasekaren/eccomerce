import { SCHEMA_IDS } from "../constants";
import { Schema, model } from "mongoose";
import { IAddress } from "../types/address";

const addressSchema = new Schema<IAddress>({
  address: String,
  phone: String,
  deliveryto: { type: String, enum: ["home", "work", "gym"] },
  postalcode: String,
  country: String,
  city: String,
  state: String,
});

const AddressModel = model<IAddress>(
  SCHEMA_IDS.Address,
  addressSchema,
  SCHEMA_IDS.Address
);
export default AddressModel;
