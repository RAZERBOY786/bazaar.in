import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SearchIcon } from '../components/Icons'

export default function NotFound() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const search = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="page">
      <div className="container">
        <div className="notfound">
          <span className="empty-emoji">🐶</span>
          <h1>Sorry! We couldn&apos;t find that page</h1>
          <p>The link may be broken, or the page may have been removed. Try searching instead.</p>
          <form className="help-search notfound-search" onSubmit={search}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Bazaar.in" aria-label="Search" />
            <button type="submit" aria-label="Search"><SearchIcon size={20} /></button>
          </form>
          <div className="notfound-links">
            <Link to="/">Go to homepage</Link>
            <Link to="/deals">Today&apos;s Deals</Link>
            <Link to="/orders">Your Orders</Link>
            <Link to="/help">Customer Service</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
