import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SEO from "../components/SEO";

describe("SEO Component", () => {
  it("renders default title when no title prop provided", () => {
    render(<SEO />);
    expect(document.title).toContain("CodeSecAI");
  });

  it("renders custom title when title prop is provided", () => {
    render(<SEO title="Test Page" />);
    expect(document.title).toBe("Test Page | CodeSecAI");
  });

  it("renders description meta tag", () => {
    const description = "Test description";
    render(<SEO description={description} />);
    
    const metaDescription = document.querySelector('meta[name="description"]');
    expect(metaDescription).toHaveAttribute("content", description);
  });

  it("renders keywords meta tag when provided", () => {
    const keywords = "test, keywords, seo";
    render(<SEO keywords={keywords} />);
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    expect(metaKeywords).toHaveAttribute("content", keywords);
  });

  it("includes canonical link when provided", () => {
    const canonical = "/test-page";
    render(<SEO canonical={canonical} />);
    
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    expect(canonicalLink).toHaveAttribute("href", `https://codesecai.com${canonical}`);
  });

  it("includes Open Graph meta tags", () => {
    render(<SEO title="OG Test" description="OG Description" />);
    
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "OG Test | CodeSecAI"
    );
    expect(document.querySelector('meta[property="og:description"]')).toHaveAttribute(
      "content",
      "OG Description"
    );
    expect(document.querySelector('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "website"
    );
  });

  it("includes Twitter Card meta tags", () => {
    render(<SEO title="Twitter Test" />);
    
    expect(document.querySelector('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
    expect(document.querySelector('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      "Twitter Test | CodeSecAI"
    );
  });

  it("includes noindex robots meta when noindex is true", () => {
    render(<SEO noindex={true} />);
    
    const robotsMeta = document.querySelector('meta[name="robots"]');
    expect(robotsMeta).toHaveAttribute("content", "noindex,nofollow");
  });

  it("includes JSON-LD structured data for organization when includeOrgJsonLd is true", () => {
    render(<SEO includeOrgJsonLd={true} />);
    
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    expect(jsonLdScript).toBeInTheDocument();
    
    if (jsonLdScript) {
      const content = JSON.parse(jsonLdScript.textContent || "{}");
      expect(content["@context"]).toBe("https://schema.org");
    }
  });
});
