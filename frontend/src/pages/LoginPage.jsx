import { Link, useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import '../styles/auth.css'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-shell login-page">
      <LoginForm
        onSuccess={() => navigate('/feed')}
        switchToRegister={() => navigate('/register')}
      />
      <p className="login-page__home">
        <Link to="/">← Back to home</Link>
      </p>
    </div>
  )
}
