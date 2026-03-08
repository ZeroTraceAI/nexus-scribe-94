import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import NewsletterForm from "@/components/shared/NewsletterForm";
import SEO from "@/components/SEO";
import { posts } from "@/data/posts";
import { categories } from "@/data/categories";

const POSTS_PER_PAGE = 9;

const Blog = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<"latest" | "popular">("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) result = result.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase()));
    if (categoryFilter) result = result.filter(p => p.categorySlug === categoryFilter);
    if (sort === "latest") result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    else result.sort((a, b) => b.viewCount - a.viewCount);
    return result;
  }, [search, categoryFilter, sort]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginatedPosts = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const handleFilterChange = (cat: string | null) => { setCategoryFilter(cat); setCurrentPage(1); };
  const handleSearchChange = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleSortChange = (s: "latest" | "popular") => { setSort(s); setCurrentPage(1); };

  return (
    <Layout>
      <SEO title="Blog" description="Expert articles on cybersecurity, AI, cloud computing, blockchain, and programming." canonical="/blog" />
      <div className="container py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground mb-8">Expert articles on cybersecurity, AI, cloud, blockchain, and programming.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search articles..." value={search} onChange={e => handleSearchChange(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => handleFilterChange(null)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${!categoryFilter ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}>All</button>
            {categories.map(c => (
              <button key={c.slug} onClick={() => handleFilterChange(c.slug)} className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${categoryFilter === c.slug ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground border-border hover:border-primary/50"}`}>{c.name}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => handleSortChange("latest")} className={`text-sm font-medium ${sort === "latest" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Latest</button>
          <button onClick={() => handleSortChange("popular")} className={`text-sm font-medium ${sort === "popular" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>Most Popular</button>
        </div>

        {paginatedPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map(post => <PostCard key={post.id} post={post} />)}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:pointer-events-none transition-colors">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`h-9 w-9 text-sm rounded-md border transition-colors ${page === currentPage ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/50"}`}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 text-sm rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:pointer-events-none transition-colors">Next</button>
              </div>
            )}
          </>
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
