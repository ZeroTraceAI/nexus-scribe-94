import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import NewsletterForm from "@/components/shared/NewsletterForm";
import SEO from "@/components/SEO";
import { posts, getFeaturedPosts, getPopularPosts } from "@/data/posts";
import { categories, getCategoryIcon } from "@/data/categories";

const Index = () => {
  const featured = getFeaturedPosts();
  const popular = getPopularPosts();
  const latest = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 6);

  return (
    <Layout>
      <SEO
        canonical="/"
        includeOrgJsonLd
        breadcrumbs={[{ name: "Home", path: "/" }]}
      />
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container py-20 md:py-28 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-6">
              <Sparkles className="h-3 w-3" /> Where Code Meets Security & Intelligence
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-6 tracking-tight">
              Deep Dives Into<br />
              <span className="text-gradient">Security, AI & Code</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Expert tutorials, analysis, and tools for developers and security professionals navigating cybersecurity, artificial intelligence, cloud, blockchain, and modern programming.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/blog">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  Start Reading <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/tools">
                <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-muted">
                  <Sparkles className="h-4 w-4" /> Explore AI Tools
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Featured Articles</h2>
          <Link to="/blog" className="text-sm text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((post, i) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Topics We Cover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/category/${cat.slug}`} className="block group">
                  <div className="bg-card border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all text-center h-full">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.postCount} articles</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Latest + Popular */}
      <section className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latest.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          </div>
          <aside>
            <h2 className="text-2xl font-bold text-foreground mb-6">Most Popular</h2>
            <div className="space-y-4">
              {popular.map((post, i) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                  <span className="text-3xl font-black text-muted-foreground/30">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">{post.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{post.readingTime} min read · {(post.viewCount / 1000).toFixed(1)}k views</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </aside>
        </div>
      </section>

      {/* Tools CTA */}
      <section className="container py-16">
        <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Free AI-Powered Developer Tools</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Code generators, vulnerability explainers, SEO analyzers, regex testers, and more — all free to use.</p>
          <Link to="/tools">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              Explore Tools <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
