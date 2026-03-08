export interface Author {
  slug: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  expertise: string[];
  social: { twitter?: string; linkedin?: string; github?: string };
}

export const authors: Author[] = [
  {
    slug: "alex-chen",
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
    role: "Security Engineer",
    bio: "Alex is a senior security engineer with 10+ years of experience in penetration testing, vulnerability research, and secure software development. He has contributed to multiple OWASP projects and regularly speaks at DEF CON and Black Hat conferences.",
    expertise: ["Penetration Testing", "Web Security", "Smart Contract Auditing", "Secure Coding"],
    social: { twitter: "https://twitter.com/alexchen", github: "https://github.com/alexchen" },
  },
  {
    slug: "sarah-kim",
    name: "Sarah Kim",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
    role: "AI Engineer",
    bio: "Sarah is an AI/ML engineer specializing in large language models, NLP, and production AI systems. She has built RAG pipelines and fine-tuned models at scale for Fortune 500 companies, and contributes to open-source AI frameworks.",
    expertise: ["Large Language Models", "NLP", "Prompt Engineering", "MLOps"],
    social: { twitter: "https://twitter.com/sarahkim", linkedin: "https://linkedin.com/in/sarahkim" },
  },
  {
    slug: "marcus-johnson",
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
    role: "Cloud Architect",
    bio: "Marcus is a certified cloud architect (AWS, Azure, GCP) with deep expertise in Kubernetes, infrastructure as code, and platform engineering. He helps organizations design scalable, cost-efficient cloud-native architectures.",
    expertise: ["AWS", "Kubernetes", "Terraform", "FinOps", "Platform Engineering"],
    social: { linkedin: "https://linkedin.com/in/marcusjohnson", github: "https://github.com/marcusjohnson" },
  },
  {
    slug: "priya-patel",
    name: "Priya Patel",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
    role: "Blockchain Developer",
    bio: "Priya is a blockchain developer and smart contract auditor with extensive experience in DeFi protocols, Web3 authentication, and Layer 2 scaling solutions. She has audited protocols securing over $500M in TVL.",
    expertise: ["Solidity", "DeFi", "Smart Contract Security", "Web3", "Account Abstraction"],
    social: { twitter: "https://twitter.com/priyapatel", github: "https://github.com/priyapatel" },
  },
];

export const getAuthorBySlug = (slug: string) => authors.find(a => a.slug === slug);
export const getAuthorByName = (name: string) => authors.find(a => a.name === name);
