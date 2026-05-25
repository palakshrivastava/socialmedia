import { useState } from 'react'
import './CommentSection.css'

export default function CommentSection({ comments = [], currentUser, onAddComment }) {
  const [draft, setDraft] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!draft.trim()) {
      return
    }

    onAddComment?.(draft.trim())
    setDraft('')
  }

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={currentUser ? `Comment as @${currentUser.username}` : 'Add a comment'}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      <div className="comment-list">
        {comments.length === 0 ? (
          <p className="comment-empty">Be the first to comment on this post.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="comment-item">
              <span className="comment-avatar">{comment.user?.avatar || '•'}</span>
              <div>
                <p className="comment-author">{comment.user?.name || 'Community member'}</p>
                <p>{comment.text}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
