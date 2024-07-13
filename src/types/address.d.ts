import { Document } from "mongoose";

export interface IAddress extends Document {
  userId: Types.ObjectId;
  address: string;
  phone: string;
  deliveryto: "home" | "work" | "gym";
  postalcode: string;
  country: string;
  city: string;
  state: string;
}
