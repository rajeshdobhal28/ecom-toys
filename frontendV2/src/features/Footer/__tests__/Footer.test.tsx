import { render, screen } from "@testing-library/react";
import Footer from "../Footer";

// Mock next/link to render a plain <a> tag
jest.mock("next/link", () => {
  return ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  );
});

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it("renders the brand name", () => {
    expect(screen.getByText("Wonder")).toBeInTheDocument();
    expect(screen.getByText("Toys")).toBeInTheDocument();
  });

  it("renders the tagline", () => {
    expect(
      screen.getByText(/bringing smiles to families/i)
    ).toBeInTheDocument();
  });

  // --- Shop column ---
  it("renders Shop heading", () => {
    expect(screen.getByText("Shop")).toBeInTheDocument();
  });

  it("renders shop links", () => {
    expect(screen.getByText("All Toys")).toBeInTheDocument();
    expect(screen.getByText("Educational")).toBeInTheDocument();
    expect(screen.getByText("Outdoor")).toBeInTheDocument();
    expect(screen.getByText("Soft Toys")).toBeInTheDocument();
  });

  it("shop links point to /products", () => {
    const allToysLink = screen.getByText("All Toys").closest("a");
    expect(allToysLink).toHaveAttribute("href", "/products");
  });

  // --- Support column ---
  it("renders Support heading", () => {
    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("renders support links", () => {
    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByText("Shipping & Returns")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
  });

  // --- Stay Connected column ---
  it("renders Stay Connected heading", () => {
    expect(screen.getByText("Stay Connected")).toBeInTheDocument();
  });

  it("renders newsletter text", () => {
    expect(
      screen.getByText(/exclusive offers/i)
    ).toBeInTheDocument();
  });

  it("renders social icons", () => {
    expect(screen.getByText("IG")).toBeInTheDocument();
    expect(screen.getByText("FB")).toBeInTheDocument();
    expect(screen.getByText("TW")).toBeInTheDocument();
  });

  // --- Copyright ---
  it("renders the copyright with current year", () => {
    const year = new Date().getFullYear().toString();
    expect(
      screen.getByText(new RegExp(`© ${year} WonderToys Inc`))
    ).toBeInTheDocument();
  });
});
