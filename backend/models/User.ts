import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  githubId: string;
  login: string;
  name: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    githubId: { type: String, required: true, unique: true },
    login: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
