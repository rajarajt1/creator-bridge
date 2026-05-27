import Navbar from '../layout/Navbar.jsx';
import Footer from '../layout/Footer.jsx';

/**
 * ProtectedLayout
 *
 * Wraps authenticated pages that need the top navigation bar and footer
 * but do not require the sidebar (e.g. Messages, Campaigns, Creators).
 *
 * Usage:
 *   <ProtectedLayout>
 *     <SomePage />
 *   </ProtectedLayout>
 */
const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default ProtectedLayout;
