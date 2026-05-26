import './NotificationPanel.css'

function iconForType(type) {
  switch (type) {
    case 'LIKE':
      return '♥'
    case 'COMMENT':
      return '💬'
    case 'FOLLOW':
      return '👤'
    default:
      return '•'
  }
}

function formatWhen(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const diffMins = Math.floor((Date.now() - date) / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString()
}

export default function NotificationPanel({
  notifications = [],
  unreadCount = 0,
  onMarkAllRead,
  onClose,
}) {
  return (
    <div className="notif-panel card">
      <header className="notif-panel__head">
        <h3>Notifications</h3>
        {unreadCount > 0 ? (
          <span className="notif-panel__badge">{unreadCount} new</span>
        ) : null}
        <button type="button" className="notif-panel__close" onClick={onClose}>
          ×
        </button>
      </header>

      {unreadCount > 0 ? (
        <button type="button" className="notif-panel__mark" onClick={onMarkAllRead}>
          Mark all as read
        </button>
      ) : null}

      <ul className="notif-panel__list">
        {notifications.length === 0 ? (
          <li className="notif-panel__empty">You&apos;re all caught up.</li>
        ) : (
          notifications.map((item) => (
            <li
              key={item.id}
              className={`notif-panel__item${item.read ? '' : ' notif-panel__item--unread'}`}
            >
              <span className={`notif-panel__icon notif-panel__icon--${item.type?.toLowerCase()}`}>
                {iconForType(item.type)}
              </span>
              <div>
                <p className="notif-panel__text">{item.message}</p>
                <time className="notif-panel__time">{formatWhen(item.createdAt)}</time>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
