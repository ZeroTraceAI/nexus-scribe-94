import { useParams, Link } from "react-router-dom";
import { Github, Linkedin, Twitter } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import SEO from "@/components/SEO";
import { getAuthorBySlug } from "@/data/authors";
import { posts } from "@/data/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AuthorPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const author = getAuthorBySlug(slug || "");
  const authorPosts = author ? posts.filter(p => p.author.name === author.name) : [];

  if (!author) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Author Not Found</h1>
          <Link to="/blog"><Button variant="outline">Back to Blog</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${author.name} — ${author.role} | CodeSecAI`}
        description={author.bio}
        canonical={`/author/${author.slug}`}
        ogImage={author.avatar}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: author.name, path: `/author/${author.slug}` },
        ]}
      />

      <section className="hero-gradient">
        <div className="container py-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-3xl mx-auto">
            <img
              src={author.avatar}
              alt={author.name}
              width={120}
              height={120}
              className="h-28 w-28 rounded-full border-4 border-primary/20 bg-muted"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-1">{author.name}</h1>
              <p className="text-primary font-medium mb-3">{author.role}</p>
              <p className="text-muted-foreground leading-relaxed mb-4">{author.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4 justify-center sm:justify-start">
                {author.expertise.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
              <div className="flex gap-3 justify-center sm:justify-start">
                {author.social.twitter && (
                  <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {author.social.linkedin && (
                  <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {author.social.github && (
                  <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Articles by {author.name}
        </h2>
        <p className="text-muted-foreground mb-8">{authorPosts.length} article{authorPosts.length !== 1 ? "s" : ""} published</p>

        {authorPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No articles yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default AuthorPage;
