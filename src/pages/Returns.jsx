import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { getProduct } from '../data/products'
import { CheckIcon } from '../components/Icons'

const reasons = [
  'I no longer need this item',
  'Item arrived damaged or defective',
  'Wrong item was delivered',
  'Item does not match the description',
  'Better price available elsewhere',
  'Other reason',
]

const refunds = ['Original payment method', 'Bazaar Pay balance', 'Bank account']

export default function Returns() {
  const { orders } = useStore()
  const [orderId, setOrderId] = useState('')
  const [itemId, setItemId] = useState('')
  const [reason, setReason] = useState('')
  const [comments, setComments] = useState('')
  const [refund, setRefund] = useState(refunds[0])
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const order = orders.find((o) => o.id === orderId)
  const items = order ? order.items : []

  const submit = (e) => {
    e.preventDefault()
    if (!orderId) return setError('Select the order you want to return.')
    if (!itemId) return setError('Select the item you want to return.')
    if (!reason) return setError('Select a reason for the return.')
    setError('')
    const returnId = `RET-${Math.floor(100000 + Math.random() * 900000)}`
    setDone({ returnId, orderId, itemId, reason, refund })
  }

  const reset = () => {
    setDone(null)
    setOrderId('')
    setItemId('')
    setReason('')
    setComments('')
    setRefund(refunds[0])
  }

  return (
    <div className="page returns-page">
      <div className="container">
        <section className="returns-hero">
          <h1>Returns Centre</h1>
          <p>Return or replace items within 10 days of delivery. Most returns are free.</p>
        </section>

        {done ? (
          <div className="returns-success card">
            <span className="empty-emoji">✅</span>
            <h2>Return request placed</h2>
            <p>Your return request <strong>{done.returnId}</strong> has been created. We&apos;ll arrange a pickup within 1-2 business days.</p>
            <div className="return-summary">
              <p><strong>Order:</strong> {done.orderId}</p>
              <p><strong>Item:</strong> {getProduct(done.itemId)?.title}</p>
              <p><strong>Reason:</strong> {done.reason}</p>
              <p><strong>Refund to:</strong> {done.refund}</p>
            </div>
            <div className="empty-actions">
              <Link to="/orders" className="btn btn-primary">Track return in your orders</Link>
              <button type="button" className="btn btn-outline" onClick={reset}>Start another return</button>
            </div>
          </div>
        ) : (
          <div className="returns-layout">
            <section className="card">
              <h2>Start a return or replacement</h2>
              {orders.length === 0 ? (
                <div className="empty-state compact">
                  <span className="empty-emoji">📦</span>
                  <h3>No eligible orders</h3>
                  <p>You can start a return once you have received an order.</p>
                  <Link to="/" className="btn btn-primary">Start shopping</Link>
                </div>
              ) : (
                <form className="returns-form" onSubmit={submit}>
                  <label className="field">
                    <span>Select order</span>
                    <select value={orderId} onChange={(e) => { setOrderId(e.target.value); setItemId('') }}>
                      <option value="">Choose an order</option>
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.id} · {new Date(o.date).toLocaleDateString('en-IN')} · ₹{o.total}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="field">
                    <span>Select item</span>
                    <select value={itemId} onChange={(e) => setItemId(e.target.value)} disabled={!order}>
                      <option value="">{order ? 'Choose an item' : 'Select an order first'}</option>
                      {items.map((i) => {
                        const p = getProduct(i.id)
                        return p ? <option key={i.id} value={i.id}>{p.title.slice(0, 70)} (Qty {i.qty})</option> : null
                      })}
                    </select>
                  </label>

                  <label className="field">
                    <span>Reason for return</span>
                    <select value={reason} onChange={(e) => setReason(e.target.value)}>
                      <option value="">Choose a reason</option>
                      {reasons.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>

                  <label className="field">
                    <span>Refund method</span>
                    <select value={refund} onChange={(e) => setRefund(e.target.value)}>
                      {refunds.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>

                  <label className="field">
                    <span>Additional comments (optional)</span>
                    <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Tell us what went wrong" />
                  </label>

                  {error && <p className="form-error">{error}</p>}

                  <button type="submit" className="btn btn-primary">Submit return request</button>
                  <p className="muted">By submitting, you agree to the <Link to="/conditions">return policy</Link>.</p>
                </form>
              )}
            </section>

            <aside className="card returns-info">
              <h2>Return policy</h2>
              <ul>
                <li><CheckIcon size={15} /> 10 day replacement window for most items</li>
                <li><CheckIcon size={15} /> Free pickup from your delivery address</li>
                <li><CheckIcon size={15} /> Refunds in 3-5 business days after pickup</li>
                <li><CheckIcon size={15} /> Keep the original packaging and accessories</li>
                <li><CheckIcon size={15} /> Some items are non-returnable for hygiene reasons</li>
              </ul>
              <hr className="divider" />
              <h3>Need help?</h3>
              <p className="muted">Our support team can help with returns, replacements and refunds.</p>
              <Link to="/help" className="btn btn-outline btn-sm">Contact customer service</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
