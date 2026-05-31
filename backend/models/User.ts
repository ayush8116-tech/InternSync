import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  githubId?: string;
  login: string;
  name: string;
  avatarUrl: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, unique: true, sparse: true },
    login: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    password: { type: String },
  },
  { timestamps: true }
);

// In dev, delete the cached model so schema changes are picked up on hot reload
if (process.env.NODE_ENV !== "production" && mongoose.models.User) {
  delete (mongoose.models as Record<string, unknown>).User;
}

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
