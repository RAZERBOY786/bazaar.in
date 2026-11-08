import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { MISC_IMAGES } from '../data/images'
import ProductCard from '../components/ProductCard'

const under = (max, n = 5) =>
  products.filter((p) => p.price <= max).sort((a, b) => b.rating - a.rating).slice(0, n)
const inCategory = (cat, n = 5) =>
  products.filter((p) => p.category === cat).sort((a, b) => b.rating - a.rating).slice(0, n)
const topRated = (n = 5) => [...products].sort((a, b) => b.rating - a.rating).slice(0, n)

const sections = [
  {
    title: 'Gifts under ₹499',
    sub: 'Thoughtful picks that do not break the bank',
    items: under(499),
    to: '/deals',
  },
  {
    title: 'Gifts under ₹999',
    sub: 'Popular presents in a sweet spot',
    items: under(999),
    to: '/deals',
  },
  {
    title: 'Top-rated gifts',
    sub: 'Loved by customers across India',
    items: topRated(),
    to: '/bestsellers',
  },
  {
    title: 'Tech gifts',
    sub: 'Headphones, smartwatches and more',
    items: inCategory('electronics'),
    to: '/category/electronics',
  },
  {
    title: 'Home & kitchen gifts',
    sub: 'Useful upgrades for every home',
    items: inCategory('home-kitchen'),
    to: '/category/home-kitchen',
  },
  {
    title: 'Fashion & beauty gifts',
    sub: 'Style and self-care favourites',
    items: [...inCategory('fashion', 3), ...inCategory('beauty', 2)],
    to: '/category/fashion',
  },
]

export default function GiftIdeas() {
  return (
    <div className="page listing-page">
      <div className="container">
        <div className="listing-head">
          <h1>Gift Ideas</h1>
          <p className="muted">Find the perfect gift for every occasion, budget and person.</p>
        </div>

        <section className="gift-hero card">
          <div>
            <span className="gift-eyebrow">Festive gifting</span>
            <h2>Make every celebration memorable</h2>
            <p>Curated gifts for family, friends and colleagues — with easy returns and fast delivery.</p>
            <Link to="/deals" className="btn btn-primary">Shop festive gifts</Link>
          </div>
          <img
            className="gift-hero-art"
            src={MISC_IMAGES.gifts}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </section>

        {sections.map((s) => (
          <section className="card deals-section history-section" key={s.title}>
            <div className="row-head">
              <div>
                <h2>{s.title}</h2>
                <p className="rail-sub">{s.sub}</p>
              </div>
              <Link to={s.to} className="see-all">See all</Link>
            </div>
            <div className="deal-scroll">
              {s.items.map((p) => (
                <div className="deal-scroll-item" key={`${s.title}-${p.id}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="card deals-section history-section">
          <div className="row-head">
            <h2>Gift cards</h2>
            <Link to="/gift-cards" className="see-all">Explore gift cards</Link>
          </div>
          <p className="rail-sub">Let them choose exactly what they want with a Bazaar.in gift card.</p>
          <div className="gift-card-strip">
            {[500, 1000, 2000, 5000].map((amount) => (
              <Link to="/gift-cards" key={amount} className="gift-card-mini">
                <span>₹{amount}</span>
                <small>Bazaar.in gift card</small>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
