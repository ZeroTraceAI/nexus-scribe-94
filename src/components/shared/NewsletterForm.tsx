import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const NewsletterForm = ({ variant = "default" }: { variant?: "default" | "inline" | "hero" }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast({ title: "Subscribed! 🎉", description: "Welcome to CodeSecAI. Check your inbox for a confirmation email." });
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-card/50 border-border/50 backdrop-blur" required />
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
          {loading ? "Subscribing..." : "Subscribe Free"}
        </Button>
      </form>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border rounded-lg p-6">
      <h3 className="font-bold text-foreground mb-1">Get weekly deep dives delivered free</h3>
      <p className="text-sm text-muted-foreground mb-4">Join 10,000+ developers getting insights on Security, AI, Cloud & more.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
          {loading ? "..." : "Subscribe"}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-2">No spam. Unsubscribe anytime.</p>
    </div>
  );
};

export default NewsletterForm;
