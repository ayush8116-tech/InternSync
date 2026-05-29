import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

jest.mock("@/lib/db");
jest.mock("@/models/Post");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;

// Helper: create a minimal NextRequest
function makeRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost:3001/api/posts/${id}`);
}

// Helper: simulate params as a Promise (Next.js 16 convention)
function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

const VALID_ID = "507f1f77bcf86cd799439011";

const mockPost = {
  _id: VALID_ID,
  title: "Test Project",
  description: "A test description",
  githubLink: "https://github.com/test/repo",
  demoLink: "https://demo.test.com",
  screenshots: ["https://res.cloudinary.com/test/image.png"],
  tags: ["React", "Node.js"],
  authorId: "user_123",
  likes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("GET /api/posts/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConnectDB.mockResolvedValue({} as never);
  });

  it("returns 200 with full post data when a valid ID exists", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPost),
    });

    const { GET } = await import("@/app/api/posts/[id]/route");
    const res = await GET(makeRequest(VALID_ID), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data._id).toBe(VALID_ID);
    expect(data.title).toBe("Test Project");
    expect(data.tags).toEqual(["React", "Node.js"]);
  });

  it("returns 404 with an error message when post does not exist", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const { GET } = await import("@/app/api/posts/[id]/route");
    const res = await GET(makeRequest(VALID_ID), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 404 when the ID is not a valid MongoDB ObjectId", async () => {
    const { GET } = await import("@/app/api/posts/[id]/route");
    const res = await GET(makeRequest("not-a-valid-id"), makeParams("not-a-valid-id"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 500 when the database throws an error", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB connection failed")),
    });

    const { GET } = await import("@/app/api/posts/[id]/route");
    const res = await GET(makeRequest(VALID_ID), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("calls connectDB before querying the database", async () => {
    (Post.findById as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockPost),
    });

    const { GET } = await import("@/app/api/posts/[id]/route");
    await GET(makeRequest(VALID_ID), makeParams(VALID_ID));

    expect(mockConnectDB).toHaveBeenCalledTimes(1);
  });
});
