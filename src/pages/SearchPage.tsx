import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import SEO from "@/components/SEO";
import { posts } from "@/data/posts";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQ);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.categoryName.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold text-foreground mb-6">Search</h1>
        <div className="relative max-w-lg mb-8">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles, tools, topics..." value={query} onChange={e => setQuery(e.target.value)} className="pl-9 text-lg h-12" autoFocus />
        </div>
        {query && (
          <p className="text-sm text-muted-foreground mb-6">{results.length} result{results.length !== 1 ? "s" : ""} for "{query}"</p>
        )}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : query ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-2">No results found for "{query}"</p>
            <p className="text-sm text-muted-foreground">Try a different search term or browse our categories.</p>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};

export default SearchPage;
