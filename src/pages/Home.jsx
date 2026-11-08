import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, heroSlides, products } from '../data/products'
import { categoryImage, heroImage, MISC_IMAGES } from '../data/images'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import Countdown from '../components/Countdown'
import { ArrowLeft, ArrowRight } from '../components/Icons'

const byCat = (cat, n = 4, skip = 0) => products.filter((p) => p.category === cat).slice(skip, skip + n)
const byIds = (ids) => ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)
const topRated = (n = 10) => [...products].sort((a, b) => b.rating - a.rating).slice(0, n)
const mostReviewed = (n = 10) => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, n)
const biggestDiscount = (n = 10) =>
  [...products].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp).slice(0, n)
const underPrice = (max, n = 10) =>
  products.filter((p) => p.price <= max).sort((a, b) => a.price - b.price).slice(0, n)
const premium = (n = 10) => [...products].sort((a, b) => b.price - a.price).slice(0, n)
const unique = (items) => {
  const seen = new Set()
  return items.filter((p) => {
    if (!p || seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })
}

function TileCard({ title, to, items, linkLabel = 'See all deals' }) {
  return (
    <section className="card home-card">
      <h2>{title}</h2>
      <div className="card-grid">
        {items.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="card-item">
            <ProductImage product={p} className="card-item-img" />
            <span>{p.sub}</span>
          </Link>
        ))}
      </div>
      <Link to={to} className="card-link">{linkLabel}</Link>
    </section>
  )
}

