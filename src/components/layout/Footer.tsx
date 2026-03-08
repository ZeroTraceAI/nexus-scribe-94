import { Link } from "react-router-dom";
import CodeSecAILogo from "@/components/CodeSecAILogo";
import { categories } from "@/data/categories";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card mt-20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <CodeSecAILogo className="h-7 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Where Code Meets Security & Intelligence. Deep dives into cybersecurity, AI, cloud computing, blockchain, and programming.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2">
              {categories.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">Free AI Tools</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Articles</Link></li>
              <li><Link to="/subscribe" className="text-sm text-muted-foreground hover:text-primary transition-colors">Newsletter</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {currentYear} CodeSecAI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://twitter.com/codesecai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">Twitter/X</a>
            <a href="https://github.com/codesecai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">GitHub</a>
            <a href="https://linkedin.com/company/codesecai" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
