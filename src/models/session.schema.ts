import { Schema, model, Types } from "mongoose";
import { ISession } from "../types/session";
import { SCHEMA_IDS } from "../constants";
import config from "../config";

const SessionSchema = new Schema<ISession>({
  token: { type: String, required: true },
  user: {
    type: Types.ObjectId,
    ref: SCHEMA_IDS.User,
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: config.AUTH_EXPIRY },
  lastAccessedAt: { type: Date, default: Date.now() },
});

const SessionModel = model<ISession>(
  SCHEMA_IDS.Session,
  SessionSchema,
  SCHEMA_IDS.Session
);

export default SessionModel;
