import { Document, Schema, model } from "mongoose";

export type UserRole = "creator" | "clipper" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePic?: string;
  balance: number;
  cpm?: number;
  portfolioUrl?: string;
  socialLinks?: {
    youtube?: string;
    twitch?: string;
    tiktok?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["creator", "clipper", "admin"],
      required: true,
      default: "clipper",
    },
    profilePic: String,
    balance: { type: Number, default: 0 },
    cpm: { type: Number, default: 5 },
    portfolioUrl: String,
    socialLinks: {
      youtube: String,
      twitch: String,
      tiktok: String,
    },
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = model<IUser>("User", UserSchema);

export default User;
