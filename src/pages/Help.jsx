import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { SearchIcon } from '../components/Icons'

const topics = [
  { icon: '📦', title: 'Track your package', desc: 'See where your order is right now', to: '/orders' },
  { icon: '↩️', title: 'Returns and refunds', desc: 'Start a return or check refund status', to: '/returns' },
  { icon: '💳', title: 'Payments and Bazaar Pay', desc: 'Manage cards, UPI and wallet', to: '/account?tab=payments' },
  { icon: '📍', title: 'Manage addresses', desc: 'Add or update delivery addresses', to: '/account?tab=addresses' },
  { icon: '🔐', title: 'Account and security', desc: 'Password, sign-in and privacy', to: '/account?tab=security' },
  { icon: '🚚', title: 'Delivery and shipping', desc: 'Delivery options and charges', to: '/help' },
  { icon: '🛒', title: 'Orders and cancellation', desc: 'Cancel, change or combine orders', to: '/orders' },
  { icon: '🎁', title: 'Gift cards and Prime', desc: 'Redeem gift cards, manage Prime', to: '/prime' },
]

const articles = [
  'How do I track my order?',
  'What is the return policy?',
  'How do I cancel an order?',
  'Where is my refund?',
  'How do I change my delivery address?',
  'What payment methods can I use?',
  'How do I use a promo code?',
  'How do I contact Bazaar.in customer service?',
]

export default function Help() {
  const { pushToast } = useStore()
  const [query, setQuery] = useState('')
  const [submitted, setSubmitted] = useState('')

  const filtered = topics.filter((t) =>
    `${t.title} ${t.desc}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  const search = (e) => {
    e.preventDefault()
    setSubmitted(query.trim())
  }

  return (
    <div className="page help-page">
      <div className="container">
        <section className="help-hero">
          <h1>Hello, how can we help?</h1>
          <p>Search our help centre or browse topics below. We&apos;re here 24/7.</p>
          <form className="help-search" onSubmit={search}>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSubmitted('') }}
              placeholder="Search help topics, e.g. refund, delivery, password"
              aria-label="Search help"
            />
            <button type="submit" aria-label="Search"><SearchIcon size={20} /></button>
          </form>
          {submitted && (
            <p className="help-result-note">
              {filtered.length} {filtered.length === 1 ? 'topic' : 'topics'} found for “{submitted}”.
            </p>
          )}
        </section>

        <section className="card">
          <div className="row-head">
            <h2>Browse help topics</h2>
            <span className="muted">Most popular</span>
          </div>
          <div className="help-grid">
            {filtered.map((t) => (
              <Link to={t.to} className="help-card" key={t.title}>
                <span className="help-icon">{t.icon}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </Link>
            ))}
            {filtered.length === 0 && (
              <div className="empty-state compact" style={{ gridColumn: '1 / -1' }}>
                <span className="empty-emoji">🔍</span>
                <h3>No help topics matched</h3>
                <p>Try a different keyword, or contact us below.</p>
              </div>
            )}
          </div>
        </section>

        <div className="help-cols">
          <section className="card">
            <h2>Popular articles</h2>
            <ul className="help-list">
              {articles.map((a) => (
                <li key={a}>
                  <button type="button" className="link-btn" onClick={() => pushToast('Help articles are not part of this demo.', 'info')}>
                    {a}
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2>Your recent orders</h2>
            <p className="muted">Need help with a specific order? Open it to see tracking, returns and invoice options.</p>
            <Link to="/orders" className="btn btn-outline">Go to your orders</Link>
            <hr className="divider" />
            <h3>Returns Centre</h3>
            <p className="muted">Start a return or replacement in a few clicks.</p>
            <Link to="/returns" className="btn btn-outline">Start a return</Link>
          </section>
        </div>

        <section className="card">
          <h2>Contact us</h2>
          <p className="muted">Choose how you&apos;d like to get in touch. Demo buttons show a notification.</p>
          <div className="help-contact">
            <div className="contact-card">
              <span className="help-icon">💬</span>
              <h3>Chat with us</h3>
              <p>Available 24/7 in English and Hindi.</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => pushToast('Live chat is not available in this demo.', 'info')}>
                Start chat
              </button>
            </div>
            <div className="contact-card">
              <span className="help-icon">📞</span>
              <h3>Call us</h3>
              <p>Talk to a support agent on 1800-000-000.</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => pushToast('Phone support is not available in this demo.', 'info')}>
                Request a call
              </button>
            </div>
            <div className="contact-card">
              <span className="help-icon">✉️</span>
              <h3>Email us</h3>
              <p>We reply within 24 hours.</p>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => pushToast('Email support is not available in this demo.', 'info')}>
                Send email
              </button>
            </div>
          </div>
        </section>

        <p className="listing-foot">
          For urgent issues, you can also visit <Link to="/returns">Returns Centre</Link> or check your{' '}
          <Link to="/orders">order status</Link>.
        </p>
      </div>
    </div>
  )
}
