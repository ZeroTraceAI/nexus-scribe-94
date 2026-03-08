import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, ThumbsUp, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { getPostBySlug, getRelatedPosts } from "@/data/posts";
import { toast } from "@/hooks/use-toast";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
          <Link to="/blog"><Button variant="outline">Back to Blog</Button></Link>
        </div>
      </Layout>
    );
  }

  const related = getRelatedPosts(post);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({ title: "Link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-foreground mt-6 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith("```")) {
        return null; // simplified — code blocks handled below
      }
      if (line.trim() === "") return <br key={i} />;
      if (line.startsWith("- ")) return <li key={i} className="text-muted-foreground ml-4 list-disc">{line.slice(2)}</li>;
      return <p key={i} className="text-muted-foreground leading-relaxed mb-3">{line}</p>;
    });
  };

  // Extract code blocks
  const contentWithCode = post.content.split(/(```[\s\S]*?```)/g).map((block, i) => {
    if (block.startsWith("```")) {
      const lines = block.split("\n");
      const lang = lines[0].slice(3).trim();
      const code = lines.slice(1, -1).join("\n");
      return (
        <div key={i} className="relative group my-6">
          <div className="flex items-center justify-between bg-muted/80 px-4 py-2 rounded-t-lg border border-b-0">
            <span className="text-xs font-mono text-muted-foreground">{lang || "code"}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(code); toast({ title: "Code copied!" }); }}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
          </div>
          <pre className="bg-muted/50 p-4 rounded-b-lg border overflow-x-auto">
            <code className="text-sm font-mono text-foreground">{code}</code>
          </pre>
        </div>
      );
    }
    return <div key={i}>{renderContent(block)}</div>;
  });

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="container py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary">Blog</Link>
          <span>/</span>
          <Link to={`/category/${post.categorySlug}`} className="hover:text-primary">{post.categoryName}</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{post.title}</span>
        </nav>
      </div>

      <article className="container pb-16">
        <div className="max-w-3xl mx-auto">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to articles
          </Link>

          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
            {post.categoryName}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <img src={post.author.avatar} alt={post.author.name} className="h-8 w-8 rounded-full" />
              <div>
                <p className="font-medium text-foreground text-sm">{post.author.name}</p>
                <p className="text-xs">{post.author.role}</p>
              </div>
            </div>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readingTime} min read</span>
            <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.viewCount.toLocaleString()} views</span>
          </div>

          <img src={post.featuredImage} alt={post.title} className="w-full rounded-lg mb-8 aspect-video object-cover" />

          <div className="prose-custom">
            {contentWithCode}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map(tag => (
              <Link key={tag} to={`/tag/${tag}`} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                #{tag}
              </Link>
            ))}
          </div>

          {/* Share */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t">
            <span className="text-sm font-medium text-foreground">Share:</span>
            <Button variant="outline" size="sm" onClick={() => handleShare("twitter")}>Twitter</Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("linkedin")}>LinkedIn</Button>
            <Button variant="outline" size="sm" onClick={() => handleShare("reddit")}>Reddit</Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-1">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy Link"}
            </Button>
          </div>

          {/* Newsletter */}
          <div className="mt-12">
            <NewsletterForm />
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map(p => <PostCard key={p.id} post={p} />)}
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
