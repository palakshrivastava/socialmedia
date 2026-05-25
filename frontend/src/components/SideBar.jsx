import FollowButton from './FollowButton'

import './Sidebar.css'

export default function Sidebar({
  currentUser,
  onToggleFollow,
  users = [],
}) {

  return (

    <aside className="sidebar-shell">

      {/* COMMUNITY */}
      <section className="sidebar-card">

        <p className="eyebrow">
          Your community
        </p>

        <h3>
          Stay connected
        </h3>

        <div className="sidebar-stats">

          <div>

            <strong>
              {currentUser?.following?.length || 0}
            </strong>

            <span>
              Following
            </span>

          </div>

          <div>

            <strong>
              {currentUser?.followers || 0}
            </strong>

            <span>
              Followers
            </span>

          </div>

        </div>

      </section>

      {/* FOLLOW USERS */}
      <section className="sidebar-card">

        <p className="eyebrow">
          Follow People
        </p>

        <div className="suggestions-list">

          {users.map((user) => (

            user.id !== currentUser.id && (

              <div
                key={user.id}
                className="suggestion-row"
              >

                <div>

                  <p className="suggestion-name">
                    {user.name}
                  </p>

                  <small>
                    @{user.username}
                  </small>

                </div>

                <FollowButton
                  isFollowing={
                    currentUser.following.includes(
                      user.id
                    )
                  }
                  onToggle={() =>
                    onToggleFollow(user.id)
                  }
                />

              </div>
            )

          ))}

        </div>

      </section>

      {/* TRENDING */}
      <section className="sidebar-card">

        <p className="eyebrow">
          Trending now
        </p>

        <ul className="trending-list">

          <li>#DesignSystems</li>

          <li>#CommunityBuilding</li>

          <li>#MindfulUX</li>

          <li>#FrontendWins</li>

        </ul>

      </section>

    </aside>
  )
}