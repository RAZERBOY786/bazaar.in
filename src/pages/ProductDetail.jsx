import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCategory, getProduct, products } from '../data/products'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'
import Stars from '../components/Stars'
import ProductCard from '../components/ProductCard'
import Breadcrumbs from '../components/Breadcrumbs'
import { CheckIcon, ReturnIcon, ShieldIcon, TruckIcon } from '../components/Icons'
import { discountPct, inr, inrDecimal, longDate } from '../lib/format'

const sampleReviews = [
  {
    name: 'Rahul S.',
    rating: 5,
    title: 'Excellent value for money',
    text: 'Really happy with this purchase. The quality is much better than I expected at this price, and delivery was quick. Would definitely recommend it.',
    date: 'Reviewed in India on 12 October 2025',
    helpful: 231,
  },
  {
    name: 'Priya M.',
    rating: 4,
    title: 'Good product, does the job',
    text: 'Works exactly as described. Packaging was neat and it arrived a day early. Taking off one star because the manual could be clearer.',
    date: 'Reviewed in India on 28 September 2025',
    helpful: 118,
  },
  {
    name: 'Arjun K.',
    rating: 5,
    title: 'Would buy again',
    text: 'Second time ordering from this brand and they never disappoint. Build quality feels premium and it has held up well over a month of daily use.',
    date: 'Reviewed in India on 3 September 2025',
    helpful: 87,
  },
]

