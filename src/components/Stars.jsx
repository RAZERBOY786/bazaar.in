export default function Stars({ rating = 0, reviews, size = 14, showValue = true }) {
  return (
    <span className="rating-line" style={{ fontSize: size }}>
      <span className="stars" aria-label={`${rating} out of 5 stars`}>
        <span className="stars-base">★★★★★</span>
        <span className="stars-fill" style={{ width: `${(rating / 5) * 100}%` }}>
          ★★★★★
        </span>
      </span>
      {showValue && <span className="rating-value">{rating.toFixed(1)}</span>}
      {typeof reviews === 'number' && (
        <span className="rating-reviews">{reviews.toLocaleString('en-IN')}</span>
      )}
    </span>
  )
}
