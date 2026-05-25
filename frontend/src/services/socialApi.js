import axios from 'axios'

const API = 'http://localhost:8080'

export const socialApi = {

  // GET ALL POSTS
  fetchFeed: () =>
    axios.get(`${API}/api/posts`),

  // CREATE POST
  createPost: (payload) =>
    axios.post(`${API}/api/posts`, payload),

  // LIKE POST
  toggleLike: (postId, userId) =>
    axios.put(
      `${API}/api/posts/${postId}/like`,
      { userId }
    ),

  // FOLLOW / UNFOLLOW
  toggleFollow: (
    followerId,
    followingId
  ) =>
    axios.post(
      `${API}/api/follow`,
      {
        followerId,
        followingId
      }
    ),

  // ADD COMMENT
  addComment: (
    postId,
    comment
  ) =>
    axios.put(
      `${API}/api/posts/${postId}/comment`,
      {
        comment
      }
    ),
}