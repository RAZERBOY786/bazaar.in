import { useEffect } from 'react'
import { CloseIcon } from './Icons'

const shortcuts = [
  { keys: ['alt', '+', '/'], label: 'Search' },
  { keys: ['shift', '+', 'alt', '+', 'C'], label: 'Cart' },
  { keys: ['shift', '+', 'alt', '+', 'H'], label: 'Home' },
  { keys: ['shift', '+', 'alt', '+', 'O'], label: 'Orders' },
  { keys: ['shift', '+', 'alt', '+', 'Z'], label: 'Show/Hide shortcuts' },
]

export default function KeyboardShortcuts({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('no-scroll')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('no-scroll')
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="shortcuts-overlay" onMouseDown={onClose} role="presentation">
      <div
        className="shortcuts-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="shortcuts-head">
          <h2 id="shortcuts-title">Keyboard shortcuts</h2>
          <button type="button" className="shortcuts-close" onClick={onClose} aria-label="Close keyboard shortcuts">
            <CloseIcon />
          </button>
        </div>
        <p className="shortcuts-intro">Use these shortcuts to move around Bazaar.in faster.</p>
        <ul className="shortcuts-list">
          {shortcuts.map((s) => (
            <li key={s.label} className="shortcut-row">
              <span>{s.label}</span>
              <span className="shortcut-keys">
                {s.keys.map((k, i) =>
                  k === '+' ? (
                    <span key={`${s.label}-sep-${i}`} className="shortcut-sep">+</span>
                  ) : (
                    <kbd key={`${s.label}-${k}`}>{k}</kbd>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="shortcuts-foot">
          To move between items, use your keyboard&apos;s up or down arrows. Press <kbd>Esc</kbd> to close this window.
        </p>
      </div>
    </div>
  )
}
