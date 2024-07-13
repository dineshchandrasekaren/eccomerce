import { Schema, model, Types } from "mongoose";
import { ISession } from "../types/session";
import { SCHEMA_IDS } from "../constants";
import ms from "ms";
import config from "../config";

const SessionSchema = new Schema<ISession>(
  {
    token: { type: String, required: true },
    user: {
      type: Types.ObjectId,
      ref: SCHEMA_IDS.User,
      required: true,
    },
    lastAccessedAt: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);

SessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: ms(config.AUTH_EXPIRY) }
);

const SessionModel = model<ISession>(
  SCHEMA_IDS.Session,
  SessionSchema,
  SCHEMA_IDS.Session
);

export default SessionModel;
