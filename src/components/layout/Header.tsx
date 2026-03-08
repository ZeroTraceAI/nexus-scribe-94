import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Moon, Sun, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import CodeSecAILogo from "@/components/CodeSecAILogo";
import { categories } from "@/data/categories";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const dark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/tools", label: "Tools" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-sm" : "bg-background/60 backdrop-blur-md"}`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2" aria-label="CodeSecAI Home">
          <CodeSecAILogo className="h-8 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {navLinks.map(link => (
            link.label === "Blog" ? (
              <div key={link.to} className="relative" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
                <Link to={link.to} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1 ${location.pathname.startsWith("/blog") || location.pathname.startsWith("/category") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.label} <ChevronDown className="h-3 w-3" />
                </Link>
                {showCategories && (
                  <div className="absolute top-full left-0 mt-1 w-72 glass rounded-lg shadow-lg p-3 animate-fade-in">
                    {categories.map(cat => (
                      <Link key={cat.slug} to={`/category/${cat.slug}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <span className="text-lg">{cat.icon === "Shield" ? "🛡️" : cat.icon === "Brain" ? "🧠" : cat.icon === "Cloud" ? "☁️" : cat.icon === "Link2" ? "🔗" : "💻"}</span>
                        <div>
                          <div className="text-sm font-medium text-foreground">{cat.name}</div>
                          <div className="text-xs text-muted-foreground">{cat.postCount} articles</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={link.to} to={link.to} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {link.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/search" aria-label="Search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="text-muted-foreground hover:text-foreground">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/subscribe" className="hidden sm:block">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t animate-slide-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`px-3 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname === link.to ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
                {link.label}
              </Link>
            ))}
            <Link to="/subscribe">
              <Button className="w-full mt-2 bg-primary text-primary-foreground">Subscribe</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
