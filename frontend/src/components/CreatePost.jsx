import { useRef, useState } from 'react'
import { resolveMediaUrl } from '../services/api'
import { socialApi } from '../services/socialApi'
import './CreatePost.css'

export default function CreatePost({ currentUser, onCreate }) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const avatar =
    currentUser?.avatar ||
    currentUser?.name?.charAt(0)?.toUpperCase() ||
    '?'

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    setPreview(URL.createObjectURL(file))
    setIsUploading(true)

    try {
      const { data } = await socialApi.uploadMedia(file)
      setImageUrl(data.url)
    } catch {
      setError('Could not upload image. Try a smaller file.')
      setPreview(null)
      setImageUrl('')
    } finally {
      setIsUploading(false)
    }
  }

  const clearMedia = () => {
    setImageUrl('')
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!content.trim() || isUploading) return

    await onCreate?.({
      content: content.trim(),
      image: imageUrl || null,
    })

    setContent('')
    clearMedia()
  }

  const displayPreview = preview || (imageUrl ? resolveMediaUrl(imageUrl) : null)

  return (
    <section className="composer card">
      <form className="composer__form" onSubmit={handleSubmit}>
        <div className="composer__top">
          <span className="avatar avatar--md">{avatar}</span>
          <textarea
            rows="3"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={`Share an update, ${currentUser?.name?.split(' ')[0] || 'there'}...`}
            className="composer__input"
          />
        </div>

        {displayPreview ? (
          <div className="composer__preview">
            <img src={displayPreview} alt="Upload preview" />
            <button type="button" className="composer__remove-media" onClick={clearMedia}>
              Remove
            </button>
          </div>
        ) : null}

        {error ? <p className="composer__error">{error}</p> : null}

        <div className="composer__footer">
          <div className="composer__tools">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              hidden
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="composer__tool"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading…' : '📷 Photo'}
            </button>
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={!content.trim() || isUploading}
          >
            Post
          </button>
        </div>
      </form>
    </section>
  )
}
