import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "@/app/components/PostForm";

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

const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

const filledInitialValues = {
  title: "My Expense Tracker",
  description: "A budgeting app",
  githubLink: "https://github.com/user/repo",
  demoLink: "https://demo.com",
  tags: ["React", "Node.js"],
  screenshots: ["https://res.cloudinary.com/test/image.png"],
};

describe("PostForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering with empty initial values", () => {
    it("renders all form fields", () => {
      render(<PostForm onSubmit={mockOnSubmit} />);
      expect(screen.getByPlaceholderText(/expense tracker/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/what did you build/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/github.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your-demo/i)).toBeInTheDocument();
    });

    it("renders the default submit label", () => {
      render(<PostForm onSubmit={mockOnSubmit} />);
      expect(screen.getByRole("button", { name: /publish project/i })).toBeInTheDocument();
    });
  });

  describe("rendering with pre-filled initial values", () => {
    it("pre-fills the title field", () => {
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      expect(screen.getByDisplayValue("My Expense Tracker")).toBeInTheDocument();
    });

    it("pre-fills the description field", () => {
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      expect(screen.getByDisplayValue("A budgeting app")).toBeInTheDocument();
    });

    it("pre-fills the github link field", () => {
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      expect(screen.getByDisplayValue("https://github.com/user/repo")).toBeInTheDocument();
    });

    it("pre-fills the demo link field", () => {
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      expect(screen.getByDisplayValue("https://demo.com")).toBeInTheDocument();
    });

    it("pre-fills existing tags as pills", () => {
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });

    it("pre-fills existing screenshots", () => {
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      expect(screen.getByRole("img")).toHaveAttribute(
        "src",
        "https://res.cloudinary.com/test/image.png"
      );
    });

    it("renders a custom submit label", () => {
      render(
        <PostForm
          initialValues={filledInitialValues}
          onSubmit={mockOnSubmit}
          submitLabel="Save Changes"
        />
      );
      expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows error when title is empty on submit", async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);
      await user.click(screen.getByRole("button", { name: /publish project/i }));
      await waitFor(() => {
        expect(screen.getByText("Title is required")).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows error when description is empty on submit", async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);
      await user.type(screen.getByPlaceholderText(/expense tracker/i), "My Project");
      await user.click(screen.getByRole("button", { name: /publish project/i }));
      await waitFor(() => {
        expect(screen.getByText("Description is required")).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe("tag management", () => {
    it("adds a tag when Enter is pressed", async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);
      const tagInput = screen.getByPlaceholderText(/press enter to add/i);
      await user.type(tagInput, "TypeScript{Enter}");
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("removes a tag when × is clicked", async () => {
      const user = userEvent.setup();
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      const removeBtn = screen.getByRole("button", { name: /remove react/i });
      await user.click(removeBtn);
      expect(screen.queryByText("React")).not.toBeInTheDocument();
    });

    it("does not add a duplicate tag", async () => {
      const user = userEvent.setup();
      render(<PostForm initialValues={filledInitialValues} onSubmit={mockOnSubmit} />);
      const tagInput = screen.getByPlaceholderText(/press enter to add/i);
      await user.type(tagInput, "React{Enter}");
      const reactTags = screen.getAllByText("React");
      expect(reactTags).toHaveLength(1);
    });
  });

  describe("form submission", () => {
    it("calls onSubmit with correct values when form is valid", async () => {
      const user = userEvent.setup();
      render(<PostForm onSubmit={mockOnSubmit} />);
      await user.type(screen.getByPlaceholderText(/expense tracker/i), "My Project");
      await user.type(screen.getByPlaceholderText(/what did you build/i), "A cool app");
      await user.click(screen.getByRole("button", { name: /publish project/i }));
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "My Project",
            description: "A cool app",
          })
        );
      });
    });
  });
});
