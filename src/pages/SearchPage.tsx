import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, Filter, X, Calendar, Tag, Folder } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import SEO from "@/components/SEO";
import { posts } from "@/data/posts";
import { categories } from "@/data/categories";

const allTags = [...new Set(posts.flatMap(p => p.tags))].sort();

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<"all" | "week" | "month" | "year">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Keyboard shortcut: Ctrl+K / Cmd+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setDateRange("all");
  };

  const hasFilters = selectedCategory || selectedTags.length > 0 || dateRange !== "all";

  const results = useMemo(() => {
    if (!query.trim() && !hasFilters) return [];
    let filtered = [...posts];

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q)) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categorySlug === selectedCategory);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => selectedTags.some(t => p.tags.includes(t)));
    }

    if (dateRange !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (dateRange === "week") cutoff.setDate(now.getDate() - 7);
      if (dateRange === "month") cutoff.setMonth(now.getMonth() - 1);
      if (dateRange === "year") cutoff.setFullYear(now.getFullYear() - 1);
      filtered = filtered.filter(p => new Date(p.publishedAt) >= cutoff);
    }

    return filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [query, selectedCategory, selectedTags, dateRange, hasFilters]);

  return (
    <Layout>
      <SEO title="Search" description="Search CodeSecAI articles, tools, and tutorials." canonical="/search" noindex />
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Search</h1>

        {/* Search input */}
        <div className="relative max-w-2xl mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search-input"
            placeholder="Search articles, tools, topics... (Ctrl+K)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="pl-9 pr-20 text-lg h-12"
            autoFocus
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 items-center gap-1 rounded border bg-muted px-2 text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        {/* Filter toggle */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-1.5"
          >
            <Filter className="h-3.5 w-3.5" /> Filters
            {hasFilters && <span className="bg-primary-foreground text-primary text-[10px] rounded-full h-4 w-4 flex items-center justify-center">{(selectedCategory ? 1 : 0) + selectedTags.length + (dateRange !== "all" ? 1 : 0)}</span>}
          </Button>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground gap-1">
              <X className="h-3 w-3" /> Clear filters
            </Button>
          )}
          {(query || hasFilters) && (
            <span className="text-sm text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-card border rounded-lg p-5 mb-8 space-y-5 animate-fade-in">
            {/* Category filter */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Folder className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}
                >
                  All
                </button>
                {categories.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(c.slug === selectedCategory ? null : c.slug)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${selectedCategory === c.slug ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Date filter */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date Range</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {([["all", "All Time"], ["week", "Past Week"], ["month", "Past Month"], ["year", "Past Year"]] as const).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setDateRange(value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${dateRange === value ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag filter */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Tag className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${selectedTags.includes(tag) ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (query || hasFilters) ? (
          <div className="text-center py-16">
            <SearchIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No results found</p>
            <p className="text-sm text-muted-foreground">Try different keywords or adjust your filters.</p>
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Start typing to search articles, or use filters to browse.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
