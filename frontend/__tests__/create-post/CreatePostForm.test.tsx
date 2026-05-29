import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreatePostForm from "@/app/create-post/CreatePostForm";

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

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText(/expense tracker/i), "My Project");
  await user.type(screen.getByPlaceholderText(/what did you build/i), "A cool app");
  await user.click(screen.getByRole("button", { name: /publish project/i }));
}

describe("CreatePostForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the PostForm with Publish Project label", () => {
    render(<CreatePostForm />);
    expect(screen.getByRole("button", { name: /publish project/i })).toBeInTheDocument();
  });

  it("renders with no pre-filled values", () => {
    render(<CreatePostForm />);
    expect(screen.getByPlaceholderText(/expense tracker/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/what did you build/i)).toHaveValue("");
  });

  it("calls POST /api/posts with correct payload on submit", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ _id: "abc123" }),
    } as Response);

    render(<CreatePostForm />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/posts"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining("My Project"),
        })
      );
    });
  });

  it("includes authorId in the POST payload", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ _id: "abc123" }),
    } as Response);

    render(<CreatePostForm />);
    await fillAndSubmit();

    await waitFor(() => {
      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body
      );
      expect(body.authorId).toBe("placeholder_author");
    });
  });

  it("redirects to / on successful submit", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ _id: "abc123" }),
    } as Response);

    render(<CreatePostForm />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("shows an error message when the API returns an error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Internal server error" }),
    } as unknown as Response);

    render(<CreatePostForm />);
    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
