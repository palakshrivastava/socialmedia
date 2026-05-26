import './LikeButton.css'

export default function LikeButton({ liked, likes, onToggle }) {
  return (
    <button
      type="button"
      className={`like-btn${liked ? ' like-btn--liked' : ''}`}
      onClick={onToggle}
      aria-pressed={liked}
    >
      <span className="like-btn__icon" aria-hidden>
        {liked ? '♥' : '♡'}
      </span>
      <span className="like-btn__label">{liked ? 'Liked' : 'Like'}</span>
      {likes > 0 ? <span className="like-btn__count">{likes}</span> : null}
    </button>
  )
}
