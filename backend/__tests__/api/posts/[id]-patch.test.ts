import { NextRequest } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/models/Post";

jest.mock("@/lib/db");
jest.mock("@/models/Post");

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>;

const VALID_ID = "507f1f77bcf86cd799439011";

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
  });

  it("returns 200 with the updated post on valid input", async () => {
    const updatedPost = { ...existingPost, ...validBody };
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(updatedPost),
    });

    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe("Updated Title");
    expect(data.description).toBe("Updated description");
    expect(data.tags).toEqual(["React", "Node.js"]);
  });

  it("returns 400 when title is missing", async () => {
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(
      makeRequest(VALID_ID, { ...validBody, title: "" }),
      makeParams(VALID_ID)
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Title and description are required");
  });

  it("returns 400 when description is missing", async () => {
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(
      makeRequest(VALID_ID, { ...validBody, description: "" }),
      makeParams(VALID_ID)
    );
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Title and description are required");
  });

  it("returns 404 when post does not exist", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(null),
    });

    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 404 for an invalid MongoDB ObjectId", async () => {
    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest("bad-id", validBody), makeParams("bad-id"));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe("Post not found");
  });

  it("returns 500 when the database throws", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    const { PATCH } = await import("@/app/api/posts/[id]/route");
    const res = await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });

  it("calls connectDB before querying", async () => {
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue({ ...existingPost, ...validBody }),
    });

    const { PATCH } = await import("@/app/api/posts/[id]/route");
    await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));

    expect(mockConnectDB).toHaveBeenCalledTimes(1);
  });

  it("uses findByIdAndUpdate with new:true to return the updated document", async () => {
    const updatedPost = { ...existingPost, ...validBody };
    (Post.findByIdAndUpdate as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue(updatedPost),
    });

    const { PATCH } = await import("@/app/api/posts/[id]/route");
    await PATCH(makeRequest(VALID_ID, validBody), makeParams(VALID_ID));

    expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
      VALID_ID,
      expect.objectContaining({ title: "Updated Title" }),
      { new: true, runValidators: true }
    );
  });
});
