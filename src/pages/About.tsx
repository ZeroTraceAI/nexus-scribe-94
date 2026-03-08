import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Brain, Cloud, Code2, Link2, BookOpen, Wrench, Award, Target, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { categories, getCategoryIcon } from "@/data/categories";
import { posts } from "@/data/posts";
import { tools } from "@/data/tools";

const About = () => {
  const totalArticles = posts.length;
  const totalTools = tools.length;

  const timeline = [
    { year: "2024", title: "CodeSecAI Founded", desc: "Started as a personal blog sharing cybersecurity research and AI tutorials." },
    { year: "2024", title: "First 10 Tutorials Published", desc: "Covered SQL injection, smart contract auditing, and RAG systems." },
    { year: "2025", title: "AI Tools Suite Launched", desc: "Released 10 free AI-powered developer tools — code generators, vulnerability explainers, and more." },
    { year: "2025", title: "10,000+ Monthly Readers", desc: "Grew a community of developers and security professionals worldwide." },
    { year: "2026", title: "30+ In-Depth Articles", desc: "Expanded coverage to platform engineering, FinOps, AI agents, and WebAssembly." },
    { year: "2026", title: "Continuous Growth", desc: "Scaling content, tools, and community to become the go-to resource for security-minded developers." },
  ];

  const skills = [
    { name: "Penetration Testing", level: 95 },
    { name: "AI & Machine Learning", level: 90 },
    { name: "Cloud Architecture (AWS/GCP)", level: 88 },
    { name: "Smart Contract Auditing", level: 85 },
    { name: "Full-Stack Development", level: 92 },
    { name: "DevOps & Platform Engineering", level: 82 },
  ];

  const achievements = [
    { icon: BookOpen, value: `${totalArticles}+`, label: "Articles Published" },
    { icon: Wrench, value: `${totalTools}`, label: "Free AI Tools" },
    { icon: Award, value: "10k+", label: "Monthly Readers" },
    { icon: Target, value: "5", label: "Categories Covered" },
  ];

  return (
    <Layout>
      <SEO
        title="About ShadowGod & CodeSecAI — Cybersecurity & AI Education"
        description="Meet ShadowGod — cybersecurity researcher, full-stack developer, and founder of CodeSecAI. Learn about our mission to make security and cutting-edge technology accessible to developers worldwide."
        keywords="about CodeSecAI, ShadowGod, cybersecurity education, AI learning resources, cloud computing tutorials, blockchain education, developer community, security professionals"
        canonical="/about"
        includeOrgJsonLd
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        faqJsonLd={[
          { question: "What is CodeSecAI?", answer: "CodeSecAI is a technical resource providing expert-crafted tutorials, analysis, and free AI-powered tools for developers and security professionals across cybersecurity, AI, cloud computing, blockchain, and software engineering." },
          { question: "Who is ShadowGod?", answer: "ShadowGod is the founder of CodeSecAI — a cybersecurity researcher, full-stack developer, and AI enthusiast with deep expertise in penetration testing, smart contract auditing, cloud architecture, and building production AI systems." },
          { question: "Is CodeSecAI free to use?", answer: "Yes. All articles, tutorials, and AI-powered tools on CodeSecAI are completely free to access and use." },
          { question: "What topics does CodeSecAI cover?", answer: "CodeSecAI covers cybersecurity, artificial intelligence & machine learning, cloud computing & DevOps, blockchain & Web3, and modern programming & software engineering." },
        ]}
      />

      {/* Hero section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
              <div className="relative">
                <img
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=ShadowGod"
                  alt="ShadowGod"
                  width={180}
                  height={180}
                  className="h-44 w-44 rounded-full border-4 border-primary/20 bg-muted shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold shadow-lg">
                  Founder
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-black text-foreground mb-2">ShadowGod</h1>
              <p className="text-primary font-semibold text-lg mb-4">Founder & Security Researcher</p>
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                Cybersecurity researcher, full-stack developer, and AI enthusiast with deep expertise in penetration testing, smart contract auditing, cloud architecture, and building production AI systems. Passionate about making security and cutting-edge technology accessible to developers worldwide.
              </p>
              <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                {["Cybersecurity", "AI & ML", "Cloud Architecture", "Blockchain", "Full-Stack Dev"].map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border rounded-xl p-5 text-center shadow-sm"
            >
              <stat.icon className="h-5 w-5 mx-auto text-primary mb-2" />
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="container py-16 max-w-4xl mx-auto">
        {/* Mission */}
        <section className="mb-16">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              CodeSecAI exists to bridge the knowledge gap between rapidly evolving technology and the developers who build with it. We provide expert-crafted, deeply technical content across cybersecurity, artificial intelligence, cloud computing, blockchain, and software engineering.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every article undergoes rigorous technical review. We don't do surface-level overviews — we write the content we wish existed when we were learning these technologies ourselves. Our free AI-powered tools complement written content, giving developers hands-on experience.
            </p>
          </motion.div>
        </section>

        {/* Skills */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Technical Expertise</h2>
          <div className="space-y-4">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  <span className="text-xs text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Journey & Milestones</h2>
          <div className="relative border-l-2 border-primary/20 ml-4 space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary border-2 border-background" />
                <span className="text-xs font-bold text-primary">{item.year}</span>
                <h3 className="text-sm font-bold text-foreground mt-0.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* What We Cover */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">What We Cover</h2>
          <div className="space-y-4">
            {categories.map((cat, i) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={`/category/${cat.slug}`} className="flex items-start gap-4 bg-card border rounded-lg p-5 hover:border-primary/30 hover:shadow-sm transition-all group">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Education First", desc: "Every piece of content teaches something actionable. No fluff, no filler.", icon: "📚" },
              { title: "Security-First Thinking", desc: "Security isn't an afterthought — it's the foundation of everything we write about.", icon: "🛡️" },
              { title: "Open Knowledge", desc: "Great technical content should be accessible to everyone, regardless of background.", icon: "🌐" },
              { title: "Innovation", desc: "We stay on the cutting edge, covering emerging technologies before they go mainstream.", icon: "🚀" },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border rounded-lg p-5"
              >
                <span className="text-2xl mb-2 block">{v.icon}</span>
                <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">Built With Modern Technology</h2>
          <p className="text-sm text-muted-foreground mb-4">CodeSecAI is built with the same technologies we write about.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion", "shadcn/ui"].map(tech => (
              <span key={tech} className="text-xs font-medium bg-card border rounded-full px-3 py-1 text-foreground">{tech}</span>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
