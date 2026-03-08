import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Wrench, Users, TrendingUp, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import NewsletterForm from "@/components/shared/NewsletterForm";
import SEO from "@/components/SEO";
import { posts, getFeaturedPosts, getPopularPosts } from "@/data/posts";
import { categories, getCategoryIcon } from "@/data/categories";
import { tools } from "@/data/tools";

const Index = () => {
  const featured = getFeaturedPosts();
  const popular = getPopularPosts();
  const latest = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 6);

  // Stats
  const totalArticles = posts.length;
  const totalViews = posts.reduce((sum, p) => sum + p.viewCount, 0);
  const totalReadingTime = posts.reduce((sum, p) => sum + p.readingTime, 0);
  const totalTools = tools.length;

  // Trending tags
  const tagCounts: Record<string, number> = {};
  posts.forEach(p => p.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; }));
  const trendingTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([tag]) => tag);

  const stats = [
    { icon: BookOpen, label: "Articles Published", value: totalArticles, suffix: "+" },
    { icon: Eye, label: "Total Reads", value: `${(totalViews / 1000).toFixed(0)}k`, suffix: "+" },
    { icon: Clock, label: "Hours of Content", value: Math.round(totalReadingTime / 60), suffix: "+" },
    { icon: Wrench, label: "Free AI Tools", value: totalTools, suffix: "" },
  ];

  return (
    <Layout>
      <SEO
        title="Cybersecurity, AI & Programming Tutorials"
        description="Learn cybersecurity, artificial intelligence, cloud computing, blockchain, and programming with expert tutorials, in-depth guides, and free AI-powered developer tools. Updated daily."
        keywords="cybersecurity tutorials, AI programming, cloud computing guides, blockchain development, secure coding, penetration testing, machine learning, DevOps, web security, coding best practices, free developer tools"
        canonical="/"
        includeOrgJsonLd
        breadcrumbs={[{ name: "Home", path: "/" }]}
        faqJsonLd={[
          { question: "What is CodeSecAI?", answer: "CodeSecAI is a free resource providing expert tutorials, analysis, and AI-powered tools for developers and security professionals covering cybersecurity, AI, cloud computing, blockchain, and programming." },
          { question: "Are CodeSecAI tools free?", answer: "Yes, all AI-powered developer tools on CodeSecAI are completely free with no signup required — including code generators, vulnerability explainers, SEO analyzers, and more." },
          { question: "What topics does CodeSecAI cover?", answer: "CodeSecAI covers cybersecurity (penetration testing, secure coding, vulnerability analysis), artificial intelligence (machine learning, LLMs, RAG systems), cloud computing (AWS, Kubernetes, DevOps), blockchain (smart contracts, Web3), and modern programming (Rust, Go, TypeScript)." },
        ]}
      />

      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container py-20 md:py-28 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-6">
              <Sparkles className="h-3 w-3" /> Where Code Meets Security & Intelligence
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground leading-tight mb-6 tracking-tight">
              Cybersecurity, AI &<br />
              <span className="text-gradient">Programming Tutorials</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Expert tutorials on cybersecurity, artificial intelligence, cloud computing, blockchain, and modern programming. Free AI-powered developer tools included.
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

      {/* Live Stats */}
      <section className="container -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border rounded-xl p-5 text-center shadow-sm"
            >
              <stat.icon className="h-5 w-5 mx-auto text-primary mb-2" />
              <div className="text-2xl md:text-3xl font-black text-foreground">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
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
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
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

      {/* Trending Tags */}
      <section className="container py-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Trending Topics</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map(tag => (
            <Link
              key={tag}
              to={`/search?q=${tag}`}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
            >
              #{tag}
            </Link>
          ))}
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
