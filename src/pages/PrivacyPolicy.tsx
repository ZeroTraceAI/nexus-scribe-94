import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <SEO title="Privacy Policy" description="Learn how CodeSecAI collects, uses, and protects your personal information." canonical="/privacy-policy" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]} />
      <div className="container py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: March 1, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>CodeSecAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website at codesecai.com (the "Site"), including any related services, features, and content offered through the Site.</p>
            <p className="mt-3">By accessing or using the Site, you agree to the terms of this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the Site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Subscribe to our newsletter</li>
              <li>Submit a contact form or inquiry</li>
              <li>Create an account on our platform</li>
              <li>Leave comments on articles</li>
              <li>Participate in surveys or promotions</li>
            </ul>
            <p className="mt-3">This information may include your name, email address, and any other information you choose to provide.</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2 Automatically Collected Information</h3>
            <p>When you visit our Site, we automatically collect certain information about your device and your usage of the Site, including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Device Information:</strong> Browser type and version, operating system, device type, screen resolution</li>
              <li><strong className="text-foreground">Usage Data:</strong> Pages visited, time spent on pages, referring URLs, click patterns</li>
              <li><strong className="text-foreground">Network Information:</strong> IP address, approximate geographic location, Internet service provider</li>
              <li><strong className="text-foreground">Cookies and Tracking Technologies:</strong> Information collected through cookies, web beacons, and similar technologies (see our <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect for the following purposes:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Content Delivery:</strong> To provide, maintain, and improve our articles, tools, and educational content</li>
              <li><strong className="text-foreground">Communication:</strong> To send newsletters, respond to inquiries, and provide customer support</li>
              <li><strong className="text-foreground">Analytics:</strong> To analyze usage trends, measure the effectiveness of our content, and improve user experience</li>
              <li><strong className="text-foreground">Personalization:</strong> To tailor content recommendations and reading suggestions based on your interests</li>
              <li><strong className="text-foreground">Security:</strong> To detect, prevent, and address technical issues, fraud, and security vulnerabilities</li>
              <li><strong className="text-foreground">Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Service Providers:</strong> We may share information with trusted third-party service providers who assist us in operating our Site, such as hosting providers, email delivery services, and analytics platforms</li>
              <li><strong className="text-foreground">Legal Requirements:</strong> We may disclose information if required by law, court order, or governmental authority</li>
              <li><strong className="text-foreground">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction</li>
              <li><strong className="text-foreground">Consent:</strong> We may share your information with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Newsletter subscription data is retained until you unsubscribe. Analytics data is retained in an aggregated, anonymized form for up to 26 months.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-foreground">Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete personal information</li>
              <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information, subject to certain exceptions</li>
              <li><strong className="text-foreground">Opt-Out:</strong> Unsubscribe from marketing communications at any time using the link in our emails</li>
              <li><strong className="text-foreground">Data Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
              <li><strong className="text-foreground">Withdraw Consent:</strong> Withdraw previously given consent to data processing</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us at <a href="mailto:privacy@codesecai.com" className="text-primary hover:underline">privacy@codesecai.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS/SSL), secure server infrastructure, access controls, and regular security assessments. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by the European Commission, to protect your information in accordance with this Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
            <p>Our Site is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected personal information from a child under 16, we will take steps to delete such information promptly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the Site after any modifications constitutes your acceptance of the revised Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong className="text-foreground">Email:</strong> <a href="mailto:privacy@codesecai.com" className="text-primary hover:underline">privacy@codesecai.com</a></li>
              <li><strong className="text-foreground">Contact Form:</strong> <Link to="/contact" className="text-primary hover:underline">codesecai.com/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
