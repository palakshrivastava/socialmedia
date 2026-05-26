import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { socialApi } from '../services/socialApi'
import NotificationPanel from './NotificationPanel'
import { useTheme } from '../context/ThemeContext'
import './Navbar.css'

export default function Navbar({ onSearchSelect }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || '?'

  const refreshSocial = async () => {
    if (!user?.id) return
    try {
      const { data } = await socialApi.syncSocial(user.id)
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadNotifications || 0)
    } catch {
      /* ignore poll errors */
    }
  }

  useEffect(() => {
    refreshSocial()
    const interval = setInterval(refreshSocial, 8000)
    return () => clearInterval(interval)
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await socialApi.searchUsers(user.id, searchQuery.trim())
        setSearchResults(data)
        setShowSearch(true)
      } catch {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, user?.id])

  useEffect(() => {
    const handleClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleMarkRead = async () => {
    if (!user?.id) return
    await socialApi.markNotificationsRead(user.id)
    await refreshSocial()
  }

  const handleSearchPick = (person) => {
    setSearchQuery('')
    setShowSearch(false)
    onSearchSelect?.(person)
    navigate(`/profile/${person.id}`)
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/feed" className="navbar__brand" title="SkillMesh Home">
          <span className="navbar__logo" aria-hidden>
            SM
          </span>
          <span className="navbar__title">SkillMesh</span>
        </Link>

        <div className="navbar__search-wrap" ref={searchRef}>
          <span className="navbar__search-icon" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            className="navbar__search"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearch(true)}
          />
          {showSearch && searchResults.length > 0 ? (
            <ul className="navbar__search-results card">
              {searchResults.map((person) => (
                <li key={person.id}>
                  <button
                    type="button"
                    onClick={() => handleSearchPick(person)}
                  >
                    <span className="avatar avatar--sm">
                      {person.name?.charAt(0)?.toUpperCase()}
                    </span>
                    <span>
                      <strong>{person.name}</strong>
                      <small>@{person.username}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="navbar__actions">
          <button
            type="button"
            className="navbar__theme-btn"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? '☾' : '☀'}
          </button>

          <div className="navbar__notif-wrap">
            <button
              type="button"
              className="navbar__notif-btn"
              onClick={() => setShowNotif((v) => !v)}
              aria-label="Notifications"
            >
              🔔
              {unreadCount > 0 ? (
                <span className="navbar__notif-badge">{unreadCount}</span>
              ) : null}
            </button>
            {showNotif ? (
              <NotificationPanel
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAllRead={handleMarkRead}
                onClose={() => setShowNotif(false)}
              />
            ) : null}
          </div>

          <Link to="/profile" className="navbar__user" title="Your profile">
            <span className="avatar avatar--sm">{avatarLetter}</span>
            <span className="navbar__user-name">{user?.name}</span>
          </Link>

          <button
            type="button"
            className="btn btn--ghost btn--sm navbar__logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
