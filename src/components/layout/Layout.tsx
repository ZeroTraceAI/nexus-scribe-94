import Header from "./Header";
import Footer from "./Footer";
import CookieConsent from "@/components/CookieConsent";

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <CookieConsent />
  </div>
);

export default Layout;
