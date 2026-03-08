import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <Layout>
      <SEO title="Cookie Policy" description="Learn about the cookies and tracking technologies used on the CodeSecAI website." canonical="/cookie-policy" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Cookie Policy", path: "/cookie-policy" }]} />
      <div className="container py-12 max-w-4xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Cookie Policy</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: March 1, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to website operators. Cookies can be "persistent" (remaining on your device until they expire or are deleted) or "session" cookies (deleted when you close your browser).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Cookies</h2>
            <p>CodeSecAI uses cookies and similar tracking technologies for the following purposes:</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Essential Cookies</h3>
            <p>These cookies are necessary for the Site to function properly. They enable core features such as:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-border font-mono text-xs">session_id</td>
                    <td className="p-3 border-b border-border">Maintains your session state</td>
                    <td className="p-3 border-b border-border">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border font-mono text-xs">csrf_token</td>
                    <td className="p-3 border-b border-border">Security — prevents cross-site request forgery</td>
                    <td className="p-3 border-b border-border">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">cookie_consent</td>
                    <td className="p-3">Stores your cookie preference choices</td>
                    <td className="p-3">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.2 Analytics Cookies</h3>
            <p>These cookies help us understand how visitors interact with the Site by collecting and reporting information anonymously.</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-border font-mono text-xs">_ga</td>
                    <td className="p-3 border-b border-border">Google Analytics — distinguishes unique visitors</td>
                    <td className="p-3 border-b border-border">2 years</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b border-border font-mono text-xs">_ga_*</td>
                    <td className="p-3 border-b border-border">Google Analytics 4 — maintains session state</td>
                    <td className="p-3 border-b border-border">2 years</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">_gid</td>
                    <td className="p-3">Google Analytics — distinguishes users</td>
                    <td className="p-3">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.3 Functionality Cookies</h3>
            <p>These cookies enable enhanced functionality and personalization:</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-border font-mono text-xs">theme</td>
                    <td className="p-3 border-b border-border">Remembers your dark/light mode preference</td>
                    <td className="p-3 border-b border-border">12 months</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">reading_prefs</td>
                    <td className="p-3">Stores reading preferences (font size, layout)</td>
                    <td className="p-3">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.4 Marketing Cookies</h3>
            <p>We may use marketing cookies to deliver relevant advertisements and measure their effectiveness. These cookies track your browsing activity across websites.</p>
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground border-b border-border">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b border-border font-mono text-xs">_fbp</td>
                    <td className="p-3 border-b border-border">Facebook Pixel — ad targeting and measurement</td>
                    <td className="p-3 border-b border-border">3 months</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">li_sugr</td>
                    <td className="p-3">LinkedIn Insight Tag — conversion tracking</td>
                    <td className="p-3">3 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Cookies</h2>
            <p>In addition to our own cookies, we may use third-party cookies from the following services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li><strong className="text-foreground">Google Analytics:</strong> Web analytics service to understand how visitors use the Site. <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li><strong className="text-foreground">Cloudflare:</strong> CDN and security services that may set cookies for bot detection and performance optimization. <a href="https://www.cloudflare.com/privacypolicy/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Cloudflare Privacy Policy</a></li>
              <li><strong className="text-foreground">YouTube:</strong> Embedded video content may set cookies. <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">YouTube Privacy Policy</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Managing Cookies</h2>
            <p>You have several options for managing cookies:</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.1 Browser Settings</h3>
            <p>Most web browsers allow you to control cookies through their settings. You can typically:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>View what cookies are stored on your device</li>
              <li>Delete individual or all cookies</li>
              <li>Block all or specific cookies</li>
              <li>Set preferences for certain websites</li>
            </ul>
            <p className="mt-3">Please note that blocking essential cookies may impact the functionality of the Site.</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.2 Opt-Out Links</h3>
            <p>You can opt out of specific analytics and advertising cookies:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-Out Browser Add-on</a></li>
              <li><a href="https://optout.networkadvertising.org/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Network Advertising Initiative Opt-Out</a></li>
              <li><a href="https://optout.aboutads.info/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance Opt-Out</a></li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.3 Do Not Track</h3>
            <p>Some browsers include a "Do Not Track" (DNT) feature. We currently respond to DNT signals by limiting non-essential tracking when detected.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Local Storage and Similar Technologies</h2>
            <p>In addition to cookies, we may use other local storage technologies, including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong className="text-foreground">localStorage:</strong> Used to store theme preferences, reading progress, and tool settings</li>
              <li><strong className="text-foreground">sessionStorage:</strong> Used for temporary session data that is cleared when the browser tab is closed</li>
              <li><strong className="text-foreground">IndexedDB:</strong> May be used for offline content caching</li>
            </ul>
            <p className="mt-3">These technologies function similarly to cookies and can be managed through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Changes to This Cookie Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Us</h2>
            <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>
            <ul className="list-none mt-3 space-y-1">
              <li><strong className="text-foreground">Email:</strong> <a href="mailto:privacy@codesecai.com" className="text-primary hover:underline">privacy@codesecai.com</a></li>
              <li><strong className="text-foreground">Contact Form:</strong> <Link to="/contact" className="text-primary hover:underline">codesecai.com/contact</Link></li>
            </ul>
            <p className="mt-3">For more information about how we handle your personal data, please see our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePolicy;
