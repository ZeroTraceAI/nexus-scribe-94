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
    slug: "shadowgod",
    name: "ShadowGod",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=ShadowGod",
    role: "Founder & Security Researcher",
    bio: "ShadowGod is the founder of CodeSecAI — a cybersecurity researcher, full-stack developer, and AI enthusiast with deep expertise in penetration testing, smart contract auditing, cloud architecture, and building production AI systems. Passionate about making security and cutting-edge technology accessible to developers worldwide.",
    expertise: ["Cybersecurity", "AI & Machine Learning", "Cloud Architecture", "Blockchain Security", "Full-Stack Development"],
    social: {},
  },
];

export const getAuthorBySlug = (slug: string) => authors.find(a => a.slug === slug);
export const getAuthorByName = (name: string) => authors.find(a => a.name === name);
