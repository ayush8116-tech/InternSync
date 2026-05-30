import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

jest.mock("@/lib/db");
jest.mock("@/models/Post");
jest.mock("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: { destroy: jest.fn() },
  },
}));

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockDestroy = cloudinary.uploader.destroy as jest.Mock;

const VALID_ID = "507f1f77bcf86cd799439011";

const mockPost = {
  _id: VALID_ID,
  title: "Test Project",
  description: "A test description",
  screenshots: [
    "https://res.cloudinary.com/demo/image/upload/v1234567890/intern-platform/abc.png",
    "https://res.cloudinary.com/demo/image/upload/v1234567890/intern-platform/def.png",
  ],
  tags: ["React"],
  authorId: "user_123",
  likes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function makeRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost:3001/api/posts/${id}`, {
    method: "DELETE",
  });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("DELETE /api/posts/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue({} as never);
    mockDestroy.mockResolvedValue({ result: "ok" });
  });

  it("returns 204 when the post is found and deleted", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPost),
    });
    (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    const res = await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));

    expect(res.status).toBe(204);
  });

  it("calls cloudinary destroy once per screenshot URL", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPost),
    });
    (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));

    expect(mockDestroy).toHaveBeenCalledTimes(2);
    expect(mockDestroy).toHaveBeenCalledWith("intern-platform/abc");
    expect(mockDestroy).toHaveBeenCalledWith("intern-platform/def");
  });

  it("still deletes the DB record when Cloudinary destroy throws", async () => {
    mockDestroy.mockRejectedValue(new Error("Cloudinary error"));
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPost),
    });
    (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    const res = await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));

    expect(res.status).toBe(204);
    expect(Post.findByIdAndDelete).toHaveBeenCalledWith(VALID_ID);
  });

  it("returns 404 for an invalid MongoDB ObjectId", async () => {
    const { DELETE } = await import("@/app/api/posts/[id]/route");
    const res = await DELETE(makeRequest("not-valid"), makeParams("not-valid"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 404 when the post does not exist", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    const res = await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 500 when the database throws", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    const res = await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("calls connectDB before querying", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPost),
    });
    (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(mockPost);

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));

    expect(mockConnectDB).toHaveBeenCalledTimes(1);
  });

  it("does not call cloudinary destroy when the post has no screenshots", async () => {
    const postNoScreenshots = { ...mockPost, screenshots: [] };
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(postNoScreenshots),
    });
    (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(postNoScreenshots);

    const { DELETE } = await import("@/app/api/posts/[id]/route");
    const res = await DELETE(makeRequest(VALID_ID), makeParams(VALID_ID));

    expect(res.status).toBe(204);
    expect(mockDestroy).not.toHaveBeenCalled();
  });
});
