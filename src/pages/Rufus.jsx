import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import ProductImage from '../components/ProductImage'

const suggestions = [
  'Find a gift under ₹999',
  'Best headphones right now',
  'Track my order',
  "What's on sale today?",
]

const dealItems = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3)

function replyFor(text) {
  const t = text.toLowerCase()
  if (t.includes('gift') || t.includes('present')) {
    return {
      text: 'Great choice! Here are some handpicked gift ideas across budgets. You can filter by price and occasion.',
      links: [
        { label: 'Gift Ideas', to: '/gift-ideas' },
        { label: 'Gift Cards', to: '/gift-cards' },
      ],
    }
  }
  if (t.includes('headphone') || t.includes('earphone') || t.includes('audio')) {
    return {
      text: 'For headphones, boAt Rockerz 450 is a popular budget pick, while Sony WH-CH520 adds longer battery life and a lighter build.',
      links: [
        { label: 'boAt Rockerz 450', to: '/product/boat-rockerz-450' },
        { label: 'Sony WH-CH520', to: '/product/sony-wh-ch520' },
        { label: 'All electronics', to: '/category/electronics' },
      ],
    }
  }
  if (t.includes('order') || t.includes('track') || t.includes('delivery')) {
    return {
      text: 'You can see live status, delivery dates and invoices in Your Orders. Open an order to track it step by step.',
      links: [
        { label: 'Your Orders', to: '/orders' },
        { label: 'Returns Centre', to: '/returns' },
      ],
    }
  }
  if (t.includes('deal') || t.includes('sale') || t.includes('offer') || t.includes('discount')) {
    return {
      text: 'Today’s Deals has limited-time discounts across electronics, fashion, home and more. Coupon SAVE10 gives an extra 10% off at checkout, capped at ₹200.',
      links: [
        { label: "Today's Deals", to: '/deals' },
        { label: 'Coupons', to: '/coupons' },
      ],
    }
  }
  if (t.includes('phone') || t.includes('mobile')) {
    return {
      text: 'The Mobiles store has the latest 5G phones with exchange offers and no cost EMI. Tell me a budget and I can point you to a few options.',
      links: [
        { label: 'Shop mobiles', to: '/category/mobiles' },
        { label: 'Bestselling phones', to: '/bestsellers' },
      ],
    }
  }
  return {
    text: 'I can help you discover products, compare options, find deals and track orders. Try one of the suggestions below, or search for a product you have in mind.',
    links: [
      { label: 'Start shopping', to: '/' },
      { label: "Today's Deals", to: '/deals' },
      { label: 'Customer Service', to: '/help' },
    ],
  }
}

export default function Rufus() {
  const { user } = useStore()
  const [messages, setMessages] = useState(() => [
    {
      id: 1,
      role: 'bot',
      text: `Hi${user ? `, ${user.name.split(' ')[0]}` : ''}! I’m Rufus, your AI shopping assistant. Ask me about products, deals, gifts or orders.`,
      links: [],
    },
  ])
  const [input, setInput] = useState('')
  const nextId = useRef(2)
  const endRef = useRef(null)

  useEffect(() => {
    if (messages.length > 1) {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [messages])

  const send = (value) => {
    const clean = value.trim()
    if (!clean) return
    const reply = replyFor(clean)
    setMessages((prev) => [
      ...prev,
      { id: nextId.current++, role: 'user', text: clean, links: [] },
      { id: nextId.current++, role: 'bot', ...reply },
    ])
    setInput('')
  }

  const submit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="page rufus-page">
      <div className="container">
        <div className="rufus-layout">
          <section className="card rufus-chat" aria-label="Rufus chat">
            <div className="rufus-chat-head">
              <span className="rufus-avatar" aria-hidden="true">✦</span>
              <div>
                <h1>Rufus</h1>
                <p>AI shopping assistant — demo responses</p>
              </div>
            </div>

            <div className="rufus-messages" aria-live="polite">
              {messages.map((m) => (
                <div key={m.id} className={`rufus-msg ${m.role}`}>
                  <span className="rufus-msg-avatar" aria-hidden="true">{m.role === 'bot' ? '✦' : '🙂'}</span>
                  <div className="rufus-bubble">
                    <p>{m.text}</p>
                    {m.links?.length > 0 && (
                      <div className="rufus-links">
                        {m.links.map((l) => (
                          <Link key={l.label} to={l.to}>{l.label}</Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="rufus-suggestions">
              {suggestions.map((s) => (
                <button key={s} type="button" className="rufus-suggestion" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>

            <form className="rufus-form" onSubmit={submit}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Rufus anything about shopping…"
                aria-label="Ask Rufus"
              />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </section>

          <aside className="rufus-side">
            <section className="card">
              <h2>Rufus can help with</h2>
              <div className="rufus-tip"><span aria-hidden="true">🔎</span><p>Finding products by budget, brand or use case.</p></div>
              <div className="rufus-tip"><span aria-hidden="true">⚖️</span><p>Comparing features and prices before you buy.</p></div>
              <div className="rufus-tip"><span aria-hidden="true">🏷️</span><p>Discovering deals, coupons and bank offers.</p></div>
              <div className="rufus-tip"><span aria-hidden="true">📦</span><p>Tracking orders and understanding returns.</p></div>
            </section>

            <section className="card">
              <h2>Popular right now</h2>
              <div className="rufus-deal-list">
                {dealItems.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="rufus-deal">
                    <ProductImage product={p} className="rufus-deal-img" />
                    <span>{p.title}</span>
                  </Link>
                ))}
              </div>
              <Link to="/deals" className="btn btn-outline btn-sm rufus-deals-btn">See all deals</Link>
            </section>

            <p className="rufus-note">Rufus is a demo assistant. Responses are canned and no data leaves your browser.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}
