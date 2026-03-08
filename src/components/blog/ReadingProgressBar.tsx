import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const ReadingProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      const article = document.querySelector("article");
      if (!article) return;
      const words = article.textContent?.split(/\s+/).length || 0;
      const wordsPerMinute = 220;
      const totalMin = words / wordsPerMinute;
      const remaining = Math.max(0, Math.ceil(totalMin * (1 - progress)));
      setTimeLeft(remaining <= 0 ? "Done reading" : `${remaining} min left`);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-16 left-0 right-0 z-40">
      <motion.div
        className="h-0.5 bg-primary origin-left"
        style={{ scaleX }}
      />
      <div className="absolute right-4 top-1.5">
        <span className="text-[10px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full border">
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default ReadingProgressBar;
