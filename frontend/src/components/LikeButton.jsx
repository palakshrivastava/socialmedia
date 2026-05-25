import './LikeButton.css'

export default function LikeButton({ liked, likes, onToggle }) {
  return (
    <button type="button" className={`like-button ${liked ? 'liked' : ''}`} onClick={onToggle}>
      <span aria-hidden="true">♥</span>
      <span>{liked ? 'Liked' : 'Like'}</span>
      <strong>{likes}</strong>
    </button>
  )
}
