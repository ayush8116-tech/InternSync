import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  title: string;
  description: string;
  githubLink?: string;
  demoLink?: string;
  screenshots: string[];
  tags: string[];
  authorId: string;
  authorAvatar?: string;
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    githubLink: { type: String, trim: true },
    demoLink: { type: String, trim: true },
    screenshots: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    authorId: { type: String, required: true },
    authorAvatar: { type: String },
    likes: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post ?? mongoose.model<IPost>("Post", PostSchema);

export default Post;
