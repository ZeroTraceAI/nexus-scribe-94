import { Shield, Brain, Cloud, Link2, Code2, LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  postCount: number;
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Cyber Security",
    slug: "cyber-security",
    description: "Stay ahead of threats. Deep dives into penetration testing, malware analysis, zero-day vulnerabilities, SOC operations, threat intelligence, OWASP, and defensive security strategies.",
    icon: "Shield",
    color: "destructive",
    postCount: 24,
  },
  {
    id: "2",
    name: "Artificial Intelligence",
    slug: "artificial-intelligence",
    description: "Explore machine learning, deep learning, NLP, computer vision, generative AI, LLMs, prompt engineering, AI ethics, and real-world AI applications transforming industries.",
    icon: "Brain",
    color: "primary",
    postCount: 31,
  },
  {
    id: "3",
    name: "Cloud Computing",
    slug: "cloud-computing",
    description: "Master AWS, Azure, GCP, multi-cloud architectures, serverless, Kubernetes, Docker, IaC (Terraform), cloud security, cost optimization, and cloud-native development.",
    icon: "Cloud",
    color: "secondary",
    postCount: 19,
  },
  {
    id: "4",
    name: "Blockchain & Web3",
    slug: "blockchain",
    description: "Understand blockchain fundamentals, smart contracts, DeFi, NFTs, Web3 development, Solidity, consensus mechanisms, tokenomics, and decentralized application architecture.",
    icon: "Link2",
    color: "accent",
    postCount: 15,
  },
  {
    id: "5",
    name: "Programming",
    slug: "programming",
    description: "Level up with tutorials on Python, JavaScript, TypeScript, Rust, Go, system design, data structures, algorithms, clean code practices, and software engineering principles.",
    icon: "Code2",
    color: "primary",
    postCount: 28,
  },
];

export const getCategoryIcon = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = { Shield, Brain, Cloud, Link2, Code2 };
  return icons[iconName] || Code2;
};
