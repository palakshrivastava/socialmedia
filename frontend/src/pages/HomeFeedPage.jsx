import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import { socialApi } from '../services/socialApi'
import FollowModal from '../components/FollowModal'
import './HomeFeedPage.css'

const FEED_TABS = [
  { id: 'for-you', label: 'For you', hint: 'Following + discovery' },
  { id: 'following', label: 'Following', hint: 'People you follow' },
  { id: 'discover', label: 'Discover', hint: 'New voices' },
]

export default function HomeFeedPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [feedMode, setFeedMode] = useState('for-you')
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [followingIds, setFollowingIds] = useState([])
  const [followerCount, setFollowerCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [showFollowModal, setShowFollowModal] = useState(false)
  const [followModalType, setFollowModalType] = useState('followers')
  const [followModalUserId, setFollowModalUserId] = useState(null)

  const handleOpenFollowModal = (type) => {
    setFollowModalType(type)
    setFollowModalUserId(user.id)
    setShowFollowModal(true)
  }

  const loadFeed = useCallback(
    async (userId, mode) => {
      const response = await socialApi.fetchFeed(userId, mode)
      setPosts(response.data.posts || [])
    },
    []
  )

  const loadUsers = useCallback(async () => {
    const response = await socialApi.fetchUsers()
    setUsers(response.data)
  }, [])

  const loadSuggestions = useCallback(async (userId) => {
    const response = await socialApi.fetchSuggestions(userId, 8)
    setSuggestions(response.data)
  }, [])

  const refreshCounts = useCallback(async (userId) => {
    const { data } = await socialApi.syncSocial(userId)
    setFollowerCount(data.followerCount || 0)
    setFollowingIds(
      (data.following || []).map((item) => item.followingId)
    )
  }, [])

  const loadPageData = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      setError('')
      await Promise.all([
        loadFeed(user.id, feedMode),
        loadUsers(),
        loadSuggestions(user.id),
        refreshCounts(user.id),
      ])
    } catch (loadError) {
      console.error(loadError)
      setError('Could not load your feed. Make sure the backend is running.')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, feedMode, loadFeed, loadUsers, loadSuggestions, refreshCounts])

  useEffect(() => {
    loadPageData()
  }, [loadPageData])

  const handleCreatePost = async ({ content, image }) => {
    try {
      await socialApi.createPost({
        userId: user.id,
        caption: content,
        imageUrl: image || null,
      })
      await loadFeed(user.id, feedMode)
    } catch {
      setError('Failed to publish your post.')
    }
  }

  const handleToggleLike = async (postId) => {
    await socialApi.toggleLike(postId, user.id)
    await loadFeed(user.id, feedMode)
  }

  const handleAddComment = async (postId, comment) => {
    await socialApi.addComment(postId, user.id, comment)
    await loadFeed(user.id, feedMode)
  }

  const handleToggleFollow = async (followingId) => {
    await socialApi.toggleFollow(user.id, followingId)
    await refreshCounts(user.id)
    await loadSuggestions(user.id)
    if (feedMode === 'following') {
      await loadFeed(user.id, feedMode)
    }
  }

  const handleSearchSelect = () => {
    // Search in navbar navigates directly to profile page.
  }

  const getFeedLabel = (post) => {
    if (feedMode !== 'for-you') return null
    if (followingIds.includes(post.userId)) return 'Following'
    return 'Suggested'
  }

  const currentUser = {
    ...user,
    avatar: user?.name?.charAt(0)?.toUpperCase() || '?',
    following: followingIds,
    followers: followerCount,
  }

  const filteredPosts = posts

  if (isLoading) {
    return (
      <div className="app-page">
        <Navbar onSearchSelect={handleSearchSelect} />
        <div className="app-container feed-loading">
          <div className="spinner" aria-hidden />
          <p>Loading SkillMesh…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <Navbar onSearchSelect={handleSearchSelect} />

      <div className="app-container feed">
        <main className="feed__main">
          <header className="feed__hero card">
            <div>
              <p className="feed__eyebrow">Professional network</p>
              <h1>Hi, {user.name.split(' ')[0]}</h1>
            </div>
            <p className="feed__stats">
              <button
                type="button"
                className="feed__stat-btn"
                onClick={() => handleOpenFollowModal('followers')}
              >
                <strong>{followerCount}</strong> followers
              </button>
              <span className="feed__stats-dot">·</span>
              <button
                type="button"
                className="feed__stat-btn"
                onClick={() => handleOpenFollowModal('following')}
              >
                <strong>{followingIds.length}</strong> following
              </button>
            </p>
          </header>

          <div className="feed__tabs" role="tablist">
            {FEED_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={feedMode === tab.id}
                className={`feed__tab${feedMode === tab.id ? ' feed__tab--active' : ''}`}
                onClick={() => {
                  setFeedMode(tab.id)
                }}
              >
                <span>{tab.label}</span>
                <small>{tab.hint}</small>
              </button>
            ))}
          </div>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <CreatePost currentUser={currentUser} onCreate={handleCreatePost} />

          <div className="feed__posts">
            {filteredPosts.length === 0 ? (
              <div className="alert alert--empty">
                <p>
                  {feedMode === 'following'
                    ? 'Follow people to see their posts here.'
                    : 'No posts yet. Try Discover and connect with more creators.'}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  users={users}
                  currentUserId={user.id}
                  followingIds={followingIds}
                  feedLabel={getFeedLabel(post)}
                  onToggleLike={() => handleToggleLike(post.id)}
                  onAddComment={handleAddComment}
                  onToggleFollow={handleToggleFollow}
                />
              ))
            )}
          </div>
        </main>

        <SideBar
          currentUser={currentUser}
          suggestions={suggestions}
          onToggleFollow={handleToggleFollow}
          onSelectFeedTab={setFeedMode}
          onStatClick={handleOpenFollowModal}
        />
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
