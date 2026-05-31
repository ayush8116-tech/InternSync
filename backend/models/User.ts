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

const User = mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
