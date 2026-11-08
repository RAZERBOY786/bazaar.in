import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import ProductImage from '../components/ProductImage'
import Breadcrumbs from '../components/Breadcrumbs'
import { CheckIcon, ShieldIcon, TruckIcon } from '../components/Icons'
import { inr, longDate } from '../lib/format'

const trackerSteps = ['Ordered', 'Shipped', 'Out for delivery', 'Delivered']

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { orders, addToCart, cancelOrder, pushToast } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state card">
            <span className="empty-emoji">📦</span>
            <h2>Order not found</h2>
            <p>We couldn&apos;t find order {id}.</p>
            <Link to="/orders" className="btn btn-primary">Back to your orders</Link>
          </div>
        </div>
      </div>
    )
  }

  const cancelled = order.status === 'Cancelled'
  const currentIndex = cancelled ? -1 : Math.max(0, trackerSteps.indexOf(order.status))

  const buyAll = () => {
    order.items.forEach((i) => addToCart(i.id, i.qty))
    navigate('/cart')
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id)
    }
  }

  return (
    <div className="page order-detail-page">
      <div className="container">
        <Breadcrumbs items={[{ label: 'Your Orders', to: '/orders' }, { label: order.id }]} />

        <div className="order-detail-head">
          <div>
            <h1>Order details</h1>
            <p className="muted">Ordered on {longDate(order.date)} · Order #{order.id}</p>
          </div>
          <div className="order-detail-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => pushToast('Invoice downloaded (demo)')}>
              View invoice
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={buyAll}>Buy it again</button>
          </div>
        </div>

        {cancelled ? (
          <div className="cancelled-box card">
            <h2>This order was cancelled</h2>
            <p>Any amount paid will be refunded to the original payment method within 3-5 business days.</p>
            <Link to="/" className="btn btn-primary">Continue shopping</Link>
          </div>
        ) : (
          <section className="card tracker-card">
            <div className="tracker-head">
              <div>
                <h2>
                  {order.status === 'Delivered'
                    ? `Delivered on ${longDate(order.deliveredOn || order.date)}`
                    : `Arriving ${longDate(order.expected)}`}
                </h2>
                <p className="muted">{order.deliveryOption} · {order.address.city} {order.address.pincode}</p>
              </div>
              <TruckIcon size={30} />
            </div>
            <div className="tracker">
              {trackerSteps.map((s, i) => (
                <div key={s} className={`tracker-step ${i <= currentIndex ? 'done' : ''} ${i === currentIndex ? 'current' : ''}`}>
                  <span className="tracker-dot">{i <= currentIndex ? <CheckIcon size={13} /> : i + 1}</span>
                  <span className="tracker-label">{s}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="order-detail-grid">
          <div className="order-detail-main">
            <section className="card">
              <div className="card-head-row">
                <h2>Items in this order</h2>
                <span className="muted">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
              </div>
              {order.items.map((item) => {
                const product = getProduct(item.id)
                if (!product) return null
                return (
                  <div className="order-detail-item" key={item.id}>
                    <Link to={`/product/${product.id}`}>
                      <ProductImage product={product} className="order-detail-img" />
                    </Link>
                    <div className="order-detail-info">
                     
                      <Link to={`/product/${product.id}`} className="order-detail-title">{product.title}</Link>
                      <p className="muted">Qty: {item.qty}</p>
                      <p className="order-detail-status">
                        {order.status === 'Delivered' ? 'Delivered' : cancelled ? 'Cancelled' : `Arriving ${longDate(order.expected)}`}
                      </p>
                      <div className="order-detail-item-actions">
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => addToCart(product.id, item.qty)}>
                          Buy it again
                        </button>
                        <Link to={`/product/${product.id}`} className="btn btn-outline btn-sm">View product</Link>
                      </div>
                    </div>
                    <strong className="order-detail-price">{inr(item.price * item.qty)}</strong>
                  </div>
                )
              })}
              <div className="order-detail-buttons">
                {order.status === 'Ordered' && (
                  <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel order</button>
                )}
                {order.status === 'Delivered' && (
                  <Link to="/returns" className="btn btn-outline">Return or replace items</Link>
                )}
                <button type="button" className="btn btn-outline" onClick={buyAll}>Buy all again</button>
                <Link to="/help" className="btn btn-outline">Get help</Link>
              </div>
            </section>

            <section className="card">
              <h2>Delivery and payment</h2>
              <div className="detail-cols">
                <div>
                  <h3>Shipping address</h3>
                  <p>
                    {order.address.name}<br />
                    {order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ''}<br />
                    {order.address.city}, {order.address.state} {order.address.pincode}<br />
                    Phone: {order.address.phone}
                  </p>
                </div>
                <div>
                  <h3>Payment method</h3>
                  <p>{order.payment}</p>
                  <h3>Delivery method</h3>
                  <p>{order.deliveryOption}</p>
                </div>
              </div>
            </section>
          </div>

          <aside className="card order-summary-card">
            <h2>Order summary</h2>
            <div className="summary-row"><span>Items:</span><span>{inr(order.subtotal)}</span></div>
            <div className="summary-row"><span>Delivery:</span><span>{order.delivery ? inr(order.delivery) : 'FREE'}</span></div>
            {order.discount > 0 && <div className="summary-row discount"><span>Promo:</span><span>-{inr(order.discount)}</span></div>}
            <div className="summary-row total"><span>Order Total:</span><span>{inr(order.total)}</span></div>
            <hr className="divider" />
            <p className="summary-secure"><ShieldIcon size={16} /> Secure transaction</p>
            <Link to="/returns" className="link-btn">Return or replace items</Link>
            <Link to="/help" className="link-btn">Need help? Contact us</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
