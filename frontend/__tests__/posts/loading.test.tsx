import { render, screen } from "@testing-library/react";
import Loading from "@/app/posts/[id]/loading";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("Post detail Loading skeleton", () => {
  it("renders without crashing", () => {
    expect(() => render(<Loading />)).not.toThrow();
  });

  it("renders a back link to the home feed", () => {
    render(<Loading />);
    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toHaveAttribute("href", "/");
  });

  it("renders skeleton elements with animate-pulse", () => {
    const { container } = render(<Loading />);
    const pulseElements = container.querySelectorAll(".animate-pulse");
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it("renders a skeleton for the post title area", () => {
    const { container } = render(<Loading />);
    // Title skeleton should be a wide prominent block
    const skeletonBlocks = container.querySelectorAll(".animate-pulse .bg-gray-200, .animate-pulse .bg-gray-100");
    expect(skeletonBlocks.length).toBeGreaterThan(2);
  });

  it("renders a skeleton for the description area", () => {
    const { container } = render(<Loading />);
    // Description area should have multiple skeleton lines
    const skeletonLines = container.querySelectorAll(".rounded");
    expect(skeletonLines.length).toBeGreaterThan(3);
  });
});
