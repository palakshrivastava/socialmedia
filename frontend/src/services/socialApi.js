import axios from 'axios'

import { API_BASE } from './api'

const API = API_BASE

export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const socialApi = {
  fetchCurrentUser: () =>
    axios.get(`${API}/api/auth/me`, { headers: getAuthHeaders() }),

  fetchUsers: () => axios.get(`${API}/api/users`),

  fetchUserProfile: (userId) =>
    axios.get(`${API}/api/users/${userId}/profile`),

  fetchFeed: (userId, mode = 'for-you') =>
    axios.get(`${API}/api/feed`, { params: { userId, mode } }),

  createPost: (payload) =>
    axios.post(`${API}/api/posts`, payload),

  uploadMedia: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(`${API}/api/media/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  toggleLike: (postId, userId) =>
    axios.put(`${API}/api/posts/${postId}/like`, { userId }),

  toggleFollow: (followerId, followingId) =>
    axios.post(`${API}/api/follow`, { followerId, followingId }),

  fetchFollowing: (userId) =>
    axios.get(`${API}/api/follow/following/${userId}`),

  fetchFollowers: (userId) =>
    axios.get(`${API}/api/follow/followers/${userId}`),

  addComment: (postId, userId, comment) =>
    axios.put(`${API}/api/posts/${postId}/comment`, { userId, comment }),

  syncSocial: (userId) =>
    axios.get(`${API}/api/social/sync`, { params: { userId } }),

  searchUsers: (userId, q) =>
    axios.get(`${API}/api/social/search`, { params: { userId, q } }),

  fetchSuggestions: (userId, limit = 8) =>
    axios.get(`${API}/api/social/suggestions`, { params: { userId, limit } }),

  fetchNotifications: (userId) =>
    axios.get(`${API}/api/notifications/${userId}`),

  markNotificationsRead: (userId) =>
    axios.put(`${API}/api/notifications/${userId}/read-all`),
}
