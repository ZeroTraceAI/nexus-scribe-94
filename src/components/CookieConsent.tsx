import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "codesecai_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:max-w-md"
        >
          <div className="rounded-xl border border-border bg-card p-5 shadow-lg backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground mb-1">We use cookies</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  We use cookies to enhance your experience, analyze traffic, and personalize content.
                  Read our{" "}
                  <Link to="/cookie-policy" className="text-primary hover:underline">
                    Cookie Policy
                  </Link>{" "}
                  for details.
                </p>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleAccept} className="text-xs h-8 px-4">
                    Accept All
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDecline} className="text-xs h-8 px-4">
                    Decline
                  </Button>
                </div>
              </div>
              <button
                onClick={handleDecline}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cookie banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
