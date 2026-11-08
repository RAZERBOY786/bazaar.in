import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { brands, categories, getCategory, products } from '../data/products'
import ProductCard from '../components/ProductCard'
import Breadcrumbs from '../components/Breadcrumbs'
import { inr } from '../lib/format'

const PER_PAGE = 12

const priceRanges = [
  { key: 'under-500', label: 'Under ₹500', min: 0, max: 500 },
  { key: '500-1000', label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { key: '1000-5000', label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { key: '5000-10000', label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { key: '10000-20000', label: '₹10,000 - ₹20,000', min: 10000, max: 20000 },
  { key: 'over-20000', label: 'Over ₹20,000', min: 20000, max: Infinity },
]

const discounts = [10, 25, 50]
const ratings = [4, 3, 2]

export default function ProductList({ mode = 'search' }) {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const urlCategory = params.get('category') || ''
  const category = slug ? getCategory(slug) : null

  const [selectedCats, setSelectedCats] = useState(() => (urlCategory ? [urlCategory] : []))
  const [priceKey, setPriceKey] = useState('')
  const [minRating, setMinRating] = useState(0)
  const [primeOnly, setPrimeOnly] = useState(false)
  const [discountMin, setDiscountMin] = useState(0)
  const [brand, setBrand] = useState('')
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setSelectedCats(urlCategory ? [urlCategory] : [])
    setPage(1)
  }, [urlCategory, slug, q])

  useEffect(() => {
    setPage(1)
  }, [priceKey, minRating, primeOnly, discountMin, brand, sort, selectedCats])

  const base = useMemo(() => {
    if (mode === 'deals') {
      return [...products].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp)
    }
    if (mode === 'bestsellers') {
      return [...products].sort((a, b) => b.reviews - a.reviews)
    }
    if (mode === 'new') {
      return [...products].reverse()
    }
    if (slug) return products.filter((p) => p.category === slug)
    return products
  }, [mode, slug])

  const heading = useMemo(() => {
    if (mode === 'deals') return "Today's Deals"
    if (mode === 'bestsellers') return 'Bestsellers'
    if (mode === 'new') return 'New Releases'
    if (category) return category.name
    if (q) return `Results for “${q}”`
    return 'All products'
  }, [mode, category, q])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = base.filter((p) => {
      if (selectedCats.length && !selectedCats.includes(p.category)) return false
      const range = priceRanges.find((r) => r.key === priceKey)
      if (range && (p.price < range.min || p.price > range.max)) return false
      if (minRating && p.rating < minRating) return false
      if (primeOnly && !p.prime) return false
      if (discountMin && ((p.mrp - p.price) / p.mrp) * 100 < discountMin) return false
      if (brand && p.brand !== brand) return false
      if (term) {
        const hay = `${p.title} ${p.brand} ${p.sub} ${p.category} ${p.desc}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      case 'reviews': list = [...list].sort((a, b) => b.reviews - a.reviews); break
      case 'discount': list = [...list].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp); break
      default: break
    }
    return list
  }, [base, q, selectedCats, priceKey, minRating, primeOnly, discountMin, brand, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)

  const toggleCat = (c) =>
    setSelectedCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const clearAll = () => {
    setSelectedCats([])
    setPriceKey('')
    setMinRating(0)
    setPrimeOnly(false)
    setDiscountMin(0)
    setBrand('')
  }

  const activeCount =
    selectedCats.length + (priceKey ? 1 : 0) + (minRating ? 1 : 0) + (primeOnly ? 1 : 0) + (discountMin ? 1 : 0) + (brand ? 1 : 0)

  const crumbs = [{ label: 'Home', to: '/' }]
  if (category) crumbs.push({ label: category.name })
  else if (q) crumbs.push({ label: 'Search results' })

  return (
    <div className="page listing-page">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <div className="listing-head">
          <h1>{heading}</h1>
          <p className="muted">
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            {q && mode === 'search' ? ` for “${q}”` : ''}
          </p>
        </div>

        <div className="listing">
          <aside className={`filters ${showFilters ? 'open' : ''}`}>
            <div className="filters-head">
              <h2>Filters</h2>
              <button type="button" className="link-btn" onClick={clearAll}>Clear all</button>
            </div>

            {mode === 'search' && !slug && (
              <div className="filter-group">
                <h3>Department</h3>
                <ul className="filter-list">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <label className="check">
                        <input type="checkbox" checked={selectedCats.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
                        <span>{c.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="filter-group">
              <h3>Price</h3>
              <ul className="filter-list">
                {priceRanges.map((r) => (
                  <li key={r.key}>
                    <label className="check">
                      <input
                        type="radio"
                        name="price"
                        checked={priceKey === r.key}
                        onChange={() => setPriceKey(priceKey === r.key ? '' : r.key)}
                      />
                      <span>{r.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Customer review</h3>
              <ul className="filter-list">
                {ratings.map((r) => (
                  <li key={r}>
                    <label className="check">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === r}
                        onChange={() => setMinRating(minRating === r ? 0 : r)}
                      />
                      <span className="stars-inline">★★★★☆ <span className="muted">&amp; up</span></span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Discount</h3>
              <ul className="filter-list">
                {discounts.map((d) => (
                  <li key={d}>
                    <label className="check">
                      <input
                        type="radio"
                        name="discount"
                        checked={discountMin === d}
                        onChange={() => setDiscountMin(discountMin === d ? 0 : d)}
                      />
                      <span>{d}% off or more</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Brand</h3>
              <ul className="filter-list">
                {brands.slice(0, 10).map((b) => (
                  <li key={b}>
                    <label className="check">
                      <input type="radio" name="brand" checked={brand === b} onChange={() => setBrand(brand === b ? '' : b)} />
                      <span>{b}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filter-group">
              <h3>Delivery</h3>
              <label className="check">
                <input type="checkbox" checked={primeOnly} onChange={(e) => setPrimeOnly(e.target.checked)} />
                <span><span className="prime-tag">✓prime</span> Get it by tomorrow</span>
              </label>
            </div>

            <button type="button" className="btn btn-outline filters-apply" onClick={() => setShowFilters(false)}>
              Show results
            </button>
          </aside>

          <section className="listing-main">
            <div className="listing-bar">
              <button type="button" className="btn btn-outline filter-toggle" onClick={() => setShowFilters((v) => !v)}>
                Filters {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
              </button>
              <div className="sort-wrap">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="relevance">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="discount">Highest Discount</option>
                </select>
              </div>
            </div>

            {activeCount > 0 && (
              <div className="active-filters">
                {selectedCats.map((c) => (
                  <button type="button" key={c} className="chip" onClick={() => toggleCat(c)}>
                    {getCategory(c)?.name || c} <span>✕</span>
                  </button>
                ))}
                {priceKey && (
                  <button type="button" className="chip" onClick={() => setPriceKey('')}>
                    {priceRanges.find((r) => r.key === priceKey)?.label} <span>✕</span>
                  </button>
                )}
                {minRating > 0 && (
                  <button type="button" className="chip" onClick={() => setMinRating(0)}>
                    {minRating}★ &amp; up <span>✕</span>
                  </button>
                )}
                {discountMin > 0 && (
                  <button type="button" className="chip" onClick={() => setDiscountMin(0)}>
                    {discountMin}% off+ <span>✕</span>
                  </button>
                )}
                {primeOnly && (
                  <button type="button" className="chip" onClick={() => setPrimeOnly(false)}>
                    Prime <span>✕</span>
                  </button>
                )}
                {brand && (
                  <button type="button" className="chip" onClick={() => setBrand('')}>
                    {brand} <span>✕</span>
                  </button>
                )}
                <button type="button" className="link-btn" onClick={clearAll}>Clear all</button>
              </div>
            )}

            {visible.length === 0 ? (
              <div className="empty-state">
                <span className="empty-emoji">🔍</span>
                <h2>No results found</h2>
                <p>Try checking your spelling, using more general keywords, or removing some filters.</p>
                <div className="empty-actions">
                  <button type="button" className="btn btn-primary" onClick={clearAll}>Clear filters</button>
                  <Link to="/" className="btn btn-outline">Continue shopping</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="product-grid listing-grid">
                  {visible.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {pages > 1 && (
                  <div className="pagination">
                    <button type="button" className="page-btn" disabled={current === 1} onClick={() => setPage(current - 1)}>‹</button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                      <button
                        type="button"
                        key={n}
                        className={`page-btn ${n === current ? 'active' : ''}`}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </button>
                    ))}
                    <button type="button" className="page-btn" disabled={current === pages} onClick={() => setPage(current + 1)}>›</button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        <div className="listing-foot">
          <p>
            Price and delivery information is indicative. Free delivery on eligible orders above {inr(499)}.
          </p>
        </div>
      </div>
    </div>
  )
}
