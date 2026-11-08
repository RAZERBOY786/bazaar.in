import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { categories } from '../data/products'
import { inr } from '../lib/format'
import { CartIcon, ChevronDown, CloseIcon, MenuIcon, PinIcon, SearchIcon } from './Icons'
import Logo from './Logo'

const navLinks = [
  { label: 'Rufus', to: '/rufus' },
  { label: 'Browsing History', to: '/browsing-history' },
  { label: 'Fresh', to: '/category/grocery' },
  { label: 'Grocery & Gourmet Foods', to: '/category/grocery' },
  { label: 'Prime', to: '/prime' },
  { label: "Today's Deals", to: '/deals' },
  { label: 'Coupons', to: '/coupons' },
  { label: 'Gift Cards', to: '/gift-cards' },
  { label: 'Buy Again', to: '/buy-again' },
  { label: 'Gift Ideas', to: '/gift-ideas' },
  { label: 'Customer Service', to: '/help' },
  { label: 'Sell', to: '/sell' },
  { label: 'Mobiles', to: '/category/mobiles' },
  { label: 'Electronics', to: '/category/electronics' },
  { label: 'Bestsellers', to: '/bestsellers' },
  { label: 'New Releases', to: '/new-releases' },
  { label: 'Fashion', to: '/category/fashion' },
  { label: 'Home & Kitchen', to: '/category/home-kitchen' },
  { label: 'Toys', to: '/category/toys' },
]

const departments = [
  { label: 'Mobiles', to: '/category/mobiles', icon: '📱' },
  { label: 'Keep Shopping for', to: '/browsing-history', icon: '👀' },
  { label: 'Electronics', to: '/category/electronics', icon: '🎧' },
  { label: 'AmazonBasics', to: '/search?q=Amazon%20Basics', icon: '📦' },
  { label: 'Subscribe & Save', to: '/category/grocery', icon: '🔁' },
  { label: 'Flights', to: '/help', icon: '✈️' },
  { label: 'Bestsellers', to: '/bestsellers', icon: '🏆' },
  { label: 'New Releases', to: '/new-releases', icon: '🆕' },
  { label: 'Amazon Pay', to: '/account?tab=payments', icon: '💳' },
  { label: 'Books', to: '/category/books', icon: '📚' },
  { label: 'Kindle eBooks', to: '/category/books', icon: '📖' },
  { label: 'Home Improvement', to: '/category/home-kitchen', icon: '🔧' },
  { label: 'Home & Kitchen', to: '/category/home-kitchen', icon: '🍳' },
  { label: 'Fashion', to: '/category/fashion', icon: '👕' },
  { label: 'Health, Household & Personal Care', to: '/category/beauty', icon: '💄' },
  { label: 'Computers', to: '/category/computers', icon: '💻' },
  { label: 'Toys & Games', to: '/category/toys', icon: '🧸' },
  { label: 'Video Games', to: '/category/toys', icon: '🎮' },
  { label: 'Car & Motorbike', to: '/category/appliances', icon: '🚗' },
  { label: 'Jan26_Event', to: '/deals', icon: '🎉' },
]

