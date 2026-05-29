import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await connectDB();

    const post = await Post.findById(id).lean();

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(post, { status: 200 });
  } catch (error) {
    console.error("[GET /api/posts/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, githubLink, demoLink, screenshots, tags } = body;

    if (!title?.trim() || !description?.trim()) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const post = await Post.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description.trim(),
        githubLink: githubLink?.trim() || undefined,
        demoLink: demoLink?.trim() || undefined,
        screenshots: screenshots ?? [],
        tags: tags ?? [],
      },
      { new: true, runValidators: true }
    ).lean();

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    return Response.json(post, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/posts/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
