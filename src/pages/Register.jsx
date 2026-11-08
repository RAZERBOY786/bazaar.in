import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Register() {
  const { signIn, pushToast } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const refs = useRef([])

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const submitDetails = (e) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return setError('Enter your name.')
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return setError('Enter a valid email address.')
    if (form.password.length < 6) return setError('Passwords must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')
    setError('')
    setStep(2)
    pushToast('Verification code sent (demo: any 6 digits)', 'info')
  }

  const setDigit = (i, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    setOtp((prev) => {
      const next = [...prev]
      next[i] = digit
      return next
    })
    if (digit && i < 5) refs.current[i + 1]?.focus()
  }

  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const verify = (e) => {
    e.preventDefault()
    if (otp.some((d) => !d)) {
      setError('Enter the 6 digit verification code.')
      return
    }
    signIn(form.email.trim(), form.name.trim())
    navigate('/')
  }

  return (
    <div className="page auth-page">
      <div className="auth-wrap">
        <div className="auth-card">
          {step === 1 ? (
            <form onSubmit={submitDetails} noValidate>
              <h1>Create account</h1>
              <label className="auth-field">
                <span>Your name</span>
                <input value={form.name} onChange={set('name')} autoComplete="name" autoFocus />
              </label>
              <label className="auth-field">
                <span>Email</span>
                <input value={form.email} onChange={set('email')} autoComplete="email" />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input type="password" value={form.password} onChange={set('password')} placeholder="At least 6 characters" autoComplete="new-password" />
              </label>
              <label className="auth-field">
                <span>Re-enter password</span>
                <input type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block">Continue</button>
              <p className="auth-terms">
                By creating an account, you agree to Bazaar.in&apos;s <Link to="/conditions">Conditions of Use</Link> and{' '}
                <Link to="/privacy">Privacy Notice</Link>.
              </p>
              <div className="auth-divider"><span>Already have an account?</span></div>
              <Link to="/signin" className="btn btn-outline btn-block">Sign in</Link>
            </form>
          ) : (
            <form onSubmit={verify} noValidate>
              <h1>Verify email</h1>
              <p className="auth-sub">
                To verify your email, we&apos;ve sent a one-time password to <strong>{form.email}</strong>.
              </p>
              <div className="otp-row">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { refs.current[i] = el }}
                    value={digit}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Digit ${i + 1}`}
                  />
                ))}
              </div>
              {error && <p className="form-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block">Create your Bazaar.in account</button>
              <button
                type="button"
                className="link-btn auth-forgot"
                onClick={() => pushToast('A new code has been sent (demo)', 'info')}
              >
                Resend OTP
              </button>
              <p className="demo-hint-inline">Demo: any 6 digits will work.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