export default function Header({ minimal = false }) {
  const { user, cartCount, cartSubtotal, signOut, addresses } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [term, setTerm] = useState('')
  const [searchCat, setSearchCat] = useState('all')
  const [drawer, setDrawer] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setTerm(params.get('q') || '')
  }, [location.search])

  useEffect(() => {
    document.body.classList.toggle('no-scroll', drawer)
    return () => document.body.classList.remove('no-scroll')
  }, [drawer])

  const submitSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (term.trim()) params.set('q', term.trim())
    if (searchCat !== 'all') params.set('category', searchCat)
    navigate(`/search?${params.toString()}`)
    setDrawer(false)
  }

  const primaryAddress = addresses[0]
  const deliverName = user ? user.name.split(' ')[0] : 'India'
  const deliverPlace = user && primaryAddress ? `${primaryAddress.city} ${primaryAddress.pincode}` : 'Update location'

  if (minimal) {
    return (
      <header className="auth-header">
        <Logo />
      </header>
    )
  }

  return (
    <>
      <header className="site-header">
        <div className="header-top">
          <div className="header-inner">
            <Logo />

            <Link to="/account?tab=addresses" className="deliver">
              <PinIcon />
              <span className="deliver-text">
                <span className="deliver-small">Deliver to {deliverName}</span>
                <span className="deliver-strong">{deliverPlace}</span>
              </span>
            </Link>

            <form className="search-bar" onSubmit={submitSearch} role="search">
              <div className="search-select-wrap">
                <select
                  aria-label="Search in category"
                  value={searchCat}
                  onChange={(e) => setSearchCat(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={11} />
              </div>
              <input
                id="amz-search-input"
                className="search-input"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Search Bazaar.in"
                aria-label="Search Bazaar.in"
              />
              <button className="search-btn" type="submit" aria-label="Go">
                <SearchIcon size={22} />
              </button>
            </form>

            <div className="header-links">
              <div className="header-link-wrap lang-wrap">
                <button type="button" className="header-link lang">
                  <span className="flag">🇮🇳</span> EN <ChevronDown />
                </button>
                <div className="hover-panel lang-panel">
                  <p className="hover-panel-title">Language</p>
                  <button type="button" className="lang-option active">English - EN</button>
                  <button type="button" className="lang-option">हिन्दी - HI</button>
                  <button type="button" className="lang-option">தமிழ் - TA</button>
                  <button type="button" className="lang-option">తెలుగు - TE</button>
                </div>
              </div>

              <div className="header-link-wrap account-wrap">
                <Link to={user ? '/account' : '/signin'} className="header-link account-link">
                  <span className="header-line-small">
                    {user ? `Hello, ${user.name.split(' ')[0]}` : 'Hello, sign in'}
                  </span>
                  <span className="header-line-big">
                    Account &amp; Lists <ChevronDown />
                  </span>
                </Link>
                <div className="hover-panel account-panel">
                  {user ? (
                    <div className="account-panel-head">
                      <p>Hello, {user.name}</p>
                      <span>{user.email}</span>
                    </div>
                  ) : (
                    <div className="account-panel-head">
                      <Link to="/signin" className="btn btn-primary btn-sm account-signin">
                        Sign in
                      </Link>
                      <p>
                        New customer? <Link to="/register">Start here.</Link>
                      </p>
                    </div>
                  )}
                  <div className="account-panel-cols">
                    <div>
                      <p className="hover-panel-title">Your Lists</p>
                      <Link to="/wishlist">Wish List</Link>
                      <Link to="/wishlist">Shopping List</Link>
                      <Link to="/account">Create a List</Link>
                    </div>
                    <div>
                      <p className="hover-panel-title">Your Account</p>
                      <Link to="/account">Your Account</Link>
                      <Link to="/orders">Your Orders</Link>
                      <Link to="/account?tab=addresses">Your Addresses</Link>
                      <Link to="/wishlist">Your Wish List</Link>
                      <Link to="/browsing-history">Browsing History</Link>
                      <Link to="/prime">Your Prime</Link>
                      {user ? (
                        <button type="button" className="link-btn" onClick={() => { signOut(); navigate('/') }}>
                          Sign out
                        </button>
                      ) : (
                        <Link to="/signin">Sign in</Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/orders" className="header-link returns-link">
                <span className="header-line-small">Returns</span>
                <span className="header-line-big">&amp; Orders</span>
              </Link>

              <Link to="/cart" className="header-link cart-link" aria-label={`Cart with ${cartCount} items`}>
                <span className="cart-icon-wrap">
                  <CartIcon />
                  <span className="cart-count">{cartCount}</span>
                </span>
                <span className="cart-text">
                  <span className="header-line-big">Cart</span>
                  <span className="cart-total">{cartCount > 0 ? inr(cartSubtotal) : ''}</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        <nav className="subnav" aria-label="Departments">
          <div className="subnav-inner">
            <button type="button" className="menu-btn" onClick={() => setDrawer(true)}>
              <MenuIcon />
              <span>All</span>
            </button>
            <div className="subnav-links">
              {navLinks.map((l) => (
                <Link key={l.label} to={l.to} className="subnav-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <div className={`drawer-overlay ${drawer ? 'open' : ''}`} onClick={() => setDrawer(false)} />
      <aside className={`mobile-drawer ${drawer ? 'open' : ''}`} aria-hidden={!drawer}>
        <div className="drawer-head">
          <div className="drawer-user">
            <span className="drawer-avatar">{user ? user.name.charAt(0) : '👤'}</span>
            <span>{user ? `Hello, ${user.name}` : 'Hello, sign in'}</span>
          </div>
          <button type="button" className="drawer-close" onClick={() => setDrawer(false)} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <div className="drawer-section">
          <p className="drawer-title">Shop by Department</p>
          {departments.map((d) => (
            <Link key={d.label} to={d.to} onClick={() => setDrawer(false)}>
              <span className="drawer-emoji">{d.icon}</span> {d.label}
            </Link>
          ))}
        </div>
        <div className="drawer-section">
          <p className="drawer-title">Trending</p>
          <Link to="/rufus" onClick={() => setDrawer(false)}>Rufus — AI shopping assistant</Link>
          <Link to="/bestsellers" onClick={() => setDrawer(false)}>Bestsellers</Link>
          <Link to="/new-releases" onClick={() => setDrawer(false)}>New Releases</Link>
          <Link to="/deals" onClick={() => setDrawer(false)}>Today's Deals</Link>
          <Link to="/coupons" onClick={() => setDrawer(false)}>Coupons</Link>
          <Link to="/gift-cards" onClick={() => setDrawer(false)}>Gift Cards</Link>
          <Link to="/prime" onClick={() => setDrawer(false)}>Prime</Link>
        </div>
        <div className="drawer-section">
          <p className="drawer-title">Help &amp; Settings</p>
          <Link to="/account" onClick={() => setDrawer(false)}>Your Account</Link>
          <Link to="/orders" onClick={() => setDrawer(false)}>Your Orders</Link>
          <Link to="/wishlist" onClick={() => setDrawer(false)}>Your Wish List</Link>
          <Link to="/browsing-history" onClick={() => setDrawer(false)}>Browsing History</Link>
          <Link to="/help" onClick={() => setDrawer(false)}>Customer Service</Link>
          {user ? (
            <button type="button" className="drawer-signout" onClick={() => { signOut(); setDrawer(false); navigate('/') }}>
              Sign out
            </button>
          ) : (
            <Link to="/signin" onClick={() => setDrawer(false)}>Sign in</Link>
          )}
        </div>
      </aside>
    </>
  )
}
