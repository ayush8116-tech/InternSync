import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

jest.mock("@/lib/db");
jest.mock("@/models/Post");
jest.mock("@/lib/auth", () => ({
  getAuthUser: jest.fn(),
}));

import { getAuthUser } from "@/lib/auth";

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;
const mockGetAuthUser = getAuthUser as jest.Mock;

const VALID_ID = "507f1f77bcf86cd799439011";

const mockUser = { sub: "u1", login: "user_123", name: "User", avatarUrl: "" };

const existingPost = {
  _id: VALID_ID,
  title: "Old Title",
  description: "Old description",
  githubLink: "https://github.com/old",
  demoLink: "https://old-demo.com",
  screenshots: [],
  tags: ["React"],
  authorId: "user_123",
  likes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const validBody = {
  title: "Updated Title",
  description: "Updated description",
  githubLink: "https://github.com/new",
  demoLink: "https://new-demo.com",
  screenshots: ["https://res.cloudinary.com/test/new.png"],
  tags: ["React", "Node.js"],
};

function makeRequest(id: string, body: object): NextRequest {
  return new NextRequest(`http://localhost:3001/api/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("PATCH /api/posts/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue({} as never);
    mockGetAuthUser.mockReturnValue(mockUser);
  });

  it("returns 401 when not authenticated", async () => {
    mockGetAuthUser.mockReturnValue(null);
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    expect(res.status).toBe(401);
  });

  it("returns 403 when authenticated user is not the post owner", async () => {
    mockGetAuthUser.mockReturnValue({ ...mockUser, login: "other_user" });
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(existingPost),
    });
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    expect(res.status).toBe(403);
  });

  it("returns 200 with the updated post on valid input", async () => {
    const updatedPost = { ...existingPost, ...validBody };
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(existingPost),
    });
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(updatedPost),
    });

    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Updated Title");
  });

  it("returns 400 when title is missing", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(existingPost),
    });
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(
      makeRequest(VALID_ID, { ...validBody, title: "" }),
      makeParams(VALID_ID)
    );
    expect(res.status).toBe(400);
  });

  it("returns 404 when post does not exist", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    expect(res.status).toBe(404);
  });

  it("returns 404 for an invalid MongoDB ObjectId", async () => {
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest("bad-id", validBody), makeParams("bad-id"));
    expect(res.status).toBe(404);
  });

  it("returns 500 when the database throws", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    });
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    expect(res.status).toBe(500);
  });
});
