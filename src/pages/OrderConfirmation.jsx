import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import ProductImage from '../components/ProductImage'
import { CheckIcon } from '../components/Icons'
import { inr, longDate } from '../lib/format'

export default function OrderConfirmation() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <span className="empty-emoji">📦</span>
            <h2>Order not found</h2>
            <p>We couldn&apos;t find that order. Check your order history instead.</p>
            <Link to="/orders" className="btn btn-primary">Your orders</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page confirmation-page">
      <div className="container narrow">
        <div className="success-box">
          <span className="success-icon"><CheckIcon size={30} /></span>
          <div>
            <h1>Order placed, thank you!</h1>
            <p>Confirmation will be sent to your email address.</p>
          </div>
        </div>

        <div className="delivery-box card">
          <div>
            <p className="delivery-box-label">Delivery estimate</p>
            <h2>{longDate(order.expected)}</h2>
          </div>
          <div className="delivery-box-meta">
            <p>Order number: <strong>{order.id}</strong></p>
            <p>Total: <strong>{inr(order.total)}</strong></p>
          </div>
        </div>

        <div className="confirm-actions">
          <Link to="/" className="btn btn-primary">Continue shopping</Link>
          <Link to={`/orders/${order.id}`} className="btn btn-outline">View order details</Link>
        </div>

        <section className="card confirm-section">
          <h2>Order details</h2>
          <div className="confirm-items">
            {order.items.map((item) => {
              const product = getProduct(item.id)
              if (!product) return null
              return (
                <div className="confirm-item" key={item.id}>
                  <ProductImage product={product} className="confirm-item-img" />
                  <div className="confirm-item-info">
                    <Link to={`/product/${product.id}`} className="confirm-item-title">{product.title}</Link>
                    <p className="muted">Qty: {item.qty}</p>
                    <p className="confirm-status">Arriving {longDate(order.expected)}</p>
                  </div>
                  <strong>{inr(item.price * item.qty)}</strong>
                </div>
              )
            })}
          </div>

          <div className="confirm-cols">
            <div>
              <h3>Shipping address</h3>
              <p>
                {order.address.name}<br />
                {order.address.line1}<br />
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
            <div>
              <h3>Order summary</h3>
              <div className="summary-row"><span>Items:</span><span>{inr(order.subtotal)}</span></div>
              <div className="summary-row"><span>Delivery:</span><span>{order.delivery ? inr(order.delivery) : 'FREE'}</span></div>
              {order.discount > 0 && <div className="summary-row discount"><span>Promo:</span><span>-{inr(order.discount)}</span></div>}
              <div className="summary-row total"><span>Total:</span><span>{inr(order.total)}</span></div>
            </div>
          </div>
        </section>

        <p className="confirm-note">
          Need help? Visit <Link to="/help">Customer Service</Link> or <Link to="/returns">Returns Centre</Link>.
        </p>
      </div>
    </div>
  )
}
