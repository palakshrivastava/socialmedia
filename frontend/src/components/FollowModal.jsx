import { useEffect, useState } from 'react'
import { socialApi } from '../services/socialApi'
import './FollowModal.css'

export default function FollowModal({ userId, type, users = [], onClose, onUserClick }) {
  const [list, setList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchList = async () => {
      setIsLoading(true)
      setError('')
      try {
        let response
        if (type === 'followers') {
          response = await socialApi.fetchFollowers(userId)
        } else {
          response = await socialApi.fetchFollowing(userId)
        }
        
        // Map follow records to user profiles from `users`
        const listIds = response.data.map(item => type === 'followers' ? item.followerId : item.followingId)
        const profiles = listIds
          .map(id => users.find(u => u.id === id))
          .filter(Boolean)
        
        setList(profiles)
      } catch (err) {
        console.error(err)
        setError('Failed to load list.')
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchList()
    }
  }, [userId, type, users])

  return (
    <div className="follow-modal-overlay" onClick={onClose}>
      <div className="follow-modal-card card" onClick={(e) => e.stopPropagation()}>
        <header className="follow-modal-header">
          <h2>{type === 'followers' ? 'Followers' : 'Following'}</h2>
          <button type="button" className="follow-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <div className="follow-modal-content">
          {isLoading ? (
            <div className="follow-modal-loading">
              <div className="spinner" />
              <p>Loading...</p>
            </div>
          ) : error ? (
            <div className="alert alert--error">{error}</div>
          ) : list.length === 0 ? (
            <div className="follow-modal-empty">
              <p>No {type === 'followers' ? 'followers' : 'following'} yet.</p>
            </div>
          ) : (
            <ul className="follow-modal-list">
              {list.map((person) => {
                const avatarLetter = person.name?.charAt(0)?.toUpperCase() || '?'
                return (
                  <li key={person.id} className="follow-modal-item">
                    <button
                      type="button"
                      className="follow-modal-item-btn"
                      onClick={() => {
                        onUserClick?.(person.id)
                        onClose()
                      }}
                    >
                      <span className="avatar avatar--sm">{avatarLetter}</span>
                      <div className="follow-modal-item-info">
                        <span className="follow-modal-item-name">{person.name}</span>
                        <span className="follow-modal-item-handle">@{person.username}</span>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
