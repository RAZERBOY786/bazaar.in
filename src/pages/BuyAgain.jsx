import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { getProduct, products } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function BuyAgain() {
  const { orders, addToCart } = useStore()
  const seen = new Set()
  const items = orders
    .flatMap((o) => o.items)
    .filter((i) => {
      if (seen.has(i.id)) return false
      seen.add(i.id)
      return true
    })
    .map((i) => getProduct(i.id))
    .filter(Boolean)

  const suggestions = products.filter((p) => !items.some((i) => i.id === p.id)).slice(0, 10)

  const buyAll = () => {
    items.forEach((p) => addToCart(p.id))
  }

  return (
    <div className="page listing-page">
      <div className="container">
        <div className="listing-head">
          <h1>Buy Again</h1>
          <p className="muted">Reorder favourites from your past orders</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-emoji">🔁</span>
            <h2>Nothing to buy again yet</h2>
            <p>Once you place an order, the products you bought will appear here for quick reordering.</p>
            <div className="empty-actions">
              <Link to="/" className="btn btn-primary">Start shopping</Link>
              <Link to="/orders" className="btn btn-outline">Your orders</Link>
            </div>
          </div>
        ) : (
          <section className="card deals-section history-section">
            <div className="row-head">
              <div>
                <h2>Your past purchases</h2>
                <p className="rail-sub">{items.length} {items.length === 1 ? 'product' : 'products'} from your orders</p>
              </div>
              <button type="button" className="btn btn-outline btn-sm" onClick={buyAll}>Buy all again</button>
            </div>
            <div className="product-grid listing-grid">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <section className="card deals-section history-section">
          <div className="row-head">
            <h2>You might also like to try</h2>
            <Link to="/bestsellers" className="see-all">See more</Link>
          </div>
          <div className="deal-scroll">
            {suggestions.map((p) => (
              <div className="deal-scroll-item" key={`suggest-${p.id}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
