import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Twitter, Instagram, Linkedin } from 'lucide-react';

const LINKS = {
  Company: [
    { label: 'About',   to: '/about' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
};

const Footer = () => (
  <footer className="bg-white border-t border-gray-200 mt-auto">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <BriefcaseBusiness className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900">
              Creators<span className="text-indigo-600">Bridge</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Connecting content creators with brands for meaningful collaborations that drive results.
          </p>

          {/* Social */}
          <div className="flex items-center gap-3 mt-4">
            {[
              { icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter' },
              { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([heading, items]) => (
          <div key={heading}>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{heading}</h3>
            <ul className="space-y-2">
              {items.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} CreatorsBridge. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">Made with ♥ for creators & brands</p>
      </div>
    </div>
  </footer>
);

export default Footer;
