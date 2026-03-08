import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { tools } from "@/data/tools";

const Tools = () => {
  const toolCategories = [...new Set(tools.map(t => t.category))];

  return (
    <Layout>
      <section className="hero-gradient">
        <div className="container py-16 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Free AI-Powered Developer Tools</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Code generators, vulnerability explainers, SEO analyzers, regex testers, and more — all free, no signup required.</p>
        </div>
      </section>
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div key={tool.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/tools/${tool.slug}`} className="block group">
                <div className="bg-card border rounded-lg p-6 hover:shadow-md hover:border-primary/30 transition-all h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2.5 py-0.5">{tool.category}</span>
                  </div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">{tool.name}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                  {tool.isClientOnly && <span className="inline-block mt-3 text-xs text-secondary font-medium">✓ Runs locally — no data sent to servers</span>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Tools;
