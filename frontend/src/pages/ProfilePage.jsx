import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import Navbar from '../components/Navbar'
import PostCard from '../components/PostCard'
import FollowButton from '../components/FollowButton'
import SideBar from '../components/SideBar'
import { useAuth } from '../context/AuthContext'
import { socialApi } from '../services/socialApi'
import FollowModal from '../components/FollowModal'

import './ProfilePage.css'

export default function ProfilePage() {
  const { user } = useAuth()
  const { userId } = useParams()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [users, setUsers] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [followingIds, setFollowingIds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState('followers')
  const [followModalUserId, setFollowModalUserId] = useState(null)

  const handleOpenFollowModal = (type) => {
    setFollowModalType(type)
    setFollowModalUserId(resolvedTargetUserId)
    setShowFollowModal(true)
  }
  const targetUserId = userId ? Number(userId) : user?.id
  const resolvedTargetUserId = Number.isNaN(targetUserId) ? null : targetUserId
  const isOwnProfile = resolvedTargetUserId === user?.id

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id || !resolvedTargetUserId) {
        setError('Profile unavailable.')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const [profileResponse, usersResponse, followingResponse, suggestionsResponse] =
          await Promise.all([
            socialApi.fetchUserProfile(resolvedTargetUserId),
            socialApi.fetchUsers(),
            socialApi.fetchFollowing(user.id),
            socialApi.fetchSuggestions(user.id, 8),
          ])

        setProfile(profileResponse.data)
        setUsers(usersResponse.data)
        setFollowingIds(
          followingResponse.data.map((item) => item.followingId)
        )
        setSuggestions(suggestionsResponse.data || [])
      } catch (loadError) {
        console.error(loadError)
        setError('Could not load your profile.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user?.id, resolvedTargetUserId])

  const handleToggleLike = async (postId) => {
    await socialApi.toggleLike(postId, user.id)
    const profileResponse = await socialApi.fetchUserProfile(resolvedTargetUserId)
    setProfile(profileResponse.data)
  }

  const handleAddComment = async (postId, comment) => {
    await socialApi.addComment(postId, user.id, comment)
    const profileResponse = await socialApi.fetchUserProfile(resolvedTargetUserId)
    setProfile(profileResponse.data)
  }

  const handleToggleFollow = async () => {
    if (isOwnProfile || !resolvedTargetUserId) return
    await socialApi.toggleFollow(user.id, resolvedTargetUserId)
    const [profileResponse, followingResponse] = await Promise.all([
      socialApi.fetchUserProfile(resolvedTargetUserId),
      socialApi.fetchFollowing(user.id),
    ])
    setProfile(profileResponse.data)
    setFollowingIds(followingResponse.data.map((item) => item.followingId))
  }

  if (isLoading) {
    return (
      <div className="app-page">
        <Navbar onSearchSelect={() => {}} />
        <div className="app-container profile-loading">
          <div className="spinner" aria-hidden />
          <p>Loading profile…</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="app-page">
        <Navbar onSearchSelect={() => {}} />
        <div className="app-container profile-loading">
          <p>{error || 'Profile unavailable.'}</p>
        </div>
      </div>
    )
  }

  const profileUser = profile.user
  const avatar = profileUser.name?.charAt(0)?.toUpperCase() || '?'
  const isFollowing = followingIds.includes(profileUser.id)
  const currentUser = {
    ...user,
    following: followingIds,
    followers: profile.followersCount,
  }

  return (
    <div className="app-page">
      <Navbar />

      <div className="app-container profile">
        <SideBar
          currentUser={currentUser}
          suggestions={suggestions}
          onToggleFollow={(followingId) =>
            socialApi.toggleFollow(user.id, followingId).then(() => {
              setFollowingIds((prev) =>
                prev.includes(followingId)
                  ? prev.filter((id) => id !== followingId)
                  : [...prev, followingId]
              )
            })
          }
          onSelectFeedTab={() => {}}
          onStatClick={handleOpenFollowModal}
        />

        <main className="profile__main">
          <section className="profile__hero card">
            <div className="profile__hero-main">
              <span className="avatar avatar--lg avatar--ring">{avatar}</span>

              <div className="profile__info">
                <h1>{profileUser.name}</h1>
                <p className="profile__handle">@{profileUser.username}</p>
                <p className="profile__email">{profileUser.email}</p>
                {profileUser.bio ? <p className="profile__bio">{profileUser.bio}</p> : null}
              </div>
            </div>

            <ul className="profile__stats">
              <li>
                <strong>{profile.postsCount}</strong>
                <span>posts</span>
              </li>
              <li>
                <button
                  type="button"
                  className="profile__stat-btn"
                  onClick={() => handleOpenFollowModal('followers')}
                >
                  <strong>{profile.followersCount}</strong>
                  <span>followers</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="profile__stat-btn"
                  onClick={() => handleOpenFollowModal('following')}
                >
                  <strong>{profile.followingCount}</strong>
                  <span>following</span>
                </button>
              </li>
            </ul>

            <div className="profile__actions">
              {!isOwnProfile ? (
                <FollowButton isFollowing={isFollowing} onToggle={handleToggleFollow} />
              ) : null}
              <Link to="/feed" className="btn btn--ghost profile__feed-link">
                Back to feed
              </Link>
            </div>
          </section>

          <section className="profile__content">
            <div className="profile__tabs">
              <span className="profile__tab profile__tab--active">Posts</span>
              <span className="profile__tab profile__tab--muted">
                {profile.postsCount} total
              </span>
            </div>

            {profile.posts?.length ? (
              <div className="profile__posts">
                {profile.posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    users={users}
                    currentUserId={user.id}
                    followingIds={followingIds}
                    onToggleLike={() => handleToggleLike(post.id)}
                    onAddComment={handleAddComment}
                    onToggleFollow={(followingId) =>
                      socialApi.toggleFollow(user.id, followingId).then(() => {
                        setFollowingIds((prev) =>
                          prev.includes(followingId)
                            ? prev.filter((id) => id !== followingId)
                            : [...prev, followingId]
                        )
                      })
                    }
                    showFollowButton={!isOwnProfile}
                  />
                ))}
              </div>
            ) : (
              <div className="alert alert--empty profile__empty">
                <p>
                  {isOwnProfile
                    ? "You haven't posted yet."
                    : `${profileUser.name} has not posted yet.`}
                </p>
                {isOwnProfile ? (
                  <Link to="/feed" className="btn btn--primary">
                    Create your first post
                  </Link>
                ) : null}
              </div>
            )}
          </section>
        </main>
      </div>

      {showFollowModal && (
        <FollowModal
          userId={followModalUserId}
          type={followModalType}
          users={users}
          onClose={() => setShowFollowModal(false)}
          onUserClick={(targetId) => navigate(`/profile/${targetId}`)}
        />
      )}
    </div>
  )
}
