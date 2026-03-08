import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { categories } from "@/data/categories";
import { getCategoryIcon } from "@/data/categories";

const About = () => (
  <Layout>
    <SEO
      title="About"
      description="Learn about CodeSecAI — our mission to bridge the knowledge gap in cybersecurity, AI, cloud computing, blockchain, and programming."
      canonical="/about"
      includeOrgJsonLd
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]}
      faqJsonLd={[
        { question: "What is CodeSecAI?", answer: "CodeSecAI is a technical resource providing expert-crafted tutorials, analysis, and free AI-powered tools for developers and security professionals across cybersecurity, AI, cloud computing, blockchain, and software engineering." },
        { question: "Is CodeSecAI free to use?", answer: "Yes. All articles, tutorials, and AI-powered tools on CodeSecAI are completely free to access and use." },
        { question: "What topics does CodeSecAI cover?", answer: "CodeSecAI covers cybersecurity, artificial intelligence & machine learning, cloud computing & DevOps, blockchain & Web3, and modern programming & software engineering." },
        { question: "Who writes the content on CodeSecAI?", answer: "Our content is written by experienced developers and security professionals. Every article undergoes rigorous technical review to ensure accuracy and depth." },
        { question: "What AI tools does CodeSecAI offer?", answer: "CodeSecAI offers free AI-powered tools for security analysis, code generation, cloud architecture planning, and more — designed to give developers hands-on experience with modern technologies." },
      ]}
    />
    <section className="hero-gradient">
      <div className="container py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">About CodeSecAI</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Where Code Meets Security & Intelligence</p>
      </div>
    </section>
    <div className="container py-12 max-w-3xl mx-auto">
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          CodeSecAI exists to bridge the knowledge gap between rapidly evolving technology and the developers who build with it. We provide expert-crafted, deeply technical content across cybersecurity, artificial intelligence, cloud computing, blockchain, and software engineering.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Every article we publish undergoes rigorous technical review. We don't do surface-level overviews — we write the content we wish existed when we were learning these technologies ourselves.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">Why We Built CodeSecAI</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The intersection of security and AI is reshaping every industry. Developers need a trusted resource that goes beyond tutorials — one that teaches the "why" behind the "how," covers real-world attack vectors, explains production architectures, and provides tools that actually help.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We built CodeSecAI to be that resource. Our free AI-powered tools complement our written content, giving developers hands-on experience with security analysis, code generation, and cloud architecture planning.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Education First", desc: "Every piece of content teaches something actionable. No fluff, no filler." },
            { title: "Security-First Thinking", desc: "Security isn't an afterthought — it's the foundation of everything we write about." },
            { title: "Open Knowledge", desc: "Great technical content should be accessible to everyone, regardless of background." },
            { title: "Innovation", desc: "We stay on the cutting edge, covering emerging technologies before they go mainstream." },
          ].map(v => (
            <div key={v.title} className="bg-card border rounded-lg p-5">
              <h3 className="font-semibold text-foreground mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">What We Cover</h2>
        <div className="space-y-4">
          {categories.map(cat => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <div key={cat.id} className="flex items-start gap-4 bg-card border rounded-lg p-5">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border rounded-lg p-8 text-center">
        <h2 className="text-xl font-bold text-foreground mb-2">Built With Modern Technology</h2>
        <p className="text-sm text-muted-foreground mb-4">CodeSecAI is built with React, TypeScript, Tailwind CSS, and powered by modern AI — the same technologies we write about.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"].map(tech => (
            <span key={tech} className="text-xs font-medium bg-card border rounded-full px-3 py-1 text-foreground">{tech}</span>
          ))}
        </div>
      </section>
    </div>
  </Layout>
);

export default About;
