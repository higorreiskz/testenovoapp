import { Document, Schema, model, Types } from "mongoose";

export type ClipStatus = "pending" | "approved" | "rejected";

export interface IClip extends Document {
  creatorId: Types.ObjectId;
  clipperId: Types.ObjectId;
  title: string;
  videoUrl: string;
  views: number;
  status: ClipStatus;
  cpm: number;
  earnings: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClipSchema = new Schema<IClip>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clipperId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    views: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    cpm: { type: Number, required: true },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Clip = model<IClip>("Clip", ClipSchema);

export default Clip;
