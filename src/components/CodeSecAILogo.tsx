const CodeSecAILogo = ({ className = "h-8 w-auto" }: { className?: string }) => (
  <svg viewBox="0 0 200 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8L2 20L8 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
    <path d="M28 8L34 20L28 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
    <path d="M22 6L14 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-secondary" />
    <path d="M18 12L18 6L24 9L18 12Z" fill="currentColor" className="text-secondary" opacity="0.5" />
    <circle cx="10" cy="20" r="1.5" fill="currentColor" className="text-primary" opacity="0.6" />
    <circle cx="26" cy="20" r="1.5" fill="currentColor" className="text-primary" opacity="0.6" />
    <circle cx="18" cy="14" r="1" fill="currentColor" className="text-secondary" opacity="0.8" />
    <line x1="11" y1="19.5" x2="17" y2="14.5" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" opacity="0.3" />
    <line x1="25" y1="19.5" x2="19" y2="14.5" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" opacity="0.3" />
    <text x="42" y="27" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="18" fill="currentColor" className="text-foreground">
      Code<tspan className="text-primary" fill="hsl(217, 91%, 60%)">Sec</tspan><tspan className="text-secondary" fill="hsl(160, 84%, 39%)">AI</tspan>
    </text>
  </svg>
);

export default CodeSecAILogo;
