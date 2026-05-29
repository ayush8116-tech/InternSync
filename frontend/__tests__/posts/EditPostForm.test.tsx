import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditPostForm from "@/app/posts/[id]/edit/EditPostForm";
import { Post } from "@/app/components/PostCard";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockPost: Post = {
  _id: "507f1f77bcf86cd799439011",
  title: "Old Title",
  description: "Old description",
  githubLink: "https://github.com/user/repo",
  demoLink: "https://demo.com",
  screenshots: [],
  tags: ["React"],
  authorId: "intern_john",
  likes: [],
  createdAt: "2024-01-15T10:00:00.000Z",
};

async function submitForm() {
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: /save changes/i }));
}

describe("EditPostForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders PostForm pre-filled with the post's current values", () => {
    render(<EditPostForm post={mockPost} />);
    expect(screen.getByDisplayValue("Old Title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Old description")).toBeInTheDocument();
  });

  it("renders Save Changes as the submit label", () => {
    render(<EditPostForm post={mockPost} />);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });

  it("calls PATCH /api/posts/[id] with the updated payload on submit", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ...mockPost, title: "Old Title" }),
    } as Response);

    render(<EditPostForm post={mockPost} />);
    await submitForm();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/posts/${mockPost._id}`),
        expect.objectContaining({ method: "PATCH" })
      );
    });
  });

  it("sends the correct Content-Type header", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPost,
    } as Response);

    render(<EditPostForm post={mockPost} />);
    await submitForm();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "Content-Type": "application/json" },
        })
      );
    });
  });

  it("redirects to /posts/[id] after a successful save", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPost,
    } as Response);

    render(<EditPostForm post={mockPost} />);
    await submitForm();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/posts/${mockPost._id}`);
    });
  });

  it("does not redirect when the API returns an error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Internal server error" }),
    } as unknown as Response);

    render(<EditPostForm post={mockPost} />);
    await submitForm();

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("shows an error message when the API returns an error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Internal server error" }),
    } as unknown as Response);

    render(<EditPostForm post={mockPost} />);
    await submitForm();

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
