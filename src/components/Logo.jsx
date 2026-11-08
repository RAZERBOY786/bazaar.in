import { Link } from 'react-router-dom'

export default function Logo({ className = '', ariaLabel = 'Bazaar.in home' }) {
  return (
    <Link to="/" className={`logo ${className}`} aria-label={ariaLabel}>
      <span className="logo-word">
        bazaar<span className="logo-in">.in</span>
      </span>
      <svg className="logo-smile" viewBox="0 0 120 22" aria-hidden="true">
        <path
          d="M4 7c20 13 62 15 92 2"
          fill="none"
          stroke="#ff9900"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M91 3l10 5-8 7"
          fill="none"
          stroke="#ff9900"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  )
}
