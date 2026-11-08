import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { discountPct, inr } from '../lib/format'
import ProductImage from './ProductImage'
import Stars from './Stars'

export default function ProductCard({ product, layout = 'grid', sponsored = false }) {
  const { addToCart } = useStore()
  const off = discountPct(product.mrp, product.price)

  return (
    <article className={`pcard pcard-${layout}`}>
      {sponsored && <span className="pcard-sponsored">Sponsored</span>}
      <Link to={`/product/${product.id}`} className="pcard-img-link" aria-label={product.title}>
        <ProductImage product={product} className="pcard-img" alt="" />
        {product.badge && <span className="pcard-badge">{product.badge}</span>}
      </Link>
      <div className="pcard-body">
        <Link to={`/product/${product.id}`} className="pcard-title" title={product.title}>
          {product.title}
        </Link>
        <div className="pcard-brand-line">
          <span className="pcard-brand">{product.brand}</span>
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>
        <div className="pcard-pricing">
          <span className="price">{inr(product.price)}</span>
          {product.mrp > product.price && (
            <>
              <span className="price-mrp">
                M.R.P. <s>{inr(product.mrp)}</s>
              </span>
              <span className="price-off">({off}% off)</span>
            </>
          )}
        </div>
        <div className="pcard-meta">
          {product.prime && <span className="prime-tag">✓prime</span>}
          <span className="pcard-delivery">FREE delivery {product.delivery}</span>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm pcard-add"
          onClick={() => addToCart(product.id)}
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
