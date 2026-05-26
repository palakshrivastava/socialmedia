import { useState } from 'react'
import { resolveMediaUrl } from '../services/api'
import FollowButton from './FollowButton'
import LikeButton from './LikeButton'
import './PostCard.css'

function formatTime(dateString) {
  if (!dateString) return 'Just now'
  const date = new Date(dateString)
  const diffMins = Math.floor((Date.now() - date) / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function normalizeComment(item) {
  if (typeof item === 'string') {
    return { authorName: 'Member', text: item }
  }
  return {
    authorName: item.authorName || 'Member',
    text: item.text || '',
  }
}

export default function PostCard({
  post,
  users = [],
  currentUserId,
  followingIds = [],
  feedLabel,
  onToggleLike,
  onAddComment,
  onToggleFollow,
  showFollowButton = true,
}) {
  const [comment, setComment] = useState('')
  const [showComments, setShowComments] = useState(false)

  const author =
    users.find((item) => item.id === post.userId) || {
      name: 'Unknown',
      username: 'unknown',
    }

  const avatar = author.name?.charAt(0)?.toUpperCase() || '?'
  const isLiked = post.likes?.includes(currentUserId) ?? false
  const isFollowing = followingIds.includes(post.userId)
  const isOwnPost = post.userId === currentUserId
  const commentCount = post.comments?.length || 0
  const imageSrc = resolveMediaUrl(post.imageUrl)

  const handleComment = () => {
    if (!comment.trim()) return
    onAddComment(post.id, comment.trim())
    setComment('')
    setShowComments(true)
  }

  return (
    <article className="post card">
      {feedLabel ? <span className="post__feed-label">{feedLabel}</span> : null}

      <header className="post__header">
        <div className="post__author">
          <span className="avatar avatar--md">{avatar}</span>
          <div className="post__author-text">
            <p className="post__name">{author.name}</p>
            <p className="post__meta">
              @{author.username} · {formatTime(post.createdAt)}
            </p>
          </div>
        </div>

        {showFollowButton && !isOwnPost ? (
          <FollowButton
            isFollowing={isFollowing}
            onToggle={() => onToggleFollow?.(post.userId)}
            size="sm"
          />
        ) : null}
      </header>

      {post.caption ? <p className="post__caption">{post.caption}</p> : null}

      {imageSrc ? (
        <div className="post__media">
          <img src={imageSrc} alt="" loading="lazy" />
        </div>
      ) : null}

      <footer className="post__footer">
        <div className="post__actions">
          <LikeButton
            liked={isLiked}
            likes={post.likes?.length || 0}
            onToggle={onToggleLike}
          />
          <button
            type="button"
            className="post__action-btn"
            onClick={() => setShowComments((v) => !v)}
          >
            <span aria-hidden>💬</span>
            <span>{commentCount > 0 ? `${commentCount} comments` : 'Comment'}</span>
          </button>
        </div>

        {(showComments || commentCount > 0) && (
          <div className="post__comments">
            {commentCount > 0 ? (
              <ul className="post__comment-list">
                {post.comments.map((item, index) => {
                  const c = normalizeComment(item)
                  return (
                    <li key={`${post.id}-c-${index}`}>
                      <strong>{c.authorName}</strong> {c.text}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="post__no-comments">No comments yet.</p>
            )}

            <div className="post__comment-form">
              <input
                type="text"
                placeholder="Write a comment…"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              />
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={handleComment}
                disabled={!comment.trim()}
              >
                Reply
              </button>
            </div>
          </div>
        )}
      </footer>
    </article>
  )
}
