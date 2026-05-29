import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = 20;
    const skip = (page - 1) * limit;

    await connectDB();

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(),
    ]);

    return Response.json({
      posts,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, description, githubLink, demoLink, screenshots, tags, authorId } = body;

    if (!title?.trim() || !description?.trim()) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!authorId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const post = await Post.create({
      title: title.trim(),
      description: description.trim(),
      githubLink: githubLink?.trim() || undefined,
      demoLink: demoLink?.trim() || undefined,
      screenshots: screenshots ?? [],
      tags: tags ?? [],
      authorId,
    });

    return Response.json(post, { status: 201 });
  } catch (error) {
    console.error("[POST /api/posts]", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
