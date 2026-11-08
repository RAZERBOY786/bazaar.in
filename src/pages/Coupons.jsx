import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'

const coupons = [
  {
    code: 'SAVE10',
    title: '10% instant discount',
    sub: 'Up to ₹200 off on your order',
    detail: 'Apply SAVE10 at checkout. Valid on all products in this demo store.',
    active: true,
  },
  {
    code: 'BANK10',
    title: '10% bank discount',
    sub: 'On select credit and debit cards',
    detail: 'Illustrative bank offer — apply SAVE10 at checkout to see a real discount in this demo.',
    active: false,
  },
  {
    code: 'FREESHIP',
    title: 'Free delivery',
    sub: 'On eligible orders',
    detail: 'Illustrative delivery offer — free delivery is already available on eligible orders.',
    active: false,
  },
  {
    code: 'PRIME5',
    title: 'Extra 5% with Prime',
    sub: 'Prime member exclusive',
    detail: 'Illustrative Prime offer. Join Prime to see member benefits across the store.',
    active: false,
  },
]

export default function Coupons() {
  const { pushToast } = useStore()
  const dealItems = [...products].sort((a, b) => b.rating - a.rating).slice(0, 10)

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      pushToast(`Coupon ${code} copied`)
    } catch {
      pushToast(`Use code ${code} at checkout`, 'info')
    }
  }

  return (
    <div className="page listing-page">
      <div className="container">
        <div className="listing-head">
          <h1>Coupons</h1>
          <p className="muted">Save more with coupons and offers on your next order.</p>
        </div>

        <div className="coupon-grid">
          {coupons.map((c) => (
            <article className={`coupon-card card ${c.active ? 'coupon-active' : ''}`} key={c.code}>
              <div className="coupon-top">
                <span className="coupon-badge">{c.active ? 'Active coupon' : 'Illustrative offer'}</span>
                <span className="coupon-amount">{c.title}</span>
                <p>{c.sub}</p>
              </div>
              <p className="coupon-detail">{c.detail}</p>
              <div className="coupon-foot">
                <code className="coupon-code">{c.code}</code>
                <button
                  type="button"
                  className={`btn btn-sm ${c.active ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => copyCode(c.code)}
                >
                  {c.active ? 'Copy code' : 'View details'}
                </button>
              </div>
            </article>
          ))}
        </div>

        <section className="card deals-section history-section">
          <div className="row-head">
            <div>
              <h2>Deals you can use your coupon on</h2>
              <p className="rail-sub">Apply SAVE10 at checkout for 10% off, capped at ₹200.</p>
            </div>
            <Link to="/deals" className="see-all">See all deals</Link>
          </div>
          <div className="deal-scroll">
            {dealItems.map((p) => (
              <div className="deal-scroll-item" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>

        <section className="card coupon-terms">
          <h2>Coupon terms</h2>
          <ul>
            <li>Only one coupon can be applied per order.</li>
            <li>SAVE10 gives 10% off the order value, capped at ₹200.</li>
            <li>Coupons cannot be exchanged for cash or combined with other coupon codes.</li>
            <li>This is a demo store — offers are illustrative and not affiliated with Amazon.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
