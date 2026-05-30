import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { getAuthUser } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extracts the Cloudinary public ID from a secure_url
// e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/intern-platform/abc.png → intern-platform/abc
function extractPublicId(url: string): string | null {
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
  return match ? match[1] : null;
}

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await connectDB();

    const post = await Post.findById(id).lean();

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId !== user.login) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Best-effort Cloudinary cleanup — DB deletion proceeds regardless
    for (const url of post.screenshots) {
      const publicId = extractPublicId(url);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("[DELETE /api/posts/[id]] Cloudinary destroy failed", err);
        }
      }
    }

    await Post.findByIdAndDelete(id);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[DELETE /api/posts/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    await connectDB();

    const existing = await Post.findById(id).lean();

    if (!existing) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    if (existing.authorId !== user.login) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, githubLink, demoLink, screenshots, tags } = body;

    if (!title?.trim() || !description?.trim()) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

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

    return Response.json(post, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/posts/[id]]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
