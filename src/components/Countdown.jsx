import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

export default function Countdown({ label = 'Deals end in' }) {
  const [left, setLeft] = useState(() => msUntilMidnight())

  useEffect(() => {
    const id = setInterval(() => setLeft(msUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = Math.floor(left / 3600000)
  const minutes = Math.floor((left % 3600000) / 60000)
  const seconds = Math.floor((left % 60000) / 1000)

  return (
    <span className="countdown">
      <span className="countdown-label">{label}</span>
      <span className="countdown-clock">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    </span>
  )
}

function msUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight - now
}
