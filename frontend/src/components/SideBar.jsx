import FollowButton from './FollowButton'
import { NavLink } from 'react-router-dom'
import './Sidebar.css'

export default function Sidebar({
  currentUser,
  suggestions = [],
  onToggleFollow,
  onSelectFeedTab,
  onStatClick,
}) {
  const following = currentUser?.following || []

  return (
    <aside className="sidebar">
      <section className="sidebar__card card">
        <nav className="sidebar__nav" aria-label="Sidebar navigation">
          <NavLink to="/feed" end className="sidebar__nav-link">
            Home feed
          </NavLink>
          <button
            type="button"
            className="sidebar__nav-link"
            onClick={() => onSelectFeedTab?.('for-you')}
          >
            For you
          </button>
          <button
            type="button"
            className="sidebar__nav-link"
            onClick={() => onSelectFeedTab?.('following')}
          >
            Following feed
          </button>
          <button
            type="button"
            className="sidebar__nav-link"
            onClick={() => onSelectFeedTab?.('discover')}
          >
            Discover people
          </button>
          <NavLink to="/profile" className="sidebar__nav-link">
            My profile
          </NavLink>
        </nav>
      </section>

      <section className="sidebar__card card">
        <div className="sidebar__user">
          <span className="avatar avatar--md avatar--ring">
            {currentUser?.name?.charAt(0)?.toUpperCase() || '?'}
          </span>
          <div>
            <p className="sidebar__user-name">{currentUser?.name}</p>
            <p className="sidebar__user-handle">
              @{currentUser?.username || 'you'}
            </p>
          </div>
        </div>

        <div className="sidebar__stats">
          <button
            type="button"
            className="sidebar__stat btn-reset"
            onClick={() => onStatClick?.('followers')}
          >
            <strong>{currentUser?.followers || 0}</strong>
            <span>Followers</span>
          </button>
          <button
            type="button"
            className="sidebar__stat btn-reset"
            onClick={() => onStatClick?.('following')}
          >
            <strong>{following.length}</strong>
            <span>Following</span>
          </button>
        </div>
      </section>

      {suggestions.length > 0 ? (
        <section className="sidebar__card card">
          <div className="sidebar__head">
            <h3>People you may know</h3>
            <p>Like LinkedIn suggestions</p>
          </div>

          <ul className="sidebar__suggestions">
            {suggestions.map((person) => (
              <li key={person.id} className="sidebar__suggestion">
                <div className="sidebar__suggestion-info">
                  <span className="avatar avatar--sm">
                    {person.name?.charAt(0)?.toUpperCase()}
                  </span>
                  <div>
                    <p className="sidebar__suggestion-name">{person.name}</p>
                    <p className="sidebar__suggestion-handle">
                      @{person.username}
                    </p>
                  </div>
                </div>

                <FollowButton
                  isFollowing={following.includes(person.id)}
                  onToggle={() => onToggleFollow(person.id)}
                  size="sm"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  )
}
