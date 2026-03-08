import Layout from "@/components/layout/Layout";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { CheckCircle2 } from "lucide-react";

const Subscribe = () => (
  <Layout>
    <div className="container py-16 max-w-xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Stay Ahead of the Curve</h1>
      <p className="text-muted-foreground mb-8">Get weekly deep dives on cybersecurity, AI, cloud computing, blockchain, and programming — delivered free to your inbox.</p>

      <div className="text-left space-y-3 mb-8">
        {[
          "Weekly curated digest of the best articles",
          "Early access to new free AI tools",
          "Exclusive content not published on the blog",
          "No spam — unsubscribe with one click anytime",
        ].map(benefit => (
          <div key={benefit} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
            <span className="text-sm text-foreground">{benefit}</span>
          </div>
        ))}
      </div>

      <NewsletterForm variant="hero" />

      <p className="text-xs text-muted-foreground mt-6">
        Join 10,000+ developers and security professionals. We respect your privacy — read our{" "}
        <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </div>
  </Layout>
);

export default Subscribe;
