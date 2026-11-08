import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="crumb-current">{item.label}</span>}
          {i < items.length - 1 && <span className="crumb-sep">›</span>}
        </span>
      ))}
    </nav>
  )
}
