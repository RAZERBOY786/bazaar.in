import { Link } from 'react-router-dom'
import Logo from './Logo'

const columns = [
  {
    title: 'Get to Know Us',
    links: [
      { label: 'About Amazon', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press Releases', to: '/about' },
      { label: 'Amazon Science', to: '/about' },
    ],
  },
  {
    title: 'Connect with Us',
    links: [
      { label: 'Facebook', href: 'https://www.facebook.com/AmazonIN' },
      { label: 'Twitter', href: 'https://twitter.com/amazonin' },
      { label: 'Instagram', href: 'https://www.instagram.com/amazonin' },
    ],
  },
  {
    title: 'Make Money with Us',
    links: [
      { label: 'Sell on Amazon', to: '/sell' },
      { label: 'Sell under Amazon Accelerator', to: '/sell' },
      { label: 'Protect and Build Your Brand', to: '/sell' },
      { label: 'Amazon Global Selling', to: '/sell' },
      { label: 'Supply to Amazon', to: '/sell' },
      { label: 'Become an Affiliate', to: '/sell' },
      { label: 'Fulfilment by Amazon', to: '/sell' },
      { label: 'Advertise Your Products', to: '/sell' },
      { label: 'Amazon Pay on Merchants', to: '/sell' },
    ],
  },
  {
    title: 'Let Us Help You',
    links: [
      { label: 'Your Account', to: '/account' },
      { label: 'Returns Centre', to: '/returns' },
      { label: 'Recalls and Product Safety Alerts', to: '/help' },
      { label: '100% Purchase Protection', to: '/help' },
      { label: 'Amazon App Download', to: '/help' },
      { label: 'Customer Service', to: '/help' },
    ],
  },
]

const partners = [
  { label: 'AbeBooks', sub: 'Books, art & collectibles', to: '/category/books' },
  { label: 'Amazon Web Services', sub: 'Scalable Cloud Computing Services', to: '/category/computers' },
  { label: 'Audible', sub: 'Download Audio Books', to: '/category/books' },
  { label: 'IMDb', sub: 'Movies, TV & Celebrities', to: '/help' },
  { label: 'Shopbop', sub: 'Designer Fashion Brands', to: '/category/fashion' },
  { label: 'Amazon Business', sub: 'Everything For Your Business', to: '/sell' },
  { label: 'Amazon Music', sub: 'Stream millions of songs', to: '/help' },
]

export default function Footer({ minimal = false, onOpenShortcuts }) {
  if (minimal) {
    return (
      <footer className="auth-footer">
        <div className="auth-footer-links">
          <Link to="/conditions">Conditions of Use</Link>
          <Link to="/privacy">Privacy Notice</Link>
          <Link to="/help">Help</Link>
        </div>
        <p>© 1996-2026, Bazaar.in demo. A portfolio project, not affiliated with Amazon.</p>
      </footer>
    )
  }

  return (
    <footer className="site-footer">
      <button
        type="button"
        className="back-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Back to top
      </button>

      <div className="footer-main">
        <div className="footer-cols">
          {columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <h3>{col.title}</h3>
              {col.links.map((l) =>
                l.href ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
                ) : (
                  <Link key={l.label} to={l.to}>{l.label}</Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-partners">
        <div className="footer-partners-inner">
          {partners.map((p) => (
            <Link key={p.label} to={p.to} className="footer-partner">
              <strong>{p.label}</strong>
              <span>{p.sub}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="footer-lang">
        <Logo className="footer-logo" />
        <div className="footer-lang-actions">
          <button type="button" className="footer-select">English</button>
          <button type="button" className="footer-select">₹ INR - Indian Rupee</button>
          <button type="button" className="footer-select">🇮🇳 India</button>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div className="footer-legal">
            <Link to="/conditions">Conditions of Use &amp; Sale</Link>
            <Link to="/privacy">Privacy Notice</Link>
            <Link to="/interest-ads">Interest-Based Ads</Link>
            <Link to="/accessibility">Accessibility</Link>
            {onOpenShortcuts && (
              <button type="button" className="footer-shortcuts" onClick={onOpenShortcuts}>
                Keyboard shortcuts
              </button>
            )}
          </div>
          <p>© 1996-2026, Bazaar.in demo. Built as a portfolio project — not affiliated with Amazon.</p>
          <p className="footer-credits">
            Product photography from{' '}
            <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash</a> and{' '}
            <a href="https://www.pexels.com/license/" target="_blank" rel="noreferrer">Pexels</a>, used under their free licences.
          </p>
        </div>
      </div>
    </footer>
  )
}
