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

// Mock EditPostForm — its behaviour is covered in PostForm.test.tsx.
// Here we only test the server component's fetch + routing logic.
jest.mock("@/app/posts/[id]/edit/EditPostForm", () => ({
  __esModule: true,
  default: ({ post }: { post: typeof mockPost }) => (
    <div>
      <input aria-label="title" defaultValue={post.title} />
      <textarea aria-label="description" defaultValue={post.description} />
      <input aria-label="githubLink" defaultValue={post.githubLink} />
      <input aria-label="demoLink" defaultValue={post.demoLink} />
      {post.tags.map((t: string) => <span key={t}>{t}</span>)}
      {post.screenshots.map((s: string) => <img key={s} src={s} alt="screenshot" />)}
      <button>Save Changes</button>
    </div>
  ),
}));

const mockPost = {
  _id: "507f1f77bcf86cd799439011",
  title: "My Expense Tracker",
  description: "A budgeting app built during my internship.",
  githubLink: "https://github.com/user/expense-tracker",
  demoLink: "https://expense-tracker.demo.com",
  screenshots: ["https://res.cloudinary.com/test/image/upload/v1/shot.png"],
  tags: ["React", "Node.js"],
  authorId: "intern_john",
  likes: [],
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
  const { default: Page } = await import("@/app/posts/[id]/edit/page");
  const jsx = await Page({ params: Promise.resolve({ id }) });
  return render(jsx);
}

describe("Edit post page", () => {
  beforeEach(() => jest.resetModules());
  afterEach(() => jest.restoreAllMocks());

  describe("when post exists", () => {
    beforeEach(() => mockFetchSuccess());

    it("pre-fills the title field with current post title", async () => {
      await renderPage();
      expect(screen.getByRole("textbox", { name: /title/i })).toHaveValue("My Expense Tracker");
    });

    it("pre-fills the description field", async () => {
      await renderPage();
      expect(screen.getByRole("textbox", { name: /description/i })).toHaveValue(
        "A budgeting app built during my internship."
      );
    });

    it("pre-fills the GitHub link field", async () => {
      await renderPage();
      expect(screen.getByRole("textbox", { name: /githubLink/i })).toHaveValue(
        "https://github.com/user/expense-tracker"
      );
    });

    it("pre-fills the demo link field", async () => {
      await renderPage();
      expect(screen.getByRole("textbox", { name: /demoLink/i })).toHaveValue(
        "https://expense-tracker.demo.com"
      );
    });

    it("pre-fills existing tags", async () => {
      await renderPage();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });

    it("pre-fills existing screenshots", async () => {
      await renderPage();
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "https://res.cloudinary.com/test/image/upload/v1/shot.png"
      );
    });

    it("renders Save Changes as the submit label", async () => {
      await renderPage();
      expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
    });

    it("renders a back link to the post detail page", async () => {
      await renderPage();
      const backLink = screen.getByRole("link", { name: /back/i });
      expect(backLink).toHaveAttribute("href", `/posts/${mockPost._id}`);
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

    it("does not render the edit form", async () => {
      await renderPage();
      expect(screen.queryByRole("button", { name: /save changes/i })).not.toBeInTheDocument();
    });
  });
});
