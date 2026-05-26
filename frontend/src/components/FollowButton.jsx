import './FollowButton.css'

export default function FollowButton({ isFollowing, onToggle, size }) {
  return (
    <button
      type="button"
      className={`follow-btn${isFollowing ? ' follow-btn--following' : ''}${
        size === 'sm' ? ' follow-btn--sm' : ''
      }`}
      onClick={onToggle}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
