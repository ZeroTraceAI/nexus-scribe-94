import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";

const NotFound = () => (
  <Layout>
    <SEO title="Page Not Found" description="The page you're looking for doesn't exist or has been moved." noindex />
    <div className="container py-20 text-center">
      <h1 className="text-8xl font-black text-primary/20 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-3 justify-center">
        <Link to="/"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Go Home</Button></Link>
        <Link to="/blog"><Button variant="outline">Browse Articles</Button></Link>
      </div>
    </div>
  </Layout>
);

export default NotFound;
