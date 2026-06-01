import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentSection from "@/app/components/CommentSection";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockUser = {
  sub: "123",
  login: "intern_john",
  name: "John Doe",
  avatarUrl: "https://github.com/intern_john.png",
};

jest.mock("@/app/components/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/app/components/AuthProvider";
const mockUseAuth = useAuth as jest.Mock;

const existingComments = [
  {
    _id: "c1",
    text: "Great project!",
    authorId: "jane_doe",
    authorAvatar: "https://github.com/jane_doe.png",
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    _id: "c2",
    text: "How did you build this?",
    authorId: "bob_smith",
    authorAvatar: "https://github.com/bob_smith.png",
    createdAt: "2024-01-16T12:00:00.000Z",
  },
];

const POST_ID = "507f1f77bcf86cd799439011";

describe("CommentSection — guest user", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
  });

  it("shows existing comments", () => {
    render(<CommentSection postId={POST_ID} initialComments={existingComments} />);
    expect(screen.getByText("Great project!")).toBeInTheDocument();
    expect(screen.getByText("How did you build this?")).toBeInTheDocument();
  });

  it("shows comment authors", () => {
    render(<CommentSection postId={POST_ID} initialComments={existingComments} />);
    expect(screen.getByText("jane_doe")).toBeInTheDocument();
    expect(screen.getByText("bob_smith")).toBeInTheDocument();
  });

  it("does not show the comment input box", () => {
    render(<CommentSection postId={POST_ID} initialComments={existingComments} />);
    expect(screen.queryByPlaceholderText(/write a comment/i)).not.toBeInTheDocument();
  });

  it("shows a login prompt instead of the input", () => {
    render(<CommentSection postId={POST_ID} initialComments={existingComments} />);
    expect(screen.getByText(/log in to comment/i)).toBeInTheDocument();
  });

  it("renders with no comments gracefully", () => {
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    expect(screen.getByText(/no comments yet/i)).toBeInTheDocument();
  });
});

describe("CommentSection — logged-in user", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: mockUser, loading: false });
    jest.clearAllMocks();
  });

  it("shows the comment input box", () => {
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    expect(screen.getByPlaceholderText(/write a comment/i)).toBeInTheDocument();
  });

  it("shows a submit button", () => {
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    expect(screen.getByRole("button", { name: /post/i })).toBeInTheDocument();
  });

  it("shows a validation error when submitting empty comment", async () => {
    const user = userEvent.setup();
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    await user.click(screen.getByRole("button", { name: /post/i }));
    await waitFor(() => {
      expect(screen.getByText(/comment cannot be empty/i)).toBeInTheDocument();
    });
  });

  it("shows a validation error for whitespace-only comment", async () => {
    const user = userEvent.setup();
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    await user.type(screen.getByPlaceholderText(/write a comment/i), "   ");
    await user.click(screen.getByRole("button", { name: /post/i }));
    await waitFor(() => {
      expect(screen.getByText(/comment cannot be empty/i)).toBeInTheDocument();
    });
  });

  it("calls POST /api/posts/[id]/comments on valid submit", async () => {
    const newComment = {
      _id: "c3",
      text: "Looks amazing!",
      authorId: "intern_john",
      authorAvatar: "https://github.com/intern_john.png",
      createdAt: new Date().toISOString(),
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ comment: newComment }),
    } as Response);

    const user = userEvent.setup();
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    await user.type(screen.getByPlaceholderText(/write a comment/i), "Looks amazing!");
    await user.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/posts/${POST_ID}/comments`),
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("shows the new comment in the list after successful submit", async () => {
    const newComment = {
      _id: "c3",
      text: "Looks amazing!",
      authorId: "intern_john",
      authorAvatar: "https://github.com/intern_john.png",
      createdAt: new Date().toISOString(),
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ comment: newComment }),
    } as Response);

    const user = userEvent.setup();
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    await user.type(screen.getByPlaceholderText(/write a comment/i), "Looks amazing!");
    await user.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText("Looks amazing!")).toBeInTheDocument();
    });
  });

  it("clears the input after a successful submit", async () => {
    const newComment = {
      _id: "c3",
      text: "Nice work!",
      authorId: "intern_john",
      authorAvatar: "https://github.com/intern_john.png",
      createdAt: new Date().toISOString(),
    };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ comment: newComment }),
    } as Response);

    const user = userEvent.setup();
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    const input = screen.getByPlaceholderText(/write a comment/i);
    await user.type(input, "Nice work!");
    await user.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("shows an error message when the API fails", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Internal server error" }),
    } as unknown as Response);

    const user = userEvent.setup();
    render(<CommentSection postId={POST_ID} initialComments={[]} />);
    await user.type(screen.getByPlaceholderText(/write a comment/i), "Hello");
    await user.click(screen.getByRole("button", { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
