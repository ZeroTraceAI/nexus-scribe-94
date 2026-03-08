import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import SEO from "@/components/SEO";
import { categories, getCategoryIcon } from "@/data/categories";
import { getPostsByCategory } from "@/data/posts";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find(c => c.slug === slug);
  const catPosts = getPostsByCategory(slug || "");

  if (!category) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Category Not Found</h1>
          <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
      </Layout>
    );
  }

  const Icon = getCategoryIcon(category.icon);

  return (
    <Layout>
      <SEO
        title={category.name}
        description={category.description}
        canonical={`/category/${category.slug}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: category.name, path: `/category/${category.slug}` },
        ]}
      />
      <section className="hero-gradient">
        <div className="container py-16 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/10 text-primary mb-4">
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{category.name}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-2">{category.description}</p>
          <p className="text-sm text-primary font-medium">{category.postCount} articles</p>
        </div>
      </section>
      <div className="container py-12">
        {catPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No articles in this category yet. Check back soon!</p>
        )}
      </div>
    </Layout>
  );
};

export default Category;
