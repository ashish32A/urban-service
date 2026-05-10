import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Services: [
    { label: 'Home Cleaning', to: '/services/cleaning' },
    { label: 'Plumbing', to: '/services/plumbing' },
    { label: 'Electrical', to: '/services/electrical' },
    { label: 'Beauty & Spa', to: '/services/beauty' },
    { label: 'Appliance Repair', to: '/services/appliance-repair' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Blog', to: '/blog' },
    { label: 'Press', to: '/press' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Contact Us', to: '/contact' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary-500 text-white">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 no-underline mb-4">
              <span className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-sm">U</span>
              <span className="font-heading font-bold text-xl text-white">
                Urban<span className="text-primary-400">Serve</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's most trusted platform for professional home services. Quality guaranteed.
            </p>
            <div className="flex gap-3 mt-4">
              {/* Social Icons */}
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social}
                >
                  <span className="text-xs capitalize">{social[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
              <ul className="space-y-2 list-none p-0">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200 no-underline"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider border-white/10 mt-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-gray-400 text-sm">© {year} UrbanServe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="badge badge-primary text-xs">ISO 9001 Certified</span>
            <span className="text-gray-400 text-xs">Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
