import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <Layout>
      <SEO title="Terms of Service" description="Read the terms and conditions governing your use of the CodeSecAI website and services." canonical="/terms-of-service" />
      <div className="container py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Terms of Service</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: March 1, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the CodeSecAI website at codesecai.com (the "Site"), you accept and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not access or use the Site.</p>
            <p className="mt-3">These Terms apply to all visitors, users, and others who access or use the Site, including readers, subscribers, contributors, and tool users.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>CodeSecAI is an educational technology publication that provides:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>In-depth articles and tutorials on cybersecurity, artificial intelligence, cloud computing, blockchain, and programming</li>
              <li>Free AI-powered tools and utilities for developers and security professionals</li>
              <li>A newsletter delivering curated technical content</li>
              <li>Community features such as comments and discussion forums</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
            <p>Some features of the Site may require you to create an account. When creating an account, you agree to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized access or use</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our sole discretion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Intellectual Property Rights</h2>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.1 Our Content</h3>
            <p>All content on the Site, including but not limited to articles, tutorials, code examples, graphics, logos, icons, images, and software, is the property of CodeSecAI or its content creators and is protected by copyright, trademark, and other intellectual property laws.</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.2 Permitted Use</h3>
            <p>You may:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Read and access content for personal, non-commercial use</li>
              <li>Share links to articles on social media and other platforms</li>
              <li>Use code snippets from tutorials in your own projects (both personal and commercial), with attribution where practical</li>
              <li>Quote short excerpts (up to 200 words) with proper attribution and a link back to the original article</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.3 Prohibited Use</h3>
            <p>You may not:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Reproduce, distribute, or republish entire articles without prior written consent</li>
              <li>Use our content to train AI/ML models without explicit permission</li>
              <li>Remove or alter any copyright, trademark, or attribution notices</li>
              <li>Use automated scraping tools to collect content from the Site</li>
              <li>Create derivative works based on our content for commercial distribution</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. User-Generated Content</h2>
            <p>By submitting content to the Site (comments, forum posts, or contributed articles), you:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Grant CodeSecAI a non-exclusive, royalty-free, worldwide license to use, display, reproduce, and distribute your content in connection with the Site</li>
              <li>Represent that you own or have the necessary rights to submit the content</li>
              <li>Agree that your content does not violate any third-party rights or applicable laws</li>
            </ul>
            <p className="mt-3">We reserve the right to remove any user-generated content that violates these Terms or is otherwise objectionable, without prior notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Free Tools and Services</h2>
            <p>CodeSecAI provides free AI-powered tools and utilities. These tools are provided "as is" and "as available." We make no guarantees regarding:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>The accuracy, completeness, or reliability of tool outputs</li>
              <li>The availability or uptime of any tool</li>
              <li>The suitability of tool outputs for any particular purpose</li>
            </ul>
            <p className="mt-3">You are solely responsible for reviewing and validating any output generated by our tools before using it in production environments or making decisions based on it.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Prohibited Conduct</h2>
            <p>When using the Site, you agree not to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
              <li>Interfere with or disrupt the Site's infrastructure or other users' experiences</li>
              <li>Upload or transmit viruses, malware, or any harmful code</li>
              <li>Use the Site for any illegal, fraudulent, or malicious purpose</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation</li>
              <li>Engage in any activity that places excessive load on our infrastructure</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Third-Party Links and Services</h2>
            <p>The Site may contain links to third-party websites, services, or resources. These links are provided for convenience only. We do not endorse, control, or assume responsibility for the content, privacy policies, or practices of any third-party sites. You access third-party sites at your own risk.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Disclaimer of Warranties</h2>
            <p>THE SITE AND ALL CONTENT, TOOLS, AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
            <p className="mt-3">We do not warrant that the Site will be uninterrupted, error-free, secure, or free of viruses or other harmful components.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitation of Liability</h2>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, CODESECAI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE, REGARDLESS OF THE CAUSE OF ACTION OR THE THEORY OF LIABILITY.</p>
            <p className="mt-3">Our total liability for any claim arising under these Terms shall not exceed the amount you paid to CodeSecAI (if any) during the twelve (12) months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless CodeSecAI and its affiliates from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from your use of the Site, your violation of these Terms, or your violation of any third-party rights.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes arising under these Terms shall be resolved through good-faith negotiation, and if necessary, through binding arbitration.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the Site. Your continued use of the Site after any changes constitutes your acceptance of the revised Terms. We encourage you to review these Terms periodically.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us:</p>
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

export default TermsOfService;
