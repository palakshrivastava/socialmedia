import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

export default function RegisterForm({ onSuccess, onBack, switchToLogin }) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
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
      await register(formData)
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

      <p className="auth-kicker">Get started</p>
      <h1>Create account</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            autoComplete="name"
          />
        </label>

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
            placeholder="At least 6 characters"
            minLength={6}
            required
            autoComplete="new-password"
          />
        </label>

        {error ? <p className="auth-error">{error}</p> : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Register'}
        </button>
      </form>

      {switchToLogin ? (
        <p className="auth-footer">
          Already have an account?{' '}
          <button type="button" onClick={switchToLogin}>
            Sign in
          </button>
        </p>
      ) : null}
    </div>
  )
}
