import { Link } from 'react-router-dom'
import { STATIC_IMAGES } from '../data/images'

const content = {
  about: {
    eyebrow: 'About us',
    title: 'Who we are',
    emoji: '🏢',
    intro:
      'Bazaar.in is a demo storefront built to showcase a complete shopping experience — from discovery and search to checkout, orders and returns.',
    features: [
      { icon: '🛒', title: 'Everything store', text: 'Millions of products across electronics, fashion, home, books and more.' },
      { icon: '🚚', title: 'Fast delivery', text: 'Free and fast delivery options on eligible orders across India.' },
      { icon: '🔒', title: 'Secure by design', text: 'Safe payments, easy returns and purchase protection on every order.' },
    ],
    sections: [
      {
        h: 'Our story',
        p: [
          'This project recreates the look and feel of Amazon.in using React and Vite. It is a learning and portfolio build, not a real marketplace, and it is not affiliated with Amazon.',
          'Every page — home, search, product details, cart, checkout, orders, account, help, returns and legal pages — is implemented as a working front-end experience with realistic sample data.',
        ],
      },
      {
        h: 'What we do',
        p: [
          'We bring together a catalogue of products, transparent pricing, customer reviews and convenient delivery options in one place.',
          'Our goal with this demo is to show how a large commerce experience can be broken into reusable React components, routed pages and a shared application state.',
        ],
      },
      {
        h: 'Leadership principles',
        p: [
          'Customer obsession, ownership, invent and simplify, and a bias for action guide how this demo experience was designed.',
          'You can explore the code, swap in your own product data and extend any page to build your own storefront.',
        ],
      },
    ],
    cta: { label: 'Explore the store', to: '/' },
  },
  careers: {
    eyebrow: 'Careers',
    title: 'Work hard. Have fun. Make history.',
    emoji: '🚀',
    intro: 'Join a team that is building delightful shopping experiences for customers across India.',
    features: [
      { icon: '💡', title: 'Build at scale', text: 'Work on interfaces used by millions of shoppers.' },
      { icon: '🌱', title: 'Grow every day', text: 'Learning budgets, mentorship and internal mobility.' },
      { icon: '🤝', title: 'Great teams', text: 'Collaborate with designers, engineers and product thinkers.' },
    ],
    sections: [
      { h: 'Life at Bazaar.in', p: ['We are customer-obsessed, curious and comfortable with ambiguity. Teams move fast, test ideas and learn from real customer feedback.'] },
      { h: 'Teams hiring', p: ['Front-end engineering, product design, data science, operations and customer service. Roles are illustrative for this demo.'] },
      { h: 'Benefits', p: ['Comprehensive health cover, flexible working, paid time off, learning stipends and employee discounts.'] },
      { h: 'How to apply', p: ['This is a demo site, so there are no live roles. In a real build you would link each role to an applicant tracking system here.'] },
    ],
    cta: { label: 'See open roles', to: '/about' },
  },
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Notice',
    emoji: '🔐',
    intro: 'This demo does not send your data anywhere. Everything you enter is stored only in your browser.',
    sections: [
      { h: 'Information we collect', p: ['In this demo, the name, email, addresses, cart, wish list and orders you enter are stored in your browser local storage so the experience persists between visits.'] },
      { h: 'How we use information', p: ['Data is used only to render the interface — for example, showing your cart count, order history and saved addresses. No analytics or tracking scripts are included.'] },
      { h: 'Cookies and local storage', p: ['We use browser local storage instead of cookies. Clearing your browser data removes everything this demo has saved.'] },
      { h: 'Your choices', p: ['You can clear the demo data at any time by clearing site data in your browser settings. You can also sign out from the header.'] },
      { h: 'Security', p: ['Because this is a front-end demo, do not enter real passwords, card numbers or personal information. Payment fields are illustrative only.'] },
      { h: 'Contact', p: ['This project is a demo and is not affiliated with Amazon. For privacy questions about a real service, contact that service directly.'] },
    ],
  },
  conditions: {
    eyebrow: 'Legal',
    title: 'Conditions of Use',
    emoji: '📄',
    intro: 'Please read these demo terms. This site is a portfolio project and not a real marketplace.',
    sections: [
      { h: '1. Demo only', p: ['This website is a front-end demonstration. Products, prices, reviews, sellers and delivery estimates are sample data. No real orders are fulfilled and no payments are taken.'] },
      { h: '2. Your account', p: ['You may create a demo account with any email and password. Do not use a real password. You are responsible for activity under your demo session.'] },
      { h: '3. Pricing and availability', p: ['All prices are shown in Indian Rupees and are indicative. Products may appear in stock or out of stock purely for demonstration.'] },
      { h: '4. Orders and payments', p: ['Placing an order creates a local record in your browser only. Payment methods are displayed for illustration and are never processed.'] },
      { h: '5. Returns', p: ['The Returns Centre is a demo workflow. It creates a local return reference but does not schedule a real pickup.'] },
      { h: '6. Intellectual property', p: ['Amazon and related marks belong to their owners. This project is not affiliated with, endorsed by or sponsored by Amazon.'] },
      { h: '7. Liability', p: ['The demo is provided as-is, without warranties. Use it for learning and evaluation at your own risk.'] },
    ],
  },
  'interest-ads': {
    eyebrow: 'Legal',
    title: 'Interest-Based Ads',
    emoji: '🎯',
    intro: 'How personalised advertising works in a real store — and why this demo does not track you.',
    sections: [
      { h: 'What are interest-based ads?', p: ['Interest-based ads use browsing activity to show products that may be more relevant to you. A real store might use cookies or device identifiers for this.'] },
      { h: 'How this demo behaves', p: ['This demo does not include advertising pixels or third-party trackers. Recommendations are generated locally from the sample catalogue.'] },
      { h: 'Your choices', p: ['In a production store you would see controls to opt out of personalised ads here. In this demo, no personalisation data leaves your browser.'] },
      { h: 'Contact', p: ['Questions about this demo can be raised in the project repository.'] },
    ],
  },
  accessibility: {
    eyebrow: 'Inclusion',
    title: 'Accessibility',
    emoji: '♿',
    intro: 'Everyone should be able to shop comfortably. This demo aims for clear structure, keyboard access and readable contrast.',
    features: [
      { icon: '⌨️', title: 'Keyboard friendly', text: 'Navigation, forms and dialogs are reachable with a keyboard.' },
      { icon: '🔎', title: 'Readable', text: 'Strong contrast, scalable text and descriptive labels.' },
      { icon: '📱', title: 'Responsive', text: 'Layouts adapt from small phones to wide desktop screens.' },
    ],
    sections: [
      { h: 'Our commitment', p: ['We follow semantic HTML, visible focus styles and descriptive alternative text for interactive elements wherever possible.'] },
      { h: 'Feedback', p: ['Accessibility is an ongoing effort. If you spot an issue in this demo, note the page and the assistive technology you used so it can be improved.'] },
    ],
    cta: { label: 'Back to home', to: '/' },
  },
  sell: {
    eyebrow: 'Sell on Bazaar.in',
    title: 'Grow your business with Bazaar.in',
    emoji: '📈',
    intro: 'Reach crores of customers, use fulfilment and payments tools, and grow your brand across India.',
    features: [
      { icon: '🧾', title: 'Low setup cost', text: 'Start selling with simple registration and pay-as-you-go fees.' },
      { icon: '🚚', title: 'Fulfilment by Bazaar.in', text: 'Store, pack and ship with Bazaar.in logistics.' },
      { icon: '📣', title: 'Reach more buyers', text: 'Advertising, deals and recommendations that drive discovery.' },
    ],
    sections: [
      { h: 'Why sell with us', p: ['Access a large customer base, secure payments and tools that help you manage inventory, pricing and returns from one dashboard.'] },
      { h: 'How it works', p: ['1. Register your business and verify details. 2. List your products with images and pricing. 3. Choose fulfilment and start receiving orders. 4. Get paid securely on a regular cycle.'] },
      { h: 'Fees and payments', p: ['Selling fees vary by category. In this demo, the registration and fee calculator are illustrative only.'] },
      { h: 'Seller support', p: ['A real seller would get access to training, account managers and a support portal. This demo links back to the help centre.'] },
    ],
    cta: { label: 'Start selling', to: '/register' },
  },
  prime: {
    eyebrow: 'Bazaar Prime',
    title: 'Fast, free delivery. Entertainment. Exclusive deals.',
    emoji: '⚡',
    intro: 'One membership that brings together shopping, video, music and reading benefits.',
    features: [
      { icon: '🚚', title: 'FREE fast delivery', text: 'Unlimited free delivery on millions of eligible items.' },
      { icon: '🎬', title: 'Bazaar Video', text: 'Movies, series and Bazaar Originals in HD.' },
      { icon: '🎵', title: 'Bazaar Music', text: 'Ad-free music, playlists and podcasts.' },
      { icon: '📚', title: 'Bazaar Reading', text: 'Rotating catalogue of eBooks and magazines.' },
      { icon: '🔥', title: 'Early deals', text: 'Get 30 minutes early access to select deals.' },
      { icon: '🎁', title: 'Prime-only offers', text: 'Exclusive discounts and bundles for members.' },
    ],
    sections: [
      { h: 'Membership plans', p: ['₹1,499 per year, or ₹299 per month. This is sample pricing for the demo.'] },
      { h: 'How to join', p: ['Create an account, choose a plan and confirm your payment method. In this demo, joining simply shows a confirmation notification.'] },
      { h: 'Frequently asked questions', p: ['Can I cancel anytime? Yes. Does Prime include free delivery on all items? Most eligible items, yes. Is Prime Video included? Yes, in a real membership.'] },
    ],
    cta: { label: 'Join Prime', to: '/register' },
  },
}

export default function StaticPage({ page }) {
  const data = content[page]

  if (!data) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state card">
            <span className="empty-emoji">📄</span>
            <h2>Page not found</h2>
            <Link to="/" className="btn btn-primary">Back to home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page static-page">
      <div className="container narrow">
        <section className="static-hero">
          <img className="static-hero-art" src={STATIC_IMAGES[page]} alt="" loading="lazy" decoding="async" />
          <span className="eyebrow">{data.eyebrow}</span>
          <h1>{data.title}</h1>
          <p>{data.intro}</p>
        </section>

        {data.features && (
          <div className="static-features">
            {data.features.map((f) => (
              <div className="static-feature" key={f.title}>
                <span className="help-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        )}

        <article className="prose">
          {data.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </section>
          ))}
        </article>

        {data.cta && (
          <div className="static-cta">
            <div>
              <h2>Ready to get started?</h2>
              <p>Explore the rest of the demo store.</p>
            </div>
            <Link to={data.cta.to} className="btn btn-primary">{data.cta.label}</Link>
          </div>
        )}

        <p className="listing-foot">
          This page is part of a demo project and is not affiliated with Amazon. <Link to="/">Back to home</Link>
        </p>
      </div>
    </div>
  )
}
