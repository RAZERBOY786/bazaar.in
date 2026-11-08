import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { GIFT_IMAGES } from '../data/images'

const amounts = [500, 1000, 2000, 5000]
const designs = [
  { id: 'festive', name: 'Festive', image: GIFT_IMAGES.festive, gradient: 'linear-gradient(135deg, #7c2d12, #f59e0b)' },
  { id: 'birthday', name: 'Birthday', image: GIFT_IMAGES.birthday, gradient: 'linear-gradient(135deg, #831843, #f472b6)' },
  { id: 'thankyou', name: 'Thank you', image: GIFT_IMAGES.thankyou, gradient: 'linear-gradient(135deg, #14532d, #4ade80)' },
  { id: 'congrats', name: 'Congratulations', image: GIFT_IMAGES.congrats, gradient: 'linear-gradient(135deg, #1e3a8a, #38bdf8)' },
]

export default function GiftCards() {
  const { pushToast } = useStore()
  const [amount, setAmount] = useState(1000)
  const [design, setDesign] = useState('festive')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')

  const selected = designs.find((d) => d.id === design) || designs[0]

  const addGiftCard = (e) => {
    e.preventDefault()
    pushToast('Gift cards are not available to purchase in this demo', 'info')
  }

  return (
    <div className="page listing-page">
      <div className="container">
        <div className="listing-head">
          <h1>Gift Cards</h1>
          <p className="muted">The perfect gift for any occasion — delivered instantly by email.</p>
        </div>

        <div className="giftcards-layout">
          <section className="card giftcard-preview" style={{ background: selected.gradient }}>
            <span className="giftcard-preview-brand">bazaar.in</span>
            <img className="giftcard-preview-image" src={selected.image} alt="" loading="lazy" decoding="async" />
            <div>
              <span className="giftcard-preview-amount">₹{amount.toLocaleString('en-IN')}</span>
              <span className="giftcard-preview-name">{selected.name} gift card</span>
              {recipient && <span className="giftcard-preview-to">To: {recipient}</span>}
              {message && <span className="giftcard-preview-msg">“{message}”</span>}
            </div>
          </section>

          <form className="card giftcard-form" onSubmit={addGiftCard}>
            <h2>Choose amount</h2>
            <div className="amount-row">
              {amounts.map((a) => (
                <button
                  type="button"
                  key={a}
                  className={`amount-btn ${amount === a ? 'active' : ''}`}
                  onClick={() => setAmount(a)}
                >
                  ₹{a.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <h2>Choose a design</h2>
            <div className="design-row">
              {designs.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  className={`design-btn ${design === d.id ? 'active' : ''}`}
                  onClick={() => setDesign(d.id)}
                  aria-label={d.name}
                >
                  <span style={{ background: d.gradient }}>
                    <img src={d.image} alt="" loading="lazy" decoding="async" />
                  </span>
                  {d.name}
                </button>
              ))}
            </div>

            <label className="field">
              <span>Recipient name (optional)</span>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Sahil"
                maxLength={40}
              />
            </label>
            <label className="field">
              <span>Message (optional)</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal note"
                rows={3}
                maxLength={120}
              />
            </label>

            <button type="submit" className="btn btn-primary giftcard-submit">
              Add gift card — ₹{amount.toLocaleString('en-IN')}
            </button>
            <p className="giftcard-note">Gift cards are delivered by email and never expire.</p>
          </form>
        </div>

        <section className="card coupon-terms">
          <h2>How gift cards work</h2>
          <ul>
            <li>Choose an amount and design, then add a personal message.</li>
            <li>The recipient receives the gift card by email with a redemption code.</li>
            <li>Gift card balances can be used on eligible orders at checkout.</li>
            <li>This is a demo store — gift cards cannot actually be purchased here.</li>
          </ul>
          <Link to="/gift-ideas" className="btn btn-outline">Explore gift ideas</Link>
        </section>
      </div>
    </div>
  )
}
