import './FollowButton.css'

export default function FollowButton({ isFollowing, onToggle }) {
  return (
    <button
      type="button"
      className={isFollowing ? 'follow-button follow-button--active' : 'follow-button'}
      onClick={onToggle}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}
