import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import AddressForm from '../components/AddressForm'
import { CheckIcon, ShieldIcon } from '../components/Icons'
import { longDate } from '../lib/format'

const tabs = [
  { id: 'profile', label: 'Your Account' },
  { id: 'addresses', label: 'Your Addresses' },
  { id: 'payments', label: 'Your Payments' },
  { id: 'security', label: 'Login & Security' },
  { id: 'prime', label: 'Prime' },
]

export default function Account() {
  const { user, signOut, addresses, payments, addAddress, addPayment, updateProfile, pushToast, orders } = useStore()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'profile'

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [addingAddress, setAddingAddress] = useState(false)
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  if (!user) {
    return (
      <div className="page account-page">
        <div className="container">
          <div className="account-guest card">
            <span className="empty-emoji">🔐</span>
            <h1>Sign in to your account</h1>
            <p>Access your orders, addresses, payment methods and personalised recommendations.</p>
            <div className="empty-actions">
              <Link to="/signin" className="btn btn-primary">Sign in</Link>
              <Link to="/register" className="btn btn-outline">Create account</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const setTab = (id) => setParams(id === 'profile' ? {} : { tab: id })

  const saveProfile = (e) => {
    e.preventDefault()
    if (profile.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(profile.email.trim())) {
      pushToast('Enter a valid name and email', 'info')
      return
    }
    updateProfile({ name: profile.name.trim(), email: profile.email.trim() })
  }

  const addCard = (e) => {
    e.preventDefault()
    const digits = newCard.number.replace(/\s/g, '')
    if (!/^[0-9]{16}$/.test(digits) || newCard.name.trim().length < 3 || !/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(newCard.expiry.trim())) {
      pushToast('Enter valid card details', 'info')
      return
    }
    addPayment({ type: 'Visa', last4: digits.slice(-4), name: newCard.name.trim(), expiry: newCard.expiry.trim() })
    setNewCard({ number: '', name: '', expiry: '' })
  }

  const savePassword = (e) => {
    e.preventDefault()
    if (passwords.next.length < 6) return pushToast('New password must be at least 6 characters', 'info')
    if (passwords.next !== passwords.confirm) return pushToast('Passwords do not match', 'info')
    setPasswords({ current: '', next: '', confirm: '' })
    pushToast('Password updated')
  }

  return (
    <div className="page account-page">
      <div className="container">
        <div className="account-head">
          <div>
            <h1>Your Account</h1>
            <p className="muted">Hello, {user.name} · {user.email}</p>
          </div>
          <button type="button" className="link-btn" onClick={signOut}>Sign out</button>
        </div>

        <div className="account-layout">
          <aside className="account-side card">
            <p className="account-side-title">Your Account</p>
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
            <div className="account-side-links">
              <Link to="/orders">Your Orders</Link>
              <Link to="/wishlist">Your Wish List</Link>
              <Link to="/returns">Returns Centre</Link>
              <Link to="/help">Customer Service</Link>
            </div>
          </aside>

          <div className="account-main">
            {tab === 'profile' && (
              <>
                <section className="card account-box">
                  <h2>Login &amp; security</h2>
                  <form onSubmit={saveProfile} className="account-form">
                    <div className="form-row">
                      <label className="field">
                        <span>Name</span>
                        <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                      </label>
                      <label className="field">
                        <span>Email</span>
                        <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary">Save changes</button>
                  </form>
                </section>

                <div className="account-cards">
                  <Link to="/orders" className="account-quick card">
                    <span className="quick-icon">📦</span>
                    <div>
                      <h3>Your Orders</h3>
                      <p>{orders.length} orders placed</p>
                    </div>
                  </Link>
                  <Link to="/wishlist" className="account-quick card">
                    <span className="quick-icon">♡</span>
                    <div>
                      <h3>Wish List</h3>
                      <p>Items saved for later</p>
                    </div>
                  </Link>
                  <button type="button" className="account-quick card" onClick={() => setTab('addresses')}>
                    <span className="quick-icon">📍</span>
                    <div>
                      <h3>Addresses</h3>
                      <p>{addresses.length} saved addresses</p>
                    </div>
                  </button>
                  <button type="button" className="account-quick card" onClick={() => setTab('payments')}>
                    <span className="quick-icon">💳</span>
                    <div>
                      <h3>Payment methods</h3>
                      <p>{payments.length} saved</p>
                    </div>
                  </button>
                </div>

                <section className="card account-box">
                  <h2>Recent order activity</h2>
                  {orders.length === 0 ? (
                    <p className="muted">No orders yet. <Link to="/">Start shopping</Link></p>
                  ) : (
                    orders.slice(0, 3).map((o) => (
                      <div className="activity-row" key={o.id}>
                        <div>
                          <p>Order #{o.id}</p>
                          <span className="muted">Placed on {longDate(o.date)}</span>
                        </div>
                        <span className={`status-pill ${o.status.toLowerCase().replace(/\s+/g, '-')}`}>{o.status}</span>
                        <Link to={`/orders/${o.id}`} className="link-btn">View</Link>
                      </div>
                    ))
                  )}
                </section>
              </>
            )}

            {tab === 'addresses' && (
              <section className="card account-box">
                <div className="card-head-row">
                  <h2>Your Addresses</h2>
                  {!addingAddress && (
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setAddingAddress(true)}>
                      + Add address
                    </button>
                  )}
                </div>
                <div className="address-grid">
                  {addresses.map((a, i) => (
                    <div className="address-tile" key={a.id}>
                      <div className="address-tile-head">
                        <span className="address-type">{a.type}</span>
                        {i === 0 && <span className="default-pill">Default</span>}
                      </div>
                      <p className="address-name">{a.name}</p>
                      <p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                      <p>{a.city}, {a.state} {a.pincode}</p>
                      <p className="muted">Phone: {a.phone}</p>
                      <div className="address-tile-actions">
                        <button type="button" className="link-btn" onClick={() => pushToast('Address editing is not part of this demo.', 'info')}>Edit</button>
                        <button type="button" className="link-btn" onClick={() => pushToast('This is your only demo address.', 'info')}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                {addingAddress && (
                  <div className="account-add-form">
                    <h3>Add a new address</h3>
                    <AddressForm
                      onSubmit={(a) => { addAddress(a); setAddingAddress(false) }}
                      submitLabel="Add address"
                    />
                  </div>
                )}
              </section>
            )}

            {tab === 'payments' && (
              <section className="card account-box">
                <h2>Your Payments</h2>
                <div className="payment-list">
                  {payments.map((p) => (
                    <div className="saved-card" key={p.id}>
                      <span className="saved-card-brand">💳 {p.type}</span>
                      <div>
                        <p>•••• •••• •••• {p.last4}</p>
                        <span className="muted">{p.name} · Expires {p.expiry}</span>
                      </div>
                      <span className="default-pill">Saved</span>
                    </div>
                  ))}
                </div>
                <hr className="divider" />
                <h3>Add a credit or debit card</h3>
                <form className="account-form" onSubmit={addCard}>
                  <label className="field">
                    <span>Card number</span>
                    <input
                      value={newCard.number}
                      onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      inputMode="numeric"
                      maxLength={19}
                    />
                  </label>
                  <div className="form-row">
                    <label className="field">
                      <span>Name on card</span>
                      <input value={newCard.name} onChange={(e) => setNewCard({ ...newCard, name: e.target.value })} />
                    </label>
                    <label className="field">
                      <span>Expiry (MM/YY)</span>
                      <input value={newCard.expiry} onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })} maxLength={5} />
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary">Add card</button>
                </form>
                <p className="secure-note"><ShieldIcon size={16} /> Your payment information is encrypted and secure.</p>
              </section>
            )}

            {tab === 'security' && (
              <section className="card account-box">
                <h2>Login &amp; security</h2>
                <form className="account-form" onSubmit={savePassword}>
                  <label className="field">
                    <span>Current password</span>
                    <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                  </label>
                  <label className="field">
                    <span>New password</span>
                    <input type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} />
                  </label>
                  <label className="field">
                    <span>Re-enter new password</span>
                    <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                  </label>
                  <button type="submit" className="btn btn-primary">Save changes</button>
                </form>
                <hr className="divider" />
                <h3>Two-step verification</h3>
                <p className="muted">Add an extra layer of security to your account with an OTP sent to your phone.</p>
                <button type="button" className="btn btn-outline" onClick={() => pushToast('Two-step verification enabled (demo)')}>
                  Enable two-step verification
                </button>
              </section>
            )}

            {tab === 'prime' && (
              <section className="card account-box prime-box">
                <span className="prime-logo">✓prime</span>
                <h2>Prime membership</h2>
                <p>You are not a Prime member yet. Join Prime to unlock free delivery, Prime Video, Prime Music and more.</p>
                <ul className="prime-perks">
                  <li><CheckIcon size={15} /> Unlimited FREE fast delivery</li>
                  <li><CheckIcon size={15} /> Prime Video, Music and Reading</li>
                  <li><CheckIcon size={15} /> Early access to deals</li>
                  <li><CheckIcon size={15} /> Exclusive Prime-only offers</li>
                </ul>
                <div className="prime-price">₹1,499<span>/year</span></div>
                <button type="button" className="btn btn-primary" onClick={() => pushToast('Prime membership activated (demo)')}>
                  Join Prime
                </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
