import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostDetailActions from "@/app/posts/[id]/PostDetailActions";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/app/components/AuthProvider", () => ({
  useAuth: () => ({ user: { login: "intern_john", name: "John", avatarUrl: "" } }),
}));

const POST_ID = "507f1f77bcf86cd799439011";
const AUTHOR_ID = "intern_john";

describe("PostDetailActions", () => {
  beforeEach(() => {
    mockPush.mockClear();
    global.fetch = jest.fn();
  });

  it("renders Edit link and Delete button for the post owner", () => {
    render(<PostDetailActions postId={POST_ID} authorId={AUTHOR_ID} />);
    expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^delete$/i })).toBeInTheDocument();
  });

  it("Edit link points to /posts/[id]/edit", () => {
    render(<PostDetailActions postId={POST_ID} authorId={AUTHOR_ID} />);
    expect(screen.getByRole("link", { name: /edit/i })).toHaveAttribute(
      "href",
      `/posts/${POST_ID}/edit`
    );
  });

  it("renders nothing when the viewer is not the author", () => {
    render(<PostDetailActions postId={POST_ID} authorId="someone_else" />);
    expect(screen.queryByRole("link", { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /delete/i })).not.toBeInTheDocument();
  });

  it("shows confirmation modal when Delete is clicked", () => {
    render(<PostDetailActions postId={POST_ID} authorId={AUTHOR_ID} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    expect(screen.getByText(/Are you sure/i)).toBeInTheDocument();
  });

  it("does not fetch when Cancel is clicked in modal", () => {
    render(<PostDetailActions postId={POST_ID} authorId={AUTHOR_ID} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls DELETE and redirects to / when confirmed", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    render(<PostDetailActions postId={POST_ID} authorId={AUTHOR_ID} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    const buttons = screen.getAllByRole("button", { name: /^delete$/i });
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/posts/${POST_ID}`),
        { method: "DELETE", credentials: "include" }
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("does not redirect when DELETE request fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(<PostDetailActions postId={POST_ID} authorId={AUTHOR_ID} />);
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    const buttons = screen.getAllByRole("button", { name: /^delete$/i });
    fireEvent.click(buttons[buttons.length - 1]);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(mockPush).not.toHaveBeenCalled();
  });
});
