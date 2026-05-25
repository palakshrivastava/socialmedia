import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import './Navbar.css'

export default function Navbar() {

  const { logout } = useAuth()

  const navigate = useNavigate()

  const handleLogout = () => {

    logout()

    navigate('/')
  }

  return (

    <header className="navbar-shell">

      {/* LEFT */}
      <div className="navbar-left">

        <Link to="/feed" className="brand-link">

          <span className="brand-mark">
            ◎
          </span>

          <h2>
            SocialPulse
          </h2>

        </Link>

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        <NavLink
          to="/feed"
          className="home-link"
        >
          Home
        </NavLink>

        <NavLink
          to="/profile"
          className="nav-icon"
        >
          👤
        </NavLink>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </header>
  )
}