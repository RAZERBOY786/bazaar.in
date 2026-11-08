import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'
import ProductCard from '../components/ProductCard'
import Stars from '../components/Stars'
import { discountPct, inr } from '../lib/format'

export default function Cart() {
  const {
    user,
    cartItems,
    cartCount,
    cartSubtotal,
    setQty,
    removeFromCart,
    saveForLater,
    recommended,
  } = useStore()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div className="page cart-page">
        <div className="container">
          <div className="empty-cart card">
            <span className="empty-emoji">🛒</span>
            <h1>Your Bazaar.in Cart is empty</h1>
            <p>Your shopping cart is waiting. Give it purpose — fill it with groceries, books, electronics and more.</p>
            <div className="empty-actions">
              <Link to="/deals" className="btn btn-primary">Shop today&apos;s deals</Link>
              <Link to="/" className="btn btn-outline">Continue shopping</Link>
            </div>
            {!user && (
              <p className="empty-signin">
                <Link to="/signin">Sign in</Link> to see your saved cart and recommendations.
              </p>
            )}
          </div>

          <section className="card">
            <div className="row-head">
              <h2>Recommended for you</h2>
              <Link to="/bestsellers" className="see-all">See more</Link>
            </div>
            <div className="product-grid">
              {recommended.slice(0, 5).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="page cart-page">
      <div className="container">
        <div className="cart-layout">
          <section className="cart-main card">
            <div className="cart-head">
              <h1>Shopping Cart</h1>
              <span className="muted">Price</span>
            </div>
            {cartItems.map(({ product, qty }) => {
              const off = discountPct(product.mrp, product.price)
              return (
                <article className="cart-item" key={product.id}>
                  <Link to={`/product/${product.id}`} className="cart-item-img">
                    <ProductImage product={product} />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/product/${product.id}`} className="cart-item-title">{product.title}</Link>
                    <p className="cart-item-stock">In stock</p>
                    <p className="cart-item-prime">
                      {product.prime && <span className="prime-tag">✓prime</span>} FREE delivery {product.delivery}
                    </p>
                    <div className="cart-item-rating">
                      <Stars rating={product.rating} reviews={product.reviews} size={12} />
                    </div>
                    <div className="cart-item-controls">
                      <select value={qty} onChange={(e) => setQty(product.id, e.target.value)} aria-label="Quantity">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <option key={n} value={n}>Qty: {n}</option>
                        ))}
                      </select>
                      <span className="dot">|</span>
                      <button type="button" className="link-btn" onClick={() => removeFromCart(product.id)}>Delete</button>
                      <span className="dot">|</span>
                      <button type="button" className="link-btn" onClick={() => saveForLater(product.id)}>Save for later</button>
                      <span className="dot">|</span>
                      <Link to={`/product/${product.id}`} className="link-btn">See more like this</Link>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    <span className="price">{inr(product.price * qty)}</span>
                    {product.mrp > product.price && (
                      <span className="price-off">-{off}%</span>
                    )}
                  </div>
                </article>
              )
            })}
            <div className="cart-subtotal-line">
              Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'}): <strong>{inr(cartSubtotal)}</strong>
            </div>
          </section>

          <aside className="cart-summary card">
            <div className="cart-summary-inner">
              <p className="cart-free">
                <span>✓</span> Your order qualifies for <strong>FREE Delivery</strong>.
              </p>
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>{inr(cartSubtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Order Total</span>
                <span>{inr(cartSubtotal)}</span>
              </div>
              <label className="gift-check">
                <input type="checkbox" /> This order contains a gift
              </label>
              <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
                Proceed to Buy
              </button>
              <p className="cart-emi">EMI available. <span className="link">Learn more</span></p>
              {!user && (
                <p className="cart-signin">
                  <Link to="/signin">Sign in</Link> to save your cart and checkout faster.
                </p>
              )}
            </div>
          </aside>
        </div>

        <section className="card">
          <div className="row-head">
            <h2>Customers who bought items in your cart also bought</h2>
            <Link to="/bestsellers" className="see-all">See more</Link>
          </div>
          <div className="product-grid">
            {recommended.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
