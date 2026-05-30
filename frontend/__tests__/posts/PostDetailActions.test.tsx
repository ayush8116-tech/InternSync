import { render, screen, fireEvent, waitFor } from "@testing-library/react";

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

const POST_ID = "507f1f77bcf86cd799439011";

async function renderActions(postId = POST_ID) {
  const { default: PostDetailActions } = await import(
    "@/app/posts/[id]/PostDetailActions"
  );
  return render(<PostDetailActions postId={postId} />);
}

describe("PostDetailActions", () => {
  beforeEach(() => {
    jest.resetModules();
    mockPush.mockClear();
    global.fetch = jest.fn();
    window.confirm = jest.fn();
  });

  it("renders Edit link and Delete button", async () => {
    await renderActions();
    expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("Edit link points to /posts/[id]/edit", async () => {
    await renderActions();
    expect(screen.getByRole("link", { name: /edit/i })).toHaveAttribute(
      "href",
      `/posts/${POST_ID}/edit`
    );
  });

  it("calls window.confirm when Delete is clicked", async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    await renderActions();
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this post? This cannot be undone."
    );
  });

  it("does not fetch when confirmation is cancelled", async () => {
    (window.confirm as jest.Mock).mockReturnValue(false);
    await renderActions();
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls DELETE and redirects to / on confirmation", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    await renderActions();
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/posts/${POST_ID}`),
        { method: "DELETE" }
      );
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("does not redirect when DELETE request fails", async () => {
    (window.confirm as jest.Mock).mockReturnValue(true);
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await renderActions();
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
