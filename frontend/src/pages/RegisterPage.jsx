import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'
import '../styles/auth.css'
import './RegisterPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()

  return (
    <div className="auth-shell register-page">
      <RegisterForm
        onSuccess={() => navigate('/login')}
        switchToLogin={() => navigate('/login')}
      />
      <p className="register-page__home">
        <Link to="/">← Back to home</Link>
      </p>
    </div>
  )
}
