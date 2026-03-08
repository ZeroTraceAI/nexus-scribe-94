import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const Disclaimer = () => {
  return (
    <Layout>
      <SEO title="Disclaimer" description="Important disclaimers about CodeSecAI content, tools, code examples, and ethical use of security information." canonical="/disclaimer" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Disclaimer", path: "/disclaimer" }]} />
      <div className="container py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Disclaimer</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: March 1, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. General Information</h2>
            <p>The information provided on CodeSecAI (codesecai.com) is for general educational and informational purposes only. All content on the Site is published in good faith and is intended to help developers, security professionals, and technology enthusiasts learn and improve their skills.</p>
            <p className="mt-3">While we strive to keep the information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Not Professional Advice</h2>
            <p>The content published on CodeSecAI does not constitute professional advice. Specifically:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li><strong className="text-foreground">Security Content:</strong> Our cybersecurity articles are educational in nature. They do not replace professional security audits, penetration testing services, or consultations with qualified cybersecurity professionals. Always engage certified security professionals for your organization's security needs.</li>
              <li><strong className="text-foreground">Legal and Compliance:</strong> Information about regulations (GDPR, HIPAA, SOC 2, etc.) is provided for awareness purposes only and does not constitute legal advice. Consult qualified legal counsel for compliance matters.</li>
              <li><strong className="text-foreground">Technical Implementations:</strong> Code examples, architecture patterns, and technical tutorials are provided for learning purposes. Always review, test, and validate any code or configuration before deploying to production environments.</li>
              <li><strong className="text-foreground">Financial and Business:</strong> Any mentions of costs, pricing, or business strategies are approximate and should not be relied upon for financial decisions.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Ethical Use of Security Information</h2>
            <p>CodeSecAI publishes content about cybersecurity topics, including vulnerability analysis, penetration testing techniques, and security tools. This information is provided strictly for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Educational purposes and professional development</li>
              <li>Authorized security testing on systems you own or have explicit permission to test</li>
              <li>Improving defensive security measures</li>
              <li>Understanding threats to better protect systems and data</li>
            </ul>
            <p className="mt-3"><strong className="text-foreground">Any use of information from this Site for unauthorized access, hacking, or any illegal activity is strictly prohibited.</strong> We do not condone or support any illegal activities, and readers are solely responsible for ensuring their activities comply with all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. AI-Generated Content and Tools</h2>
            <p>Some content and tools on CodeSecAI may incorporate artificial intelligence technologies. Regarding AI-generated or AI-assisted content:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>AI outputs may contain inaccuracies, outdated information, or errors</li>
              <li>All AI-generated content is reviewed by our editorial team, but we cannot guarantee completeness</li>
              <li>Tool outputs should be treated as suggestions and independently verified</li>
              <li>Do not rely solely on AI-generated content for critical security, business, or technical decisions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Code Examples and Tutorials</h2>
            <p>Code examples, scripts, and configuration samples provided on the Site:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Are provided for educational and illustrative purposes</li>
              <li>May be simplified for clarity and may not include all necessary error handling, security controls, or production-readiness features</li>
              <li>Should be thoroughly reviewed, tested, and adapted before use in production environments</li>
              <li>May reference specific software versions that could become outdated</li>
              <li>Are provided without warranty — use at your own risk</li>
            </ul>
            <p className="mt-3">CodeSecAI is not responsible for any damages, data loss, security incidents, or other issues resulting from the use of code examples or tutorials from the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. External Links</h2>
            <p>The Site may contain links to external websites and resources. These links are provided for convenience and informational purposes only. CodeSecAI does not:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Endorse or guarantee the content of linked websites</li>
              <li>Control the privacy practices or content of third-party sites</li>
              <li>Accept responsibility for any loss or damage from following external links</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Product and Service Mentions</h2>
            <p>When we mention, review, or compare products, services, or tools:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Our opinions are based on our experience and research at the time of writing</li>
              <li>Some articles may contain affiliate links — these will always be clearly disclosed</li>
              <li>Product features, pricing, and availability may change after publication</li>
              <li>Mentions do not constitute endorsements unless explicitly stated</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>In no event shall CodeSecAI, its authors, editors, or contributors be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in connection with your use of the Site or reliance on any information provided on the Site. This includes, but is not limited to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Security breaches or incidents resulting from following published techniques</li>
              <li>Data loss or corruption from implementing code examples</li>
              <li>Financial losses from business decisions based on Site content</li>
              <li>System downtime or performance issues from applying configurations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Content Accuracy and Updates</h2>
            <p>Technology evolves rapidly. While we make every effort to keep our content current:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Information may become outdated between publication and your reading</li>
              <li>Software versions, APIs, and best practices change frequently</li>
              <li>Always verify information against official documentation and current sources</li>
              <li>Check article publication and update dates for context</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
            <p>If you have questions about this Disclaimer or believe any content on the Site is inaccurate, please contact us:</p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong className="text-foreground">Email:</strong> <a href="mailto:legal@codesecai.com" className="text-primary hover:underline">legal@codesecai.com</a></li>
              <li><strong className="text-foreground">Contact Form:</strong> <Link to="/contact" className="text-primary hover:underline">codesecai.com/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Disclaimer;
