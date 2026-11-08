import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getProduct, products } from '../data/products'
import { makeOrderId } from '../lib/format'

const StoreContext = createContext(null)
const LS_KEY = 'amazonin-clone-v1'

const readStorage = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {}
  } catch {
    return {}
  }
}

const demoAddress = {
  id: 'addr-demo',
  name: 'Sahil',
  phone: '98765 43210',
  pincode: '700124',
  line1: 'Barasat, North 24 Parganas',
  city: 'Barasat',
  state: 'West Bengal',
  type: 'Home',
}

const seedOrders = () => [
  {
    id: '402-1183421-7734901',
    date: new Date(Date.now() - 6 * 864e5).toISOString(),
    items: [
      { id: 'boat-rockerz-450', qty: 1, price: 1299 },
      { id: 'milton-thermosteel', qty: 2, price: 799 },
    ],
    subtotal: 2897,
    delivery: 0,
    total: 2897,
    status: 'Delivered',
    payment: 'UPI • demo@upi',
    address: demoAddress,
    deliveryOption: 'FREE Delivery',
    deliveredOn: new Date(Date.now() - 2 * 864e5).toISOString(),
  },
  {
    id: '404-9932014-1188203',
    date: new Date(Date.now() - 2 * 864e5).toISOString(),
    items: [
      { id: 'atomic-habits', qty: 1, price: 399 },
      { id: 'echo-dot-5', qty: 1, price: 4499 },
    ],
    subtotal: 4898,
    delivery: 0,
    total: 4898,
    status: 'Shipped',
    payment: 'Visa ending 4242',
    address: demoAddress,
    deliveryOption: 'FREE Delivery',
    expected: new Date(Date.now() + 2 * 864e5).toISOString(),
  },
]

export function StoreProvider({ children }) {
  const [saved] = useState(readStorage)

  const [user, setUser] = useState(saved.user ?? null)
  const [cart, setCart] = useState(saved.cart ?? [])
  const [wishlist, setWishlist] = useState(saved.wishlist ?? [])
  const [orders, setOrders] = useState(saved.orders ?? seedOrders())
  const [addresses, setAddresses] = useState(saved.addresses ?? [demoAddress])
  const [payments, setPayments] = useState(
    saved.payments ?? [{ id: 'pay-demo', type: 'Visa', last4: '4242', name: 'Sahil', expiry: '09/29' }],
  )
  const [recentlyViewed, setRecentlyViewed] = useState(saved.recentlyViewed ?? [])
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const payload = { user, cart, wishlist, orders, addresses, payments, recentlyViewed }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload))
    } catch {
      /* storage full or blocked - ignore */
    }
  }, [user, cart, wishlist, orders, addresses, payments, recentlyViewed])

  const pushToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToCart = useCallback(
    (id, qty = 1) => {
      const product = getProduct(id)
      if (!product) return
      setCart((prev) => {
        const found = prev.find((i) => i.id === id)
        if (found) {
          return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(10, i.qty + qty) } : i))
        }
        return [...prev, { id, qty }]
      })
      pushToast(`Added to Cart: ${product.title.slice(0, 42)}...`)
    },
    [pushToast],
  )

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const setQty = useCallback((id, qty) => {
    const n = Math.max(1, Math.min(10, Number(qty) || 1))
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: n } : i)))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const saveForLater = useCallback(
    (id) => {
      setWishlist((prev) => (prev.includes(id) ? prev : [id, ...prev]))
      setCart((prev) => prev.filter((i) => i.id !== id))
      pushToast('Moved to Wish List')
    },
    [pushToast],
  )

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((prev) => {
        if (prev.includes(id)) {
          pushToast('Removed from Wish List', 'info')
          return prev.filter((x) => x !== id)
        }
        pushToast('Added to Wish List')
        return [id, ...prev]
      })
    },
    [pushToast],
  )

  const signIn = useCallback(
    (email, name) => {
      const fallback = email ? email.split('@')[0].replace(/[._-]+/g, ' ') : 'Demo Customer'
      const displayName = (name || fallback)
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
      const next = { name: displayName || 'Demo Customer', email: email || 'demo@bazaar.in' }
      setUser(next)
      pushToast(`Hello, ${next.name}`)
      return next
    },
    [pushToast],
  )

  const signOut = useCallback(() => {
    setUser(null)
    pushToast('You have signed out', 'info')
  }, [pushToast])

  const updateProfile = useCallback(
    (patch) => {
      setUser((prev) => (prev ? { ...prev, ...patch } : prev))
      pushToast('Your profile has been updated')
    },
    [pushToast],
  )

  const addAddress = useCallback(
    (address) => {
      const entry = { ...address, id: `addr-${Date.now()}` }
      setAddresses((prev) => [...prev, entry])
      pushToast('Address saved')
      return entry
    },
    [pushToast],
  )

  const addPayment = useCallback(
    (method) => {
      const entry = { ...method, id: `pay-${Date.now()}` }
      setPayments((prev) => [...prev, entry])
      pushToast('Payment method saved')
      return entry
    },
    [pushToast],
  )

  const placeOrder = useCallback(
    ({ items, subtotal, delivery, total, address, payment, deliveryOption, discount = 0 }) => {
      const order = {
        id: makeOrderId(),
        date: new Date().toISOString(),
        items: items.map((i) => ({ id: i.id, qty: i.qty, price: i.price })),
        subtotal,
        delivery,
        discount,
        total,
        status: 'Ordered',
        payment,
        address,
        deliveryOption,
        expected: new Date(Date.now() + (deliveryOption === 'Express Delivery' ? 1 : 3) * 864e5).toISOString(),
      }
      setOrders((prev) => [order, ...prev])
      setCart([])
      pushToast('Order placed successfully')
      return order
    },
    [pushToast],
  )

  const cancelOrder = useCallback(
    (id) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o)),
      )
      pushToast('Order cancelled. Refund will be processed in 3-5 days.', 'info')
    },
    [pushToast],
  )

  const viewProduct = useCallback((id) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 12))
  }, [])

  const cartItems = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: getProduct(i.id) }))
        .filter((i) => i.product),
    [cart],
  )

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart])
  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    [cartItems],
  )

  const wishlistItems = useMemo(
    () => wishlist.map((id) => getProduct(id)).filter(Boolean),
    [wishlist],
  )

  const recentItems = useMemo(
    () => recentlyViewed.map((id) => getProduct(id)).filter(Boolean),
    [recentlyViewed],
  )

  const recommended = useMemo(
    () => products.filter((p) => !cart.some((c) => c.id === p.id)).slice(0, 10),
    [cart],
  )

  const value = {
    user,
    cart,
    cartItems,
    cartCount,
    cartSubtotal,
    wishlist,
    wishlistItems,
    orders,
    addresses,
    payments,
    recentlyViewed,
    recentItems,
    recommended,
    toasts,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    saveForLater,
    toggleWishlist,
    signIn,
    signOut,
    updateProfile,
    addAddress,
    addPayment,
    placeOrder,
    cancelOrder,
    viewProduct,
    pushToast,
    dismissToast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
