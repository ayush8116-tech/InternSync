import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";
import { signJwt } from "@/lib/auth";
import mongoose from "mongoose";

jest.mock("@/lib/db");
jest.mock("@/models/Post");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;

const VALID_ID = "507f1f77bcf86cd799439011";

const mockUser = {
  sub: "1234567",
  login: "intern_john",
  name: "John Doe",
  avatarUrl: "https://github.com/intern_john.png",
};

function makeAuthToken() {
  return signJwt(mockUser);
}

function makeRequest(id: string, body: object, withAuth = true): NextRequest {
  const req = new NextRequest(`http://localhost:3001/api/posts/${id}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (withAuth) {
    req.cookies.set("auth_token", makeAuthToken());
  }
  return req;
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const mockComment = {
  _id: new mongoose.Types.ObjectId(),
  text: "Great project!",
  authorId: "intern_john",
  authorAvatar: "https://github.com/intern_john.png",
  createdAt: new Date(),
};

describe("POST /api/posts/[id]/comments", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue({} as never);
  });

  it("returns 201 with the new comment on valid input", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: VALID_ID,
        comments: [mockComment],
      }),
    });

    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest(VALID_ID, { text: "Great project!" }), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.comment).toBeDefined();
    expect(data.comment.text).toBe("Great project!");
  });

  it("returns 401 when no auth token is present", async () => {
    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest(VALID_ID, { text: "Hello" }, false), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 when comment text is empty", async () => {
    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest(VALID_ID, { text: "  " }), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Comment text is required");
  });

  it("returns 400 when text field is missing", async () => {
    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest(VALID_ID, {}), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Comment text is required");
  });

  it("returns 404 for invalid MongoDB ObjectId", async () => {
    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest("bad-id", { text: "Hello" }), makeParams("bad-id"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 404 when post does not exist", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest(VALID_ID, { text: "Hello" }), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 500 when the database throws", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    const res = await POST(makeRequest(VALID_ID, { text: "Hello" }), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("stores the commenter's login and avatarUrl from the JWT", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        _id: VALID_ID,
        comments: [mockComment],
      }),
    });

    const { POST } = await import("@/app/api/posts/[id]/comments/route");
    await POST(makeRequest(VALID_ID, { text: "Nice work!" }), makeParams(VALID_ID));

    expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_ID,
      expect.objectContaining({
        $push: expect.objectContaining({
          comments: expect.objectContaining({
            authorId: mockUser.login,
            authorAvatar: mockUser.avatarUrl,
          }),
        }),
      }),
      expect.any(Object)
    );
  });
});
