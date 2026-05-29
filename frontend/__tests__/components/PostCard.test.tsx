import { render, screen } from "@testing-library/react";
import PostCard, { Post } from "@/app/components/PostCard";

// Mock next/link to render a plain <a> so href is testable in jsdom
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock next/image to avoid image loading complexity in tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const mockPost: Post = {
  _id: "507f1f77bcf86cd799439011",
  title: "My Expense Tracker",
  description: "A budgeting app built with React and Node.js",
  githubLink: "https://github.com/user/expense-tracker",
  demoLink: "https://expense-tracker.demo.com",
  screenshots: [],
  tags: ["React", "Node.js"],
  authorId: "intern_john",
  likes: ["user1", "user2"],
  createdAt: "2024-01-15T10:00:00.000Z",
};

describe("PostCard", () => {
  it("renders the post title", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("My Expense Tracker")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("intern_john")).toBeInTheDocument();
  });

  it("renders all tech stack tags", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
  });

  it("renders the correct like count", () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("wraps the entire card in a link to /posts/[id]", () => {
    render(<PostCard post={mockPost} />);
    const link = screen.getByRole("link", { name: /my expense tracker/i });
    expect(link).toHaveAttribute("href", "/posts/507f1f77bcf86cd799439011");
  });

  it("renders GitHub link when provided", () => {
    render(<PostCard post={mockPost} />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/user/expense-tracker");
  });

  it("renders demo link when provided", () => {
    render(<PostCard post={mockPost} />);
    const demoLink = screen.getByRole("link", { name: /demo/i });
    expect(demoLink).toHaveAttribute("href", "https://expense-tracker.demo.com");
  });

  it("does not render GitHub link when not provided", () => {
    const postWithoutGithub = { ...mockPost, githubLink: undefined };
    render(<PostCard post={postWithoutGithub} />);
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });

  it("does not render demo link when not provided", () => {
    const postWithoutDemo = { ...mockPost, demoLink: undefined };
    render(<PostCard post={postWithoutDemo} />);
    expect(screen.queryByRole("link", { name: /demo/i })).not.toBeInTheDocument();
  });

  it("shows 0 likes when likes array is empty", () => {
    const postWithNoLikes = { ...mockPost, likes: [] };
    render(<PostCard post={postWithNoLikes} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("handles missing likes field gracefully", () => {
    const postWithoutLikes = { ...mockPost, likes: undefined as unknown as string[] };
    render(<PostCard post={postWithoutLikes} />);
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
