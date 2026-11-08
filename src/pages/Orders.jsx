import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import ProductImage from '../components/ProductImage'
import { inr, longDate } from '../lib/format'

const tabs = [
  { id: 'orders', label: 'Orders' },
  { id: 'buyAgain', label: 'Buy Again' },
  { id: 'notShipped', label: 'Not Yet Shipped' },
  { id: 'cancelled', label: 'Cancelled Orders' },
]

export default function Orders() {
  const { orders, addToCart, pushToast } = useStore()
  const [tab, setTab] = useState('orders')
  const navigate = useNavigate()

  const visible = orders.filter((o) => {
    if (tab === 'notShipped') return o.status !== 'Delivered' && o.status !== 'Cancelled'
    if (tab === 'cancelled') return o.status === 'Cancelled'
    return true
  })

  const buyAgain = orders.flatMap((o) => o.items)
  const uniqueBuyAgain = buyAgain.filter((item, i, arr) => arr.findIndex((x) => x.id === item.id) === i)

  const buyAll = (items) => {
    items.forEach((i) => addToCart(i.id, i.qty))
    pushToast('Items added to your cart')
    navigate('/cart')
  }

  return (
    <div className="page orders-page">
      <div className="container">
        <div className="orders-head">
          <h1>Your Orders</h1>
          <Link to="/account" className="link-btn">Your Account</Link>
        </div>

        <div className="orders-tabs">
          {tabs.map((t) => (
            <button
              type="button"
              key={t.id}
              className={tab === t.id ? 'active' : ''}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'buyAgain' ? (
          <section className="card">
            <h2>Buy it again</h2>
            {uniqueBuyAgain.length === 0 ? (
              <div className="empty-state compact">
                <span className="empty-emoji">🔁</span>
                <h3>Nothing to reorder yet</h3>
                <p>Once you place an order, you can easily buy those items again here.</p>
                <Link to="/" className="btn btn-primary">Start shopping</Link>
              </div>
            ) : (
              <div className="buy-again-grid">
                {uniqueBuyAgain.map((item) => {
                  const product = getProduct(item.id)
                  if (!product) return null
                  return (
                    <article className="buy-again-card" key={item.id}>
                      <Link to={`/product/${product.id}`}>
                        <ProductImage product={product} className="buy-again-img" />
                      </Link>
                      <Link to={`/product/${product.id}`} className="buy-again-title">{product.title}</Link>
                      <span className="price">{inr(product.price)}</span>
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product.id)}>
                        Add to cart
                      </button>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        ) : visible.length === 0 ? (
          <div className="empty-state card">
            <span className="empty-emoji">📦</span>
            <h2>No orders in this view</h2>
            <p>Looks like you haven&apos;t placed any orders here yet.</p>
            <Link to="/" className="btn btn-primary">Continue shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {visible.map((order) => (
              <article className="order-card card" key={order.id}>
                <div className="order-head">
                  <div>
                    <span className="order-label">Order placed</span>
                    <span>{longDate(order.date)}</span>
                  </div>
                  <div>
                    <span className="order-label">Total</span>
                    <span>{inr(order.total)}</span>
                  </div>
                  <div>
                    <span className="order-label">Ship to</span>
                    <span>{order.address.name}</span>
                  </div>
                  <div className="order-number">
                    <span className="order-label">Order # {order.id}</span>
                    <Link to={`/orders/${order.id}`} className="link-btn">View order details</Link>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-status-col">
                    <p className={`order-status status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {order.status === 'Delivered'
                        ? `Delivered ${longDate(order.deliveredOn || order.date)}`
                        : order.status === 'Cancelled'
                          ? 'Cancelled'
                          : `Arriving ${longDate(order.expected)}`}
                    </p>
                    <p className="muted">
                      {order.status === 'Delivered'
                        ? 'Your package was delivered.'
                        : order.status === 'Cancelled'
                          ? 'This order was cancelled.'
                          : 'Your order is on the way.'}
                    </p>
                    <div className="order-buttons">
                      {order.status !== 'Cancelled' && (
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate(`/orders/${order.id}`)}>
                          Track package
                        </button>
                      )}
                      <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm">View order details</Link>
                      {order.status === 'Delivered' && (
                        <Link to="/returns" className="btn btn-outline btn-sm">Return or replace items</Link>
                      )}
                    </div>
                  </div>

                  <div className="order-items">
                    {order.items.map((item) => {
                      const product = getProduct(item.id)
                      if (!product) return null
                      return (
                        <div className="order-item" key={item.id}>
                          <Link to={`/product/${product.id}`}>
                            <ProductImage product={product} className="order-item-img" />
                          </Link>
                          <div className="order-item-info">
                            <Link to={`/product/${product.id}`} className="order-item-title">{product.title}</Link>
                            <p className="muted">Qty: {item.qty} · {inr(item.price)}</p>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => buyAll([item])}>
                              Buy it again
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="order-foot">
                  <button type="button" className="link-btn" onClick={() => pushToast('Invoice downloaded (demo)')}>View invoice</button>
                  <button type="button" className="link-btn" onClick={() => buyAll(order.items)}>Buy all again</button>
                  <Link to="/help" className="link-btn">Get help with this order</Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="orders-note">
          Looking for something you bought before? <Link to="/search?q=">Search your orders</Link> or visit your{' '}
          <Link to="/wishlist">Wish List</Link>.
        </p>
      </div>
    </div>
  )
}
