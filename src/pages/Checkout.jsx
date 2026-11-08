import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import AddressForm from '../components/AddressForm'
import Logo from '../components/Logo'
import ProductImage from '../components/ProductImage'
import { CheckIcon, ShieldIcon } from '../components/Icons'
import { inr } from '../lib/format'

const steps = [
  { n: 1, label: 'Address' },
  { n: 2, label: 'Delivery' },
  { n: 3, label: 'Payment' },
  { n: 4, label: 'Review' },
]

const deliveryOptions = [
  { id: 'free', label: 'FREE Delivery', sub: 'Get it in 3-5 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', sub: 'Get it tomorrow by 9 PM', price: 99 },
  { id: 'scheduled', label: 'Scheduled Delivery', sub: 'Pick a convenient 2-hour slot', price: 49 },
]

const banks = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank']

export default function Checkout() {
  const {
    cartItems,
    cartSubtotal,
    cartCount,
    addresses,
    payments,
    addAddress,
    addPayment,
    placeOrder,
    pushToast,
  } = useStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.id || '')
  const [addingAddress, setAddingAddress] = useState(addresses.length === 0)
  const [delivery, setDelivery] = useState('free')
  const [payment, setPayment] = useState(payments.length ? 'saved' : 'upi')
  const [upi, setUpi] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '', save: true })
  const [bank, setBank] = useState('')
  const [emiPlan, setEmiPlan] = useState('')
  const [error, setError] = useState('')
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [placing, setPlacing] = useState(false)

  const deliveryOpt = deliveryOptions.find((d) => d.id === delivery) || deliveryOptions[0]
  const discount = promoApplied ? Math.min(Math.round(cartSubtotal * 0.1), 200) : 0
  const total = Math.max(0, cartSubtotal + deliveryOpt.price - discount)

  const selected = useMemo(
    () => addresses.find((a) => a.id === selectedAddress),
    [addresses, selectedAddress],
  )

  if (cartItems.length === 0 && !placing) {
    return <Navigate to="/cart" replace />
  }

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === 'SAVE10') {
      setPromoApplied(true)
      setPromoError('')
      pushToast('Promo code SAVE10 applied')
    } else {
      setPromoApplied(false)
      setPromoError('That code is not valid. Try SAVE10.')
    }
  }

  const validatePayment = () => {
    if (payment === 'saved') return payments.length > 0
    if (payment === 'upi') return /^[\w.-]+@[\w.-]+$/.test(upi.trim())
    if (payment === 'card') {
      const digits = card.number.replace(/\s/g, '')
      return (
        /^[0-9]{16}$/.test(digits) &&
        card.name.trim().length > 2 &&
        /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(card.expiry.trim()) &&
        /^[0-9]{3,4}$/.test(card.cvv.trim())
      )
    }
    if (payment === 'netbanking') return Boolean(bank)
    if (payment === 'emi') return Boolean(emiPlan)
    return true
  }

  const goNext = () => {
    setError('')
    if (step === 1 && !selectedAddress) {
      setError('Please select or add a delivery address.')
      return
    }
    if (step === 3 && !validatePayment()) {
      setError('Please complete the payment details to continue.')
      return
    }
    setStep((s) => Math.min(4, s + 1))
  }

  const paymentLabel = () => {
    if (payment === 'saved') {
      const p = payments[0]
      return `${p.type} ending ${p.last4}`
    }
    if (payment === 'upi') return `UPI • ${upi}`
    if (payment === 'card') return `Card ending ${card.number.replace(/\s/g, '').slice(-4)}`
    if (payment === 'netbanking') return `Net Banking • ${bank}`
    if (payment === 'emi') return `EMI • ${emiPlan}`
    return 'Cash on Delivery'
  }

  const submitOrder = () => {
    if (!selected) {
      setError('Please select a delivery address.')
      setStep(1)
      return
    }
    if (!validatePayment()) {
      setError('Please complete the payment details.')
      setStep(3)
      return
    }
    setPlacing(true)
    if (payment === 'card' && card.save) {
      addPayment({ type: 'Visa', last4: card.number.replace(/\s/g, '').slice(-4), name: card.name, expiry: card.expiry })
    }
    const order = placeOrder({
      items: cartItems,
      subtotal: cartSubtotal,
      delivery: deliveryOpt.price,
      discount,
      total,
      address: selected,
      payment: paymentLabel(),
      deliveryOption: deliveryOpt.label,
    })
    navigate(`/order-confirmation/${order.id}`)
  }

  return (
    <div className="page checkout-page">
      <div className="checkout-top">
        <div className="container checkout-top-inner">
          <Logo className="checkout-logo" />
          <div className="checkout-secure"><ShieldIcon size={18} /> 100% secure checkout</div>
        </div>
      </div>

      <div className="container">
        <ol className="checkout-steps">
          {steps.map((s) => (
            <li key={s.n} className={`${step === s.n ? 'active' : ''} ${step > s.n ? 'done' : ''}`}>
              <button type="button" onClick={() => step > s.n && setStep(s.n)} disabled={step <= s.n}>
                <span className="step-dot">{step > s.n ? <CheckIcon size={13} /> : s.n}</span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>

        <div className="checkout-layout">
          <div className="checkout-main">
            {step === 1 && (
              <section className="card checkout-box">
                <h1>Select a delivery address</h1>
                <p className="muted">Is the address you&apos;d like to use displayed below? If so, click the &quot;Deliver to this address&quot; button.</p>
                <div className="address-options">
                  {addresses.map((a) => (
                    <label key={a.id} className={`address-card ${selectedAddress === a.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === a.id}
                        onChange={() => setSelectedAddress(a.id)}
                      />
                      <div>
                        <p className="address-name">
                          {a.name} <span className="address-type">{a.type}</span>
                        </p>
                        <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                        <p>{a.city}, {a.state} {a.pincode}</p>
                        <p className="muted">Phone: {a.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {!addingAddress ? (
                  <button type="button" className="link-btn" onClick={() => setAddingAddress(true)}>
                    + Add a new address
                  </button>
                ) : (
                  <div className="new-address">
                    <h2>Add a new address</h2>
                    <AddressForm
                      onSubmit={(a) => {
                        const entry = addAddress(a)
                        setSelectedAddress(entry.id)
                        setAddingAddress(false)
                      }}
                      submitLabel="Deliver to this address"
                    />
                  </div>
                )}
                <div className="checkout-actions">
                  <button type="button" className="btn btn-primary" onClick={goNext}>Deliver to this address</button>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className="card checkout-box">
                <h1>Choose your delivery options</h1>
                {selected && (
                  <p className="deliver-summary">
                    Deliver to <strong>{selected.name}</strong> — {selected.line1}, {selected.city} {selected.pincode}
                  </p>
                )}
                <div className="delivery-options">
                  {deliveryOptions.map((d) => (
                    <label key={d.id} className={`delivery-card ${delivery === d.id ? 'selected' : ''}`}>
                      <input type="radio" name="delivery" checked={delivery === d.id} onChange={() => setDelivery(d.id)} />
                      <div>
                        <p className="delivery-label">{d.label}</p>
                        <p className="muted">{d.sub}</p>
                      </div>
                      <span className={d.price ? 'delivery-price' : 'delivery-price free'}>
                        {d.price ? inr(d.price) : 'FREE'}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="checkout-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={goNext}>Continue</button>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className="card checkout-box">
                <h1>Select a payment method</h1>
                <div className="payment-options">
                  {payments.length > 0 && (
                    <label className={`payment-card ${payment === 'saved' ? 'selected' : ''}`}>
                      <input type="radio" name="payment" checked={payment === 'saved'} onChange={() => setPayment('saved')} />
                      <div>
                        <p className="payment-label">Saved card — {payments[0].type} •••• {payments[0].last4}</p>
                        <p className="muted">{payments[0].name} · Expires {payments[0].expiry}</p>
                      </div>
                    </label>
                  )}

                  <label className={`payment-card ${payment === 'upi' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" checked={payment === 'upi'} onChange={() => setPayment('upi')} />
                    <div className="payment-body">
                      <p className="payment-label">UPI</p>
                      <p className="muted">Pay instantly using any UPI app.</p>
                      {payment === 'upi' && (
                        <input
                          className="inline-input"
                          value={upi}
                          onChange={(e) => setUpi(e.target.value)}
                          placeholder="yourname@upi"
                        />
                      )}
                    </div>
                  </label>

                  <label className={`payment-card ${payment === 'card' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" checked={payment === 'card'} onChange={() => setPayment('card')} />
                    <div className="payment-body">
                      <p className="payment-label">Credit / Debit Card</p>
                      <p className="muted">Visa, Mastercard, RuPay and American Express accepted.</p>
                      {payment === 'card' && (
                        <div className="card-form">
                          <input
                            value={card.number}
                            onChange={(e) => setCard({ ...card, number: e.target.value })}
                            placeholder="Card number"
                            inputMode="numeric"
                            maxLength={19}
                          />
                          <input
                            value={card.name}
                            onChange={(e) => setCard({ ...card, name: e.target.value })}
                            placeholder="Name on card"
                          />
                          <div className="form-row">
                            <input
                              value={card.expiry}
                              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                            <input
                              value={card.cvv}
                              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                              placeholder="CVV"
                              type="password"
                              maxLength={4}
                            />
                          </div>
                          <label className="check">
                            <input
                              type="checkbox"
                              checked={card.save}
                              onChange={(e) => setCard({ ...card, save: e.target.checked })}
                            />
                            <span>Save this card for faster checkout</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className={`payment-card ${payment === 'netbanking' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" checked={payment === 'netbanking'} onChange={() => setPayment('netbanking')} />
                    <div className="payment-body">
                      <p className="payment-label">Net Banking</p>
                      {payment === 'netbanking' && (
                        <select value={bank} onChange={(e) => setBank(e.target.value)}>
                          <option value="">Choose your bank</option>
                          {banks.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      )}
                    </div>
                  </label>

                  <label className={`payment-card ${payment === 'emi' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" checked={payment === 'emi'} onChange={() => setPayment('emi')} />
                    <div className="payment-body">
                      <p className="payment-label">EMI</p>
                      <p className="muted">No cost EMI available on orders above ₹2,000.</p>
                      {payment === 'emi' && (
                        <select value={emiPlan} onChange={(e) => setEmiPlan(e.target.value)}>
                          <option value="">Select a tenure</option>
                          <option value="3 months No Cost EMI">3 months No Cost EMI</option>
                          <option value="6 months No Cost EMI">6 months No Cost EMI</option>
                          <option value="9 months EMI">9 months EMI</option>
                        </select>
                      )}
                    </div>
                  </label>

                  <label className={`payment-card ${payment === 'cod' ? 'selected' : ''}`}>
                    <input type="radio" name="payment" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                    <div>
                      <p className="payment-label">Cash on Delivery</p>
                      <p className="muted">Pay in cash when your order arrives.</p>
                    </div>
                  </label>
                </div>
                <div className="checkout-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={goNext}>Use this payment method</button>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="card checkout-box review-box">
                <h1>Review your order</h1>
                <div className="review-block">
                  <div className="review-block-head">
                    <h2>Shipping address</h2>
                    <button type="button" className="link-btn" onClick={() => setStep(1)}>Change</button>
                  </div>
                  {selected && (
                    <p>
                      {selected.name}<br />
                      {selected.line1}{selected.line2 ? `, ${selected.line2}` : ''}<br />
                      {selected.city}, {selected.state} {selected.pincode}<br />
                      Phone: {selected.phone}
                    </p>
                  )}
                </div>
                <div className="review-block">
                  <div className="review-block-head">
                    <h2>Payment method</h2>
                    <button type="button" className="link-btn" onClick={() => setStep(3)}>Change</button>
                  </div>
                  <p>{paymentLabel()}</p>
                </div>
                <div className="review-block">
                  <div className="review-block-head">
                    <h2>Items and delivery</h2>
                    <button type="button" className="link-btn" onClick={() => setStep(2)}>Change</button>
                  </div>
                  <p className="muted">{deliveryOpt.label} — {deliveryOpt.sub}</p>
                  {cartItems.map(({ product, qty }) => (
                    <div className="review-item" key={product.id}>
                      <ProductImage product={product} className="review-item-img" />
                      <div>
                        <p className="review-item-title">{product.title}</p>
                        <p className="muted">Qty: {qty} · {inr(product.price)}</p>
                        <p className="review-eta">Arriving {product.delivery}</p>
                      </div>
                      <strong>{inr(product.price * qty)}</strong>
                    </div>
                  ))}
                </div>
                {error && <p className="form-error">{error}</p>}
                <button type="button" className="btn btn-primary place-order-btn" onClick={submitOrder}>
                  Place your order
                </button>
                <p className="order-terms">
                  By placing your order, you agree to Bazaar.in&apos;s <Link to="/privacy">privacy notice</Link> and{' '}
                  <Link to="/conditions">conditions of use</Link>.
                </p>
              </section>
            )}

            {error && step !== 4 && <p className="form-error">{error}</p>}
          </div>

          <aside className="checkout-summary card">
            <button type="button" className="summary-toggle" aria-label="Order summary">
              Order Summary
            </button>
            <div className="checkout-summary-inner">
              <div className="summary-items">
                {cartItems.map(({ product, qty }) => (
                  <div className="summary-item" key={product.id}>
                    <ProductImage product={product} className="summary-item-img" />
                    <span className="summary-item-qty">{qty}</span>
                    <span className="summary-item-price">{inr(product.price * qty)}</span>
                  </div>
                ))}
              </div>
              <div className="summary-row">
                <span>Items ({cartCount}):</span>
                <span>{inr(cartSubtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery:</span>
                <span className={deliveryOpt.price ? '' : 'free'}>{deliveryOpt.price ? inr(deliveryOpt.price) : 'FREE'}</span>
              </div>
              {promoApplied && (
                <div className="summary-row discount">
                  <span>Promo (SAVE10):</span>
                  <span>-{inr(discount)}</span>
                </div>
              )}
              <div className="promo-row">
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Promo code" />
                <button type="button" className="btn btn-outline btn-sm" onClick={applyPromo}>Apply</button>
              </div>
              {promoError && <p className="promo-error">{promoError}</p>}
              <div className="summary-row total">
                <span>Order Total:</span>
                <span>{inr(total)}</span>
              </div>
              <p className="summary-note">EMI available. <span className="link">Learn more</span></p>
              {step < 4 ? (
                <button type="button" className="btn btn-primary btn-block" onClick={goNext}>
                  {step === 1 ? 'Use this address' : step === 2 ? 'Continue to payment' : 'Review order'}
                </button>
              ) : (
                <button type="button" className="btn btn-primary btn-block" onClick={submitOrder}>
                  Place your order
                </button>
              )}
              <p className="summary-secure"><ShieldIcon size={15} /> Secure checkout</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
