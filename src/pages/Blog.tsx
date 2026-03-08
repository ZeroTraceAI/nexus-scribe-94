import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { posts } from "@/data/posts";
import { categories } from "@/data/categories";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<"latest" | "popular">("latest");

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter) result = result.filter(p => p.categorySlug === categoryFilter);
    if (sort === "latest") result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    else result.sort((a, b) => b.viewCount - a.viewCount);
    return result;
  }, [search, categoryFilter, sort]);

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground mb-8">Expert articles on cybersecurity, AI, cloud, blockchain, and programming.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setCategoryFilter(null)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${!categoryFilter ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}>All</button>
            {categories.map(c => (
              <button key={c.slug} onClick={() => setCategoryFilter(c.slug)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${categoryFilter === c.slug ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}>{c.name}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setSort("latest")} className={`text-sm font-medium ${sort === "latest" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Latest</button>
          <button onClick={() => setSort("popular")} className={`text-sm font-medium ${sort === "popular" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Most Popular</button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}

        <div className="mt-16">
          <NewsletterForm />
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
