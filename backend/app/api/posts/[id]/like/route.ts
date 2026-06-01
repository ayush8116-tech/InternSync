import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_URL ?? "http://localhost:8000",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function PATCH(
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

    await connectDB();

    const post = await Post.findById(id).lean();
    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404, headers: CORS_HEADERS });
    }

    const alreadyLiked = post.likes.includes(user.login);

    const updated = await Post.findByIdAndUpdate(
      id,
      alreadyLiked
        ? { $pull: { likes: user.login } }
        : { $push: { likes: user.login } },
      { returnDocument: "after" }
    ).lean();

    return Response.json({ likes: updated!.likes }, { status: 200, headers: CORS_HEADERS });
  } catch (error) {
    console.error("[PATCH /api/posts/[id]/like]", error);
    return Response.json({ error: "Internal server error" }, { status: 500, headers: CORS_HEADERS });
  }
}
