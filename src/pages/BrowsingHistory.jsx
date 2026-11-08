import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function BrowsingHistory() {
  const { recentItems } = useStore()
  const alsoViewed = products
    .filter((p) => !recentItems.some((r) => r.id === p.id))
    .slice(0, 10)

  return (
    <div className="page listing-page">
      <div className="container">
        <div className="listing-head">
          <h1>Browsing History</h1>
          <p className="muted">
            {recentItems.length
              ? `${recentItems.length} recently viewed ${recentItems.length === 1 ? 'item' : 'items'}`
              : 'Products you view will appear here'}
          </p>
        </div>

        {recentItems.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-emoji">🕘</span>
            <h2>Your browsing history is empty</h2>
            <p>Start exploring products and they will show up here so you can find them again easily.</p>
            <Link to="/" className="btn btn-primary">Start shopping</Link>
          </div>
        ) : (
          <>
            <section className="card deals-section history-section">
              <div className="row-head">
                <h2>Recently viewed</h2>
                <Link to="/" className="see-all">Continue shopping</Link>
              </div>
              <div className="product-grid listing-grid">
                {recentItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            <section className="card deals-section history-section">
              <div className="row-head">
                <div>
                  <h2>Customers who viewed items in your browsing history also viewed</h2>
                  <p className="rail-sub">Page 1 of 6</p>
                </div>
                <Link to="/bestsellers" className="see-all">See more</Link>
              </div>
              <div className="deal-scroll">
                {alsoViewed.map((p) => (
                  <div className="deal-scroll-item" key={`also-${p.id}`}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>

            <section className="card deals-section history-section">
              <div className="row-head">
                <h2>Your browsing history</h2>
                <Link to="/" className="see-all">View or edit your browsing history</Link>
              </div>
              <div className="deal-scroll">
                {recentItems.map((p) => (
                  <div className="deal-scroll-item" key={`history-${p.id}`}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