const distribution = [
  { stars: 5, pct: 62 },
  { stars: 4, pct: 21 },
  { stars: 3, pct: 9 },
  { stars: 2, pct: 4 },
  { stars: 1, pct: 4 },
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id)
  const { addToCart, toggleWishlist, wishlist, viewProduct, pushToast } = useStore()
  const [qty, setQty] = useState(1)
  const [pincode, setPincode] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  useEffect(() => {
    if (product) viewProduct(product.id)
  }, [product, viewProduct])

  const related = useMemo(() => {
    if (!product) return []
    return [
      ...products.filter((p) => p.category === product.category && p.id !== product.id),
      ...products.filter((p) => p.category !== product.category),
    ].slice(0, 5)
  }, [product])

  if (!product) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <span className="empty-emoji">📦</span>
            <h2>We couldn&apos;t find that product</h2>
            <p>The item may have been removed or the link is incorrect.</p>
            <Link to="/" className="btn btn-primary">Continue shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  const off = discountPct(product.mrp, product.price)
  const category = getCategory(product.category)
  const inWishlist = wishlist.includes(product.id)
  const emi = Math.round(product.price / 6)

  const checkPin = (e) => {
    e.preventDefault()
    if (!/^[0-9]{6}$/.test(pincode.trim())) {
      setPinMsg('Please enter a valid 6 digit pincode.')
      return
    }
    setPinMsg(`Delivering to ${pincode} — FREE delivery by ${product.delivery}.`)
  }

  const buyNow = () => {
    addToCart(product.id, qty)
    navigate('/checkout')
  }

  return (
    <div className="page pdp-page">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: category?.name || 'Products', to: `/category/${product.category}` },
            { label: product.sub },
          ]}
        />

        <div className="pdp">
          <div className="pdp-gallery">
            <div className="pdp-thumbs">
              {[0, 1, 2, 3].map((n) => (
                <div key={n} className={`pdp-thumb ${n === 0 ? 'active' : ''}`}>
                  <ProductImage product={{ ...product, tint: shiftTint(product.tint, n) }} />
                </div>
              ))}
            </div>
            <div className="pdp-main-img">
              <ProductImage product={product} />
            </div>
          </div>

          <div className="pdp-info">
            <p className="pdp-brand">
              <Link to={`/search?q=${encodeURIComponent(product.brand)}`}>{product.brand}</Link>
              {product.badge && <span className="pdp-badge">{product.badge}</span>}
            </p>
            <h1>{product.title}</h1>
            <div className="pdp-rating-row">
              <Stars rating={product.rating} reviews={product.reviews} size={16} />
              <a href="#reviews" className="pdp-rating-link">{product.reviews.toLocaleString('en-IN')} ratings</a>
            </div>

            <hr className="divider" />

            <div className="pdp-price-block">
              <span className="pdp-off">{off}% off</span>
              <div className="pdp-price-line">
                <span className="pdp-price">{inr(product.price)}</span>
                <span className="price-mrp">M.R.P.: <s>{inr(product.mrp)}</s></span>
              </div>
              <p className="pdp-tax">Inclusive of all taxes</p>
              <p className="pdp-emi">EMI starts at {inr(emi)}/month. <span className="link">EMI options</span></p>
            </div>

            <div className="pdp-offers">
              <p className="offers-title">Offers</p>
              <div className="offer-row"><span className="offer-tag">Bank Offer</span> 10% instant discount on HDFC Bank Credit Cards, up to ₹1,500</div>
              <div className="offer-row"><span className="offer-tag">Cashback</span> Get 5% cashback on Amazon Pay wallet</div>
              <div className="offer-row"><span className="offer-tag">No Cost EMI</span> Standard EMI plans available on orders above ₹2,000</div>
            </div>

            <div className="pdp-delivery">
              <p className="pdp-label">Delivery</p>
              <form className="pin-form" onSubmit={checkPin}>
                <input
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter delivery pincode"
                  inputMode="numeric"
                  maxLength={6}
                  aria-label="Delivery pincode"
                />
                <button type="submit" className="link-btn">Check</button>
              </form>
              {pinMsg ? (
                <p className="pin-msg">{pinMsg}</p>
              ) : (
                <p className="pin-hint">FREE delivery <strong>{product.delivery}</strong> on orders over ₹499.</p>
              )}
            </div>

            <div className="pdp-usp">
              <span><TruckIcon /> Free delivery</span>
              <span><ReturnIcon /> 10 days replacement</span>
              <span><ShieldIcon /> 1 year warranty</span>
            </div>

            <hr className="divider" />

            <div className="pdp-actions">
              <div className="qty-block">
                <label htmlFor="qty">Quantity</label>
                <select id="qty" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn btn-primary pdp-add" onClick={() => addToCart(product.id, qty)}>
                Add to Cart
              </button>
              <button type="button" className="btn btn-orange pdp-buy" onClick={buyNow}>
                Buy Now
              </button>
            </div>

            <button
              type="button"
              className={`wishlist-toggle ${inWishlist ? 'active' : ''}`}
              onClick={() => toggleWishlist(product.id)}
            >
              {inWishlist ? '♥ Saved to Wish List' : '♡ Add to Wish List'}
            </button>

            <p className="pdp-seller">
              Sold by <strong>RetailNet</strong> and Fulfilled by <strong>Bazaar.in</strong>.
              <span className="link"> See more sellers</span>
            </p>
          </div>

          <aside className="buybox">
            <div className="buybox-inner">
              <div className="buybox-price">
                <span className="pdp-price">{inr(product.price)}</span>
              </div>
              <p className="buybox-delivery">
                FREE delivery <strong>{product.delivery}</strong>
              </p>
              <p className="buybox-stock">{product.stock > 5 ? 'In stock' : `Only ${product.stock} left in stock`}</p>
              <label className="buybox-qty">
                Quantity:
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <button type="button" className="btn btn-primary btn-block" onClick={() => addToCart(product.id, qty)}>
                Add to Cart
              </button>
              <button type="button" className="btn btn-orange btn-block" onClick={buyNow}>
                Buy Now
              </button>
              <label className="buybox-gift">
                <input type="checkbox" /> Add gift wrap — ₹49
              </label>
              <div className="buybox-secure">
                <ShieldIcon size={16} />
                <span>Secure transaction</span>
              </div>
              <div className="buybox-meta">
                <p><span>Ships from</span> Bazaar.in</p>
                <p><span>Sold by</span> RetailNet</p>
                <p><span>Returns</span> 10 days replacement</p>
                <p><span>Payment</span> Secure transaction</p>
              </div>
              <button type="button" className="link-btn" onClick={() => toggleWishlist(product.id)}>
                {inWishlist ? '♥ Remove from Wish List' : '♡ Add to Wish List'}
              </button>
            </div>
            <div className="buybox-prime">
              <span className="prime-tag">✓prime</span>
              <p>Enjoy FREE delivery, exclusive deals and Prime Video.</p>
              <Link to="/prime" className="link">Learn more about Prime</Link>
            </div>
          </aside>
        </div>

        <div className="pdp-sections">
          <section className="card pdp-section">
            <h2>About this item</h2>
            <ul className="about-list">
              {product.features.map((f) => (
                <li key={f}><CheckIcon size={15} /> {f}</li>
              ))}
            </ul>
            <p className="pdp-desc">{product.desc}</p>
          </section>

          <section className="card pdp-section">
            <h2>Product details</h2>
            <table className="spec-table">
              <tbody>
                <tr><th>Brand</th><td>{product.brand}</td></tr>
                <tr><th>Category</th><td>{category?.name}</td></tr>
                <tr><th>Type</th><td>{product.sub}</td></tr>
                <tr><th>Price</th><td>{inrDecimal(product.price)}</td></tr>
                <tr><th>Included</th><td>1 unit, user guide, warranty card</td></tr>
                <tr><th>Warranty</th><td>1 year manufacturer warranty</td></tr>
                <tr><th>Country of Origin</th><td>India</td></tr>
              </tbody>
            </table>
          </section>

          <section className="card pdp-section reviews-section" id="reviews">
            <h2>Customer reviews</h2>
            <div className="review-summary">
              <div className="review-score">
                <Stars rating={product.rating} size={18} showValue={false} />
                <p>{product.rating} out of 5</p>
                <span>{product.reviews.toLocaleString('en-IN')} global ratings</span>
              </div>
              <div className="review-bars">
                {distribution.map((d) => (
                  <div key={d.stars} className="review-bar-row">
                    <span>{d.stars} star</span>
                    <div className="review-bar"><span style={{ width: `${d.pct}%` }} /></div>
                    <span>{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="reviews-list">
              {sampleReviews.map((r) => (
                <article key={r.name} className="review">
                  <div className="review-head">
                    <span className="review-avatar">{r.name.charAt(0)}</span>
                    <span className="review-name">{r.name}</span>
                  </div>
                  <div className="review-stars">
                    <Stars rating={r.rating} size={13} showValue={false} />
                    <strong>{r.title}</strong>
                  </div>
                  <p className="review-date">{r.date}</p>
                  <p className="review-text">{r.text}</p>
                  <div className="review-actions">
                    <span>{r.helpful} people found this helpful</span>
                    <button type="button" className="link-btn">Helpful</button>
                  </div>
                </article>
              ))}
            </div>
            <button type="button" className="btn btn-outline" onClick={() => pushToast('Thanks! Review form is not part of this demo.')}>
              Write a product review
            </button>
          </section>
        </div>

        <section className="card pdp-related">
          <h2>Products related to this item</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <p className="pdp-disclaimer">
          This is a demo store. Product names, brands and images are used for illustration only.
          Ordered on {longDate()} — prices and offers are indicative.
        </p>
      </div>
    </div>
  )
}

function shiftTint([a, b], n) {
  const variants = [
    [a, b],
    ['#ffffff', a],
    [b, a],
    ['#fff7ed', b],
  ]
  return variants[n % variants.length]
}
