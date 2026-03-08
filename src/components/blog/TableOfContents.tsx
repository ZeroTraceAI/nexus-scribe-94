import { forwardRef, useEffect, useState } from "react";
import { List } from "lucide-react";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      headings.push({ id: slugify(text), text, level: 3 });
    } else if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      headings.push({ id: slugify(text), text, level: 2 });
    }
  }
  return headings;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface TableOfContentsProps {
  headings: TocHeading[];
}

const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(({ headings }, ref) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav ref={ref} className="sticky top-24">
      <div className="flex items-center gap-2 mb-3">
        <List className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          On this page
        </span>
      </div>
      <ul className="space-y-1 border-l border-border">
        {headings.map(({ id, text, level }) => (
          <li key={id}>
            <button
              onClick={() => handleClick(id)}
              className={`block w-full text-left text-sm leading-snug py-1.5 transition-colors border-l-2 -ml-px ${
                level === 3 ? "pl-6" : "pl-4"
              } ${
                activeId === id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
              }`}
            >
              {text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
});

TableOfContents.displayName = "TableOfContents";

export default TableOfContents;
