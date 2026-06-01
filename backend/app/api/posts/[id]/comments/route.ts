import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL ?? "http://localhost:8000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: "Post not found" }, { status: 404, headers: CORS_HEADERS });
    }

    const { text } = await request.json();

    if (!text?.trim()) {
      return Response.json(
        { error: "Comment text is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      text: text.trim(),
      authorId: user.login,
      authorAvatar: user.avatarUrl,
      createdAt: new Date(),
    };

    await connectDB();

    const post = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404, headers: CORS_HEADERS });
    }

    // Find by _id — safe even for documents created before the comments field existed
    const saved = post.comments?.find(
      (c) => c._id.toString() === newComment._id.toString()
    ) ?? newComment;

    return Response.json({ comment: saved }, { status: 201, headers: CORS_HEADERS });
  } catch (error) {
    console.error("[POST /api/posts/[id]/comments]", error);
    return Response.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS });
  }
}
