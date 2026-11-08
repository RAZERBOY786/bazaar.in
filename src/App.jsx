import { useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import { ScrollToTop, ToastStack } from './components/Feedback'
import Home from './pages/Home'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Help from './pages/Help'
import Returns from './pages/Returns'
import BrowsingHistory from './pages/BrowsingHistory'
import BuyAgain from './pages/BuyAgain'
import GiftIdeas from './pages/GiftIdeas'
import Coupons from './pages/Coupons'
import GiftCards from './pages/GiftCards'
import Rufus from './pages/Rufus'
import StaticPage from './pages/StaticPage'
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const authPage = pathname === '/signin' || pathname === '/register'
  const checkoutPage = pathname.startsWith('/checkout')

  useEffect(() => {
    const onKey = (e) => {
      const el = document.activeElement
      const typing =
        el &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)

      if (e.altKey && e.shiftKey) {
        const key = e.key.toLowerCase()
        if (key === 'z' || e.code === 'KeyZ') {
          e.preventDefault()
          setShortcutsOpen((v) => !v)
          return
        }
        if (typing) return
        if (key === 'h' || e.code === 'KeyH') {
          e.preventDefault()
          navigate('/')
        } else if (key === 'o' || e.code === 'KeyO') {
          e.preventDefault()
          navigate('/orders')
        } else if (key === 'c' || e.code === 'KeyC') {
          e.preventDefault()
          navigate('/cart')
        }
        return
      }

      if (e.altKey && (e.key === '/' || e.code === 'Slash')) {
        e.preventDefault()
        document.querySelector('.search-input')?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="app">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <ScrollToTop />
      {!checkoutPage && <Header minimal={authPage} />}
      <main id="main-content" tabIndex={-1} className={authPage ? 'auth-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<ProductList mode="search" />} />
          <Route path="/category/:slug" element={<ProductList mode="category" />} />
          <Route path="/deals" element={<ProductList mode="deals" />} />
          <Route path="/bestsellers" element={<ProductList mode="bestsellers" />} />
          <Route path="/new-releases" element={<ProductList mode="new" />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/browsing-history" element={<BrowsingHistory />} />
          <Route path="/buy-again" element={<BuyAgain />} />
          <Route path="/gift-ideas" element={<GiftIdeas />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/rufus" element={<Rufus />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<Help />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/about" element={<StaticPage page="about" />} />
          <Route path="/careers" element={<StaticPage page="careers" />} />
          <Route path="/privacy" element={<StaticPage page="privacy" />} />
          <Route path="/conditions" element={<StaticPage page="conditions" />} />
          <Route path="/interest-ads" element={<StaticPage page="interest-ads" />} />
          <Route path="/accessibility" element={<StaticPage page="accessibility" />} />
          <Route path="/sell" element={<StaticPage page="sell" />} />
          <Route path="/prime" element={<StaticPage page="prime" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer minimal={authPage} onOpenShortcuts={() => setShortcutsOpen(true)} />
      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ToastStack />
    </div>
  )
}
