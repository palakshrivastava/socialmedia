import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './RegisterPage.css'

export default function RegisterPage() {

  const navigate = useNavigate()

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

    setFormData((current) => ({
      ...current,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError('')

    setIsSubmitting(true)

    try {

      await register(formData)

      navigate('/')

    } catch (submitError) {

      setError(submitError.message)

    } finally {

      setIsSubmitting(false)
    }
  }

  return (

    <div className="auth-layout">

      <div className="auth-card">

        <p className="auth-kicker">
          Start your community
        </p>

        <h1>Create your account</h1>

        <form className="auth-form" onSubmit={handleSubmit}>

          <label>
            Full Name

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
            />
          </label>

          <label>
            Email

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
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
            />
          </label>

          {error ? (
            <p className="auth-error">{error}</p>
          ) : null}

          <button type="submit" disabled={isSubmitting}>

            {isSubmitting
              ? 'Creating account...'
              : 'Register'}

          </button>

        </form>

        <p className="auth-footer">

          Already have an account?

          <Link to="/">
            Login
          </Link>

        </p>

      </div>

    </div>
  )
}