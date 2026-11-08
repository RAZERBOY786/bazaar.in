import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductImage from '../components/ProductImage'
import Stars from '../components/Stars'
import { discountPct, inr } from '../lib/format'

export default function Wishlist() {
  const { wishlistItems, toggleWishlist, addToCart, user } = useStore()

  return (
    <div className="page wishlist-page">
      <div className="container">
        <div className="wishlist-head">
          <div>
            <h1>Your Wish List</h1>
            <p className="muted">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later</p>
          </div>
          <Link to="/account" className="link-btn">Your Account</Link>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-emoji">♡</span>
            <h2>Your Wish List is empty</h2>
            <p>Tap the heart on any product to save it here for later.</p>
            <Link to="/" className="btn btn-primary">Discover products</Link>
            {!user && <p className="empty-signin"><Link to="/signin">Sign in</Link> to keep your wish list across devices.</p>}
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((product) => {
              const off = discountPct(product.mrp, product.price)
              return (
                <article className="wishlist-card card" key={product.id}>
                  <Link to={`/product/${product.id}`}>
                    <ProductImage product={product} className="wishlist-img" />
                  </Link>
                  <Link to={`/product/${product.id}`} className="wishlist-title">{product.title}</Link>
                  <Stars rating={product.rating} reviews={product.reviews} size={12} />
                  <div className="pcard-pricing">
                    <span className="price">{inr(product.price)}</span>
                    {product.mrp > product.price && (
                      <>
                        <span className="price-mrp"><s>{inr(product.mrp)}</s></span>
                        <span className="price-off">({off}% off)</span>
                      </>
                    )}
                  </div>
                  <p className="pcard-delivery">FREE delivery {product.delivery}</p>
                  <div className="wishlist-actions">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product.id)}>
                      Add to cart
                    </button>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => toggleWishlist(product.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <p className="wishlist-note">
          Items on your Wish List are not reserved. <Link to="/cart">Go to cart</Link>
        </p>
      </div>
    </div>
  )
}
