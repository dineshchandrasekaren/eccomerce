import { Types } from "mongoose";

export const stringToObjectId = (id: string) =>
  Types.ObjectId.createFromHexString(id);
