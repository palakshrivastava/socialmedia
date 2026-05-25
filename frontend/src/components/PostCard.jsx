import { useState } from 'react'

import FollowButton from './FollowButton'
import LikeButton from './LikeButton'

import './PostCard.css'

export default function PostCard({
  post,
  users = [],
  onToggleLike,
  onAddComment,
}) {

  const [comment, setComment] =
    useState('')

  // FIND USER
  const user =
    users.find(
      (u) => u.id === post.userId
    ) || {
      name: 'Unknown',
      username: 'unknown',
    }

  // USER AVATAR
  const avatar =
    user.name.charAt(0)

  const handleComment = () => {

    if (!comment.trim()) {
      return
    }

    onAddComment(
      post.id,
      comment
    )

    setComment('')
  }

  return (

    <article className="post-card">

      {/* HEADER */}
      <div className="post-header">

        <div className="post-author-row">

          <div className="post-avatar">

            {avatar}

          </div>

          <div>

            <p className="post-author-name">

              {user.name}

            </p>

            <p className="post-author-meta">

              @{user.username} • {

                new Date(
                  post.createdAt
                ).toLocaleDateString()

              }

            </p>

          </div>

        </div>

        <FollowButton
          isFollowing={false}
          onToggle={() =>
            console.log('follow')
          }
        />

      </div>

      {/* CAPTION */}
      <p className="post-content">

        {post.caption}

      </p>

      {/* IMAGE */}
      {post.imageUrl ? (

        <img
          className="post-image"
          src={post.imageUrl}
          alt="Post"
        />

      ) : null}

      {/* ACTIONS */}
      <div className="post-actions">

        <LikeButton

          liked={false}

          likes={
            post.likes?.length || 0
          }

          onToggle={onToggleLike}

        />

      </div>

      {/* COMMENTS */}
      <div className="comments-section">

        <h4>
          Comments
        </h4>

        <div className="comments-list">

          {post.comments?.map(
            (item, index) => (

              <p
                key={index}
                className="comment-item"
              >
                {item}
              </p>
            )
          )}

        </div>

        {/* ADD COMMENT */}
        <div className="comment-input-box">

          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
          />

          <button
            onClick={handleComment}
          >
            Post
          </button>

        </div>

      </div>

    </article>
  )
}