import { useState } from 'react'
import './CreatePost.css'

export default function CreatePost({ currentUser, onCreate }) {
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!content.trim()) {
      return
    }

    onCreate?.({
      content: content.trim(),
      image: image.trim(),
    })

    setContent('')
    setImage('')
  }

  return (
    <section className="create-post-card">
      <div className="create-post-header">
        <span className="create-post-avatar">{currentUser?.avatar || '•'}</span>
        <div>
          <p className="create-post-title">Create a post</p>
          <p className="create-post-subtitle">Share updates with your community</p>
        </div>
      </div>

      <form className="create-post-form" onSubmit={handleSubmit}>
        <textarea
          rows="4"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What would you like to share today?"
        />
        <input
          type="url"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          placeholder="Optional image URL"
        />
        <div className="create-post-actions">
          <span>Keep it short and welcoming.</span>
          <button type="submit">Publish post</button>
        </div>
      </form>
    </section>
  )
}
