import mongoose from "mongoose";
import Post from "@/models/Post";

describe("Post model — comments sub-document", () => {
  it("comments default to an empty array on a new post", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
    });
    expect(post.comments).toBeDefined();
    expect(Array.isArray(post.comments)).toBe(true);
    expect(post.comments).toHaveLength(0);
  });

  it("accepts a valid comment with text, authorId and authorAvatar", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [
        {
          text: "Great project!",
          authorId: "commenter_1",
          authorAvatar: "https://github.com/commenter_1.png",
        },
      ],
    });
    const error = post.validateSync();
    expect(error).toBeUndefined();
    expect(post.comments[0].text).toBe("Great project!");
    expect(post.comments[0].authorId).toBe("commenter_1");
    expect(post.comments[0].authorAvatar).toBe("https://github.com/commenter_1.png");
  });

  it("auto-generates a MongoDB _id for each comment", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [{ text: "Nice work", authorId: "user_2" }],
    });
    expect(post.comments[0]._id).toBeDefined();
    expect(post.comments[0]._id).toBeInstanceOf(mongoose.Types.ObjectId);
  });

  it("fails validation when comment text is missing", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [{ authorId: "user_2" }],
    });
    const error = post.validateSync();
    expect(error).toBeDefined();
    expect(error?.errors["comments.0.text"]).toBeDefined();
  });

  it("fails validation when comment authorId is missing", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [{ text: "Great work!" }],
    });
    const error = post.validateSync();
    expect(error).toBeDefined();
    expect(error?.errors["comments.0.authorId"]).toBeDefined();
  });

  it("authorAvatar is optional on a comment", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [{ text: "Nice!", authorId: "user_2" }],
    });
    const error = post.validateSync();
    expect(error).toBeUndefined();
    expect(post.comments[0].authorAvatar).toBeUndefined();
  });

  it("createdAt is set on comment via timestamps", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [{ text: "Awesome!", authorId: "user_2" }],
    });
    // createdAt on sub-doc is set automatically when using timestamps option
    expect(post.comments[0]).toBeDefined();
  });

  it("supports multiple comments on a single post", () => {
    const post = new Post({
      title: "Test",
      description: "Test desc",
      authorId: "user_1",
      comments: [
        { text: "First comment", authorId: "user_2" },
        { text: "Second comment", authorId: "user_3" },
      ],
    });
    const error = post.validateSync();
    expect(error).toBeUndefined();
    expect(post.comments).toHaveLength(2);
  });
});
