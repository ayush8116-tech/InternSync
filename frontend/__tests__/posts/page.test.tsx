import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock("@/app/posts/[id]/PostDetailActions", () => ({
  __esModule: true,
  default: ({ postId }: { postId: string }) => (
    <div data-testid="post-detail-actions" data-post-id={postId}>
      <a href={`/posts/${postId}/edit`}>Edit</a>
    </div>
  ),
}));

const mockPost = {
  _id: "507f1f77bcf86cd799439011",
  title: "My Expense Tracker",
  description: "A budgeting app built during my internship to track daily expenses.",
  githubLink: "https://github.com/user/expense-tracker",
  demoLink: "https://expense-tracker.demo.com",
  screenshots: [
    "https://res.cloudinary.com/test/image/upload/v1/screenshot1.png",
    "https://res.cloudinary.com/test/image/upload/v1/screenshot2.png",
  ],
  tags: ["React", "Node.js", "MongoDB"],
  authorId: "intern_john",
  likes: ["user1", "user2", "user3"],
  createdAt: "2024-01-15T10:00:00.000Z",
};

function mockFetchSuccess() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockPost,
  } as Response);
}

function mockFetchNotFound() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status: 404,
    json: async () => ({ error: "Post not found" }),
  } as unknown as Response);
}

async function renderPage(id = "507f1f77bcf86cd799439011") {
  const { default: Page } = await import("@/app/posts/[id]/page");
  const params = Promise.resolve({ id });
  const jsx = await Page({ params });
  return render(jsx);
}

describe("Post detail page", () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.restoreAllMocks());

  describe("when post exists", () => {
    beforeEach(() => mockFetchSuccess());

    it("renders the post title", async () => {
      await renderPage();
      expect(screen.getByRole("heading", { name: "My Expense Tracker" })).toBeInTheDocument();
    });

    it("renders the full description", async () => {
      await renderPage();
      expect(screen.getByText(/A budgeting app built during my internship/)).toBeInTheDocument();
    });

    it("renders the author name", async () => {
      await renderPage();
      expect(screen.getByText("intern_john")).toBeInTheDocument();
    });

    it("renders all tech stack tags", async () => {
      await renderPage();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
      expect(screen.getByText("MongoDB")).toBeInTheDocument();
    });

    it("renders the correct like count", async () => {
      await renderPage();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("renders the GitHub link with correct href", async () => {
      await renderPage();
      const link = screen.getByRole("link", { name: /github/i });
      expect(link).toHaveAttribute("href", "https://github.com/user/expense-tracker");
    });

    it("renders the demo link with correct href", async () => {
      await renderPage();
      const link = screen.getByRole("link", { name: /demo/i });
      expect(link).toHaveAttribute("href", "https://expense-tracker.demo.com");
    });

    it("renders all screenshots", async () => {
      await renderPage();
      const images = screen.getAllByRole("img");
      expect(images).toHaveLength(2);
      expect(images[0]).toHaveAttribute("src", mockPost.screenshots[0]);
      expect(images[1]).toHaveAttribute("src", mockPost.screenshots[1]);
    });

    it("renders a back link to the home feed", async () => {
      await renderPage();
      const backLink = screen.getByRole("link", { name: /back/i });
      expect(backLink).toHaveAttribute("href", "/");
    });

    it("does not render GitHub link when absent", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockPost, githubLink: undefined }),
      } as Response);
      await renderPage();
      expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
    });

    it("does not render demo link when absent", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockPost, demoLink: undefined }),
      } as Response);
      await renderPage();
      expect(screen.queryByRole("link", { name: /demo/i })).not.toBeInTheDocument();
    });

    it("does not render screenshots section when no screenshots", async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockPost, screenshots: [] }),
      } as Response);
      await renderPage();
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders PostDetailActions with the correct postId", async () => {
      await renderPage();
      const actions = screen.getByTestId("post-detail-actions");
      expect(actions).toHaveAttribute("data-post-id", mockPost._id);
    });

    it("renders an Edit link via PostDetailActions", async () => {
      await renderPage();
      const editLink = screen.getByRole("link", { name: /edit/i });
      expect(editLink).toHaveAttribute("href", `/posts/${mockPost._id}/edit`);
    });
  });

  describe("when post is not found", () => {
    beforeEach(() => mockFetchNotFound());

    it("renders a not found message", async () => {
      await renderPage();
      expect(screen.getByText(/post not found/i)).toBeInTheDocument();
    });

    it("renders a back link to the home feed", async () => {
      await renderPage();
      const backLink = screen.getByRole("link", { name: /back/i });
      expect(backLink).toHaveAttribute("href", "/");
    });

    it("does not render any post content", async () => {
      await renderPage();
      expect(screen.queryByRole("heading", { name: "My Expense Tracker" })).not.toBeInTheDocument();
    });

    it("does not render PostDetailActions", async () => {
      await renderPage();
      expect(screen.queryByTestId("post-detail-actions")).not.toBeInTheDocument();
    });
  });
});