function Rail({ title, sub, items, to, linkLabel = 'See all deals', sponsoredFirst = false }) {
  return (
    <section className="card deals-section home-rail">
      <div className="row-head">
        <div>
          <h2>{title}</h2>
          {sub && <p className="rail-sub">{sub}</p>}
        </div>
        {to && <Link to={to} className="see-all">{linkLabel}</Link>}
      </div>
      <div className="deal-scroll">
        {items.map((p, i) => (
          <div className="deal-scroll-item" key={`${title}-${p.id}`}>
            <ProductCard product={p} sponsored={sponsoredFirst && i === 0} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { user, recentItems, wishlistItems } = useStore()
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5500)
    return () => clearInterval(id)
  }, [])

  const active = heroSlides[slide]

  const dealItems = useMemo(() => biggestDiscount(12), [])
  const topPicks = useMemo(() => products.filter((p) => p.rating >= 4.3).slice(0, 10), [])

  const recentRail = recentItems.length ? recentItems : topRated(10)
  const savedRail = wishlistItems.length ? wishlistItems : topRated(10)
  const historyRail = recentItems.length ? unique([...recentItems, ...byCat('electronics', 6)]) : byCat('electronics', 10)

  const tileRows = [
    [
      { title: 'Fashion & beauty', to: '/category/fashion', items: byCat('fashion', 4) },
      { title: 'Deals on electronics', to: '/category/electronics', items: byCat('electronics', 4) },
      { title: 'Deals on home, kitchen & more', to: '/category/home-kitchen', items: byCat('home-kitchen', 4) },
      { title: 'Deals on Smartphones', to: '/category/mobiles', items: byCat('mobiles', 4) },
    ],
    [
      { title: 'Festive gifting', to: '/gift-ideas', items: byCat('beauty', 4), linkLabel: 'Explore gift ideas' },
      { title: 'Festive deals on Electronics & accessories', to: '/category/electronics', items: byCat('electronics', 4, 2) },
      { title: 'Top deals on smartphones | Up to 40% off', to: '/category/mobiles', items: byCat('mobiles', 4, 1) },
      { title: 'Deals on Amazon Devices', to: '/search?q=Amazon', items: byIds(['echo-dot-5', 'amazon-basics-32-tv', 'apple-20w-adapter', 'boat-rockerz-450']) },
    ],
    [
      { title: 'Wholesale pricing on Electronics + GST credit', to: '/sell', items: byCat('computers', 4), linkLabel: 'Buy for business' },
      { title: 'Sweeten your celebrations!', to: '/category/grocery', items: byCat('grocery', 4) },
      { title: 'Enjoy Prime only offers', to: '/prime', items: byCat('electronics', 4, 1), linkLabel: 'Join Prime now' },
      { title: 'Cool casuals | Min. 60% off', to: '/category/fashion', items: byCat('fashion', 4, 1) },
    ],
    [
      { title: 'Deals on clothing | 50-70% off', to: '/category/fashion', items: byCat('fashion', 4, 2) },
      { title: 'Offers on top brands | Min. 60% off', to: '/category/sports', items: byCat('sports', 4) },
      { title: 'Starting ₹99 | Last chance deals on kitchen finds', to: '/category/home-kitchen', items: byCat('home-kitchen', 4, 1) },
      { title: 'Starting ₹199 | Festive finds from emerging brands', to: '/deals', items: byCat('home-kitchen', 4, 2) },
    ],
    [
      { title: 'Business only deals for you | Under ₹999', to: '/sell', items: underPrice(999, 4), linkLabel: 'Buy for business' },
      { title: 'Under ₹649 | Footwear & handbags', to: '/category/fashion', items: underPrice(649, 4) },
      { title: 'Handpicked sports & fitness products', to: '/category/sports', items: byCat('sports', 4, 1) },
      { title: 'Celebrate in style with products from emerging brands', to: '/category/home-kitchen', items: byCat('home-kitchen', 4, 3) },
    ],
    [
      { title: 'Up to 60% off | The Premium Edit', to: '/bestsellers', items: premium(4) },
      { title: 'Deals on everyday needs', to: '/category/grocery', items: byCat('grocery', 4, 1) },
      { title: 'Deals on fashion, home & more', to: '/deals', items: unique([...byCat('fashion', 2, 3), ...byCat('home-kitchen', 2, 4)]) },
      { title: 'Business only festive deals for you | Under ₹499', to: '/sell', items: underPrice(499, 4), linkLabel: 'Buy for business' },
    ],
  ]

  return (
    <div className="page home-page">
      <section className="hero" aria-label="Featured offers">
        <div className="hero-slide" style={{ background: active.gradient }}>
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-content">
            <span className="hero-eyebrow" style={{ color: active.accent }}>
              <span className="hero-eyebrow-dot" style={{ background: active.accent }} />
              {active.eyebrow}
            </span>
            <h1>{active.title}</h1>
            <p>{active.sub}</p>
            <div className="hero-actions">
              <Link to={active.to} className="btn btn-primary hero-cta">{active.cta}</Link>
              <Link to="/deals" className="hero-secondary">
                Explore all deals <ArrowRight />
              </Link>
            </div>
            <div className="hero-badges">
              <span><b>✓</b> No cost EMI</span>
              <span><b>✓</b> Easy returns</span>
              <span><b>✓</b> Secure payments</span>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <img
              className="hero-image"
              src={heroImage(active.id)}
              alt=""
              loading="eager"
              decoding="async"
            />
            <div className="hero-deal">
              <span className="hero-deal-kicker">Limited period</span>
              <strong>{active.offer}</strong>
              <span className="hero-deal-sub">{active.offerSub}</span>
            </div>
            <span className="hero-sticker">Festival<br />sale</span>
          </div>
          <button type="button" className="hero-arrow left" onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous slide">
            <ArrowLeft />
          </button>
          <button type="button" className="hero-arrow right" onClick={() => setSlide((s) => (s + 1) % heroSlides.length)} aria-label="Next slide">
            <ArrowRight />
          </button>
          <div className="hero-dots">
            {heroSlides.map((s, i) => (
              <button
                type="button"
                key={s.id}
                className={i === slide ? 'active' : ''}
                onClick={() => setSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="home-shell">
        <section className="sponsored-strip" aria-label="Sponsored">
          <div className="sponsored-strip-text">
            <div className="sponsored-topline">
              <span className="sponsored-label">Sponsored</span>
              <span className="sponsored-brand">Bazaar Deals</span>
            </div>
            <h2>Great deals. Great prices.</h2>
            <p>Shop early deals now — up to 70% off across electronics, fashion, home and more.</p>
            <div className="sponsored-actions">
              <Link to="/deals" className="btn btn-primary">Shop early deals</Link>
              <span className="sponsored-offer">Up to 70% off</span>
            </div>
          </div>
          <div className="sponsored-strip-art-wrap" aria-hidden="true">
            <img
              className="sponsored-strip-art"
              src={MISC_IMAGES.shopping}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="sponsored-sticker">70%<small>OFF</small></span>
          </div>
        </section>

        <div className="home-grid">
          <TileCard title="Starting ₹49 | Amazon Fresh" to="/category/grocery" items={byCat('grocery')} />
          <TileCard title="Up to 65% off | Appliances" to="/category/appliances" items={byCat('appliances')} />
          <TileCard title="Best Sellers in Electronics" to="/category/electronics" items={byCat('electronics')} />
          <TileCard title="Fashion picks for you" to="/category/fashion" items={byCat('fashion')} />

          <TileCard title="Upgrade your home" to="/category/home-kitchen" items={byCat('home-kitchen')} />
          <TileCard title="Bestselling books" to="/category/books" items={byCat('books')} />
          <TileCard title="Toys & games for little ones" to="/category/toys" items={byCat('toys')} />
          <section className="card home-card signin-tile">
            <h2>{user ? `Welcome back, ${user.name.split(' ')[0]}` : 'Sign in for your best experience'}</h2>
            <p>
              {user
                ? 'Your recommendations, orders and wish list are all in one place.'
                : 'Get personalised recommendations, save your wish list and track orders.'}
            </p>
            <Link to={user ? '/account' : '/signin'} className="btn btn-primary">
              {user ? 'Go to your account' : 'Sign in securely'}
            </Link>
            <span className="signin-new">
              New to Bazaar.in? <Link to="/register">Create an account</Link>
            </span>
            <img
              className="signin-art"
              src={MISC_IMAGES.gifts}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </section>
        </div>

        <Rail
          title="Keep shopping for"
          sub={recentItems.length ? 'Pick up where you left off' : 'Popular right now'}
          items={recentRail}
          to="/browsing-history"
          linkLabel="View your history"
          sponsoredFirst
        />

        {tileRows[0] && (
          <div className="home-grid">
            {tileRows[0].map((t) => <TileCard key={t.title} {...t} />)}
          </div>
        )}

        <Rail title="Handpicked deals for you" items={dealItems} to="/deals" sponsoredFirst />
        <Rail
          title="Inspired by your recent history"
          sub="More of what you have been looking at"
          items={historyRail}
          to="/browsing-history"
          linkLabel="See more"
        />
        <Rail
          title="On saved items"
          sub={wishlistItems.length ? 'Based on your Wish List' : 'Popular saves this week'}
          items={savedRail}
          to="/wishlist"
          linkLabel="View your Wish List"
        />

        {tileRows[1] && (
          <div className="home-grid">
            {tileRows[1].map((t) => <TileCard key={t.title} {...t} />)}
          </div>
        )}

        <Rail title="Based on your shopping" items={byCat('mobiles', 10)} to="/category/mobiles" />
        <Rail title="Health & Personal Care" items={byCat('beauty', 10)} to="/category/beauty" />
        <Rail title="Trending Deals under ₹999" items={underPrice(999, 10)} to="/deals" />
        <Rail title="Deals with exchange | Up to ₹41,000" items={unique([...byCat('mobiles', 6), ...byCat('appliances', 4)])} to="/category/mobiles" />

        {tileRows[2] && (
          <div className="home-grid">
            {tileRows[2].map((t) => <TileCard key={t.title} {...t} />)}
          </div>
        )}

        <Rail title="Deals on Amazon Devices" items={byIds(['echo-dot-5', 'amazon-basics-32-tv', 'apple-20w-adapter', 'boat-rockerz-450'])} to="/search?q=Amazon" />
        <Rail title="Deals on Toys you may like" items={byCat('toys', 10)} to="/category/toys" />
        <Rail title="Deals on Home and Furniture for you" items={byCat('home-kitchen', 10)} to="/category/home-kitchen" />
        <Rail title="Deals from Amazon Brands & more" items={byIds(['solimo-dinner-set', 'amazon-basics-32-tv', 'echo-dot-5', 'prestige-iris-mixer', 'milton-thermosteel'])} to="/search?q=Amazon" />
        <Rail title="Blockbuster Deals | Up to 70% off" items={biggestDiscount(10)} to="/deals" sponsoredFirst />
        <Rail title="Recommendations on premium collections" items={premium(10)} to="/bestsellers" />

        {tileRows[3] && (
          <div className="home-grid">
            {tileRows[3].map((t) => <TileCard key={t.title} {...t} />)}
          </div>
        )}

        <Rail title="Recommendations on campus essentials" items={unique([...byCat('books', 6), ...byCat('computers', 4)])} to="/category/books" />
        <Rail title="Deals on school essentials" items={byCat('toys', 10)} to="/category/toys" />
        <Rail title="Top deal picks in Computers & Accessories" items={byCat('computers', 10)} to="/category/computers" />
        <Rail title="Recommendations for you" items={byCat('beauty', 10)} to="/category/beauty" />

        {tileRows[4] && (
          <div className="home-grid">
            {tileRows[4].map((t) => <TileCard key={t.title} {...t} />)}
          </div>
        )}

        <Rail title="Computers & Accessories recommendations for you" items={byCat('computers', 10)} to="/category/computers" />
        <Rail title="Electronics & Photo recommendations for you" items={byCat('electronics', 10)} to="/category/electronics" />
        <Rail title="Deals you might like" items={biggestDiscount(10)} to="/deals" />
        <Rail title="Deals you might like in Clothing & Accessories" items={byCat('fashion', 10)} to="/category/fashion" />

        {tileRows[5] && (
          <div className="home-grid">
            {tileRows[5].map((t) => <TileCard key={t.title} {...t} />)}
          </div>
        )}

        <Rail title="Customers' Most-Loved products" items={mostReviewed(10)} to="/bestsellers" />
        <Rail title="Popular this category for Kids" items={byCat('toys', 10)} to="/category/toys" />
        <Rail title="Deals to discover" items={unique([...byCat('mobiles', 6), ...byCat('fashion', 4)])} to="/deals" />
        <Rail title="Deals on daily needs" items={byCat('grocery', 10)} to="/category/grocery" />
        <Rail title="More deals to consider" items={biggestDiscount(10)} to="/deals" />
        <Rail title="Deals ending soon" items={biggestDiscount(10)} to="/deals" />

        <section className="card deals-section home-rail">
          <div className="row-head">
            <div>
              <h2>Customers who viewed items in your browsing history also viewed</h2>
              <p className="rail-sub">Page 1 of 6</p>
            </div>
            <Link to="/browsing-history" className="see-all">View your history</Link>
          </div>
          <div className="deal-scroll">
            {topRated(10).map((p) => (
              <div className="deal-scroll-item" key={`also-${p.id}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        <section className="card deals-section home-rail">
          <div className="row-head">
            <div>
              <h2>Your browsing history</h2>
              <p className="rail-sub">{recentItems.length ? 'Page 1 of 5' : 'Start browsing to see your history here'}</p>
            </div>
            <Link to="/browsing-history" className="see-all">View or edit your browsing history</Link>
          </div>
          {recentItems.length ? (
            <div className="deal-scroll">
              {recentItems.map((p) => (
                <div className="deal-scroll-item" key={`history-${p.id}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rail-empty-card">
              <span aria-hidden="true">🕘</span>
              <p>Products you view will appear here so you can easily find them again.</p>
              <Link to="/" className="btn btn-outline btn-sm">Keep shopping</Link>
            </div>
          )}
        </section>

        <section className="card deals-section home-rail">
          <div className="row-head">
            <div>
              <h2>Deals of the day</h2>
              <Countdown />
            </div>
            <Link to="/deals" className="see-all">See all deals</Link>
          </div>
          <div className="deal-scroll">
            {dealItems.map((p) => (
              <div className="deal-scroll-item" key={`dotd-${p.id}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        <section className="card cat-strip">
          <h2>Shop by category</h2>
          <div className="cat-circles">
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="cat-circle">
                <span className="cat-circle-icon">
                  <img src={categoryImage(c.slug)} alt="" loading="lazy" decoding="async" />
                </span>
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="card picks-section">
          <div className="row-head">
            <h2>Top picks for you</h2>
            <Link to="/bestsellers" className="see-all">See more</Link>
          </div>
          <div className="product-grid">
            {topPicks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <section className="card banner-card">
          <div className="banner-text">
            <h2>Save more with Amazon Pay</h2>
            <p>Get instant discounts, cashback and no cost EMI on thousands of products.</p>
            <Link to="/deals" className="btn btn-primary">Explore offers</Link>
          </div>
          <img
            className="banner-art"
            src={MISC_IMAGES.payment}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </section>

        <section className="signin-banner">
          <div>
            <h2>{user ? `Recommended for you, ${user.name.split(' ')[0]}` : 'See personalised recommendations'}</h2>
            <p>
              {user
                ? 'Pick up where you left off and discover more of what you love.'
                : 'Sign in to your Bazaar.in account to see your recommendations, orders and more.'}
            </p>
          </div>
          <Link to={user ? '/account' : '/signin'} className="btn btn-primary">
            {user ? 'Your account' : 'Sign in'}
          </Link>
        </section>

        <div className="home-trust">
          <span>✓ 100% Purchase Protection</span>
          <span>✓ Easy returns within 10 days</span>
          <span>✓ Free delivery on eligible orders</span>
          <span>✓ Secure transactions</span>
        </div>
      </div>
    </div>
  )
}
