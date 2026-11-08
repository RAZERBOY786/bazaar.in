import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, search])
  return null
}

export function ToastStack() {
  const { toasts, dismissToast } = useStore()
  if (!toasts.length) return null
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button
          type="button"
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => dismissToast(t.id)}
        >
          <span className="toast-icon">{t.type === 'success' ? '✓' : 'i'}</span>
          <span>{t.message}</span>
        </button>
      ))}
    </div>
  )
}
