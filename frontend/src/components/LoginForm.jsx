import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

export default function LoginForm({ onSuccess, onBack, switchToRegister }) {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formData)
      onSuccess?.()
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-card">
      {onBack ? (
        <button type="button" className="auth-back" onClick={onBack}>
          ← Back
        </button>
      ) : null}

      <p className="auth-kicker">Welcome back</p>
      <h1>Sign in</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            autoComplete="current-password"
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Login'}
        </button>
      </form>

      {switchToRegister ? (
        <p className="auth-footer">
          New here?{' '}
          <button type="button" onClick={switchToRegister}>
            Create an account
          </button>
        </p>
      ) : null}
    </div>
  )
}
