import { useState } from 'react'
import { productImage } from '../data/images'

export default function ProductImage({
  product,
  className = '',
  showBrand = false,
  alt,
  eager = false,
}) {
  const src = productImage(product)
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = failedSrc === src

  return (
    <div
      className={`pimg ${className}`}
      style={{ background: `linear-gradient(135deg, ${product.tint[0]}, ${product.tint[1]})` }}
    >
      {!failed && (
        <img
          src={src}
          alt={alt ?? product.title ?? product.sub ?? ''}
          className="pimg-photo"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedSrc(src)}
        />
      )}
      {failed && (
        <>
          <span className="pimg-ring pimg-ring-a" aria-hidden="true" />
          <span className="pimg-ring pimg-ring-b" aria-hidden="true" />
          <span className="pimg-emoji" role="img" aria-label={product.sub}>
            {product.icon}
          </span>
        </>
      )}
      {showBrand && <span className="pimg-brand">{product.brand}</span>}
    </div>
  )
}
