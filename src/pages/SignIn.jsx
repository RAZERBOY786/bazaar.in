import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { ShieldIcon } from '../components/Icons'

export default function SignIn() {
  const { user, signIn, signOut, pushToast } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const value = email.trim()
    const isEmail = /^\S+@\S+\.\S+$/.test(value)
    const isPhone = /^[0-9]{10}$/.test(value.replace(/\s/g, ''))
    if (!value || (!isEmail && !isPhone)) {
      setError('Enter a valid email address or 10 digit mobile number.')
      return
    }
    if (password.length < 4) {
      setError('Your password must be at least 4 characters.')
      return
    }
    signIn(email.trim())
    navigate(from, { replace: true })
  }

  return (
    <div className="page auth-page">
      <div className="auth-wrap">
        {user && (
          <div className="auth-signedin">
            <p>You are signed in as <strong>{user.name}</strong> ({user.email}).</p>
            <div>
              <button type="button" className="link-btn" onClick={() => navigate('/account')}>Go to account</button>
              <span className="dot">·</span>
              <button type="button" className="link-btn" onClick={signOut}>Sign out</button>
            </div>
          </div>
        )}

        <form className="auth-card" onSubmit={submit} noValidate>
          <h1>Sign in</h1>

          <label className="auth-field">
            <span>Email or mobile phone number</span>
            <input
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              autoComplete="username"
              autoFocus
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <div className="password-wrap">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                autoComplete="current-password"
              />
              <button type="button" className="password-toggle" onClick={() => setShow((v) => !v)}>
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn-primary btn-block">Sign in</button>

          <p className="auth-terms">
            By continuing, you agree to Bazaar.in&apos;s <Link to="/conditions">Conditions of Use</Link> and{' '}
            <Link to="/privacy">Privacy Notice</Link>.
          </p>

          <button
            type="button"
            className="link-btn auth-forgot"
            onClick={() => pushToast('Password assistance is not available in this demo.', 'info')}
          >
            Forgot your password?
          </button>

          <label className="check auth-keep">
            <input type="checkbox" defaultChecked />
            <span>Keep me signed in</span>
          </label>

          <div className="auth-divider"><span>New to Bazaar.in?</span></div>

          <Link to="/register" className="btn btn-outline btn-block">Create your Bazaar.in account</Link>
        </form>

        <div className="demo-hint">
          <ShieldIcon size={18} />
          <p>
            <strong>Demo mode:</strong> use any email and a password of 4+ characters. Nothing is sent anywhere.
          </p>
        </div>
      </div>
    </div>
  )
}
