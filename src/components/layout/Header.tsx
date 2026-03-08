import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Moon, Sun, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import CodeSecAILogo from "@/components/CodeSecAILogo";
import { categories, getCategoryIcon } from "@/data/categories";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [mobileCategories, setMobileCategories] = useState(false);
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

  useEffect(() => { setIsOpen(false); setMobileCategories(false); }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {navLinks.map(link => (
            link.label === "Blog" ? (
              <div key={link.to} className="relative" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
                <Link to={link.to} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors inline-flex items-center gap-1 ${location.pathname.startsWith("/blog") || location.pathname.startsWith("/category") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.label} <ChevronDown className="h-3 w-3" />
                </Link>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-72 glass rounded-lg shadow-lg p-3"
                    >
                      {categories.map(cat => {
                        const Icon = getCategoryIcon(cat.icon);
                        return (
                          <Link key={cat.slug} to={`/category/${cat.slug}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">{cat.name}</div>
                              <div className="text-xs text-muted-foreground">{cat.postCount} articles</div>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link key={link.to} to={link.to} className={`relative px-3 py-2 text-sm font-medium rounded-md transition-colors ${location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {link.label}
                {location.pathname === link.to && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            )
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link to="/search" aria-label="Search">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {/* Animated theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="relative text-muted-foreground hover:text-foreground overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Sun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Moon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          <Link to="/subscribe" className="hidden sm:block">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Subscribe</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {link.label === "Blog" ? (
                    <div>
                      <div className="flex items-center justify-between">
                        <Link to={link.to} className={`flex-1 px-3 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname.startsWith("/blog") ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
                          {link.label}
                        </Link>
                        <button
                          onClick={() => setMobileCategories(!mobileCategories)}
                          className="p-3 text-muted-foreground hover:text-foreground"
                          aria-label="Toggle categories"
                        >
                          <motion.div animate={{ rotate: mobileCategories ? 90 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </button>
                      </div>
                      <AnimatePresence>
                        {mobileCategories && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pb-2 space-y-1">
                              {categories.map(cat => {
                                const Icon = getCategoryIcon(cat.icon);
                                return (
                                  <Link
                                    key={cat.slug}
                                    to={`/category/${cat.slug}`}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-muted transition-colors"
                                  >
                                    <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                                      <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-sm text-foreground">{cat.name}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">{cat.postCount}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link to={link.to} className={`block px-3 py-3 text-sm font-medium rounded-md transition-colors ${location.pathname === link.to ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-foreground"}`}>
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <Link to="/subscribe" className="flex-1">
                    <Button className="w-full bg-primary text-primary-foreground">Subscribe</Button>
                  </Link>
                  <Link to="/search" className="flex-1">
                    <Button variant="outline" className="w-full gap-2 border-border">
                      <Search className="h-4 w-4" /> Search
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
