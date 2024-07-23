import { Schema, model, Types } from "mongoose";
import { ISession } from "../types/session";
import { SCHEMA_IDS } from "../constants";

const SessionSchema = new Schema<ISession>(
  {
    createdAt: { type: Date, default: Date.now(), expires: "2.5 hrs" },
    token: { type: String, required: true },
    user: {
      type: Types.ObjectId,
      ref: SCHEMA_IDS.User,
      required: true,
    },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);
const SessionModel = model<ISession>(
  SCHEMA_IDS.Session,
  SessionSchema,
  SCHEMA_IDS.Session
);

export default SessionModel;
