import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'
import SideBar from '../components/SideBar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'

import { socialApi } from '../services/socialApi'

import './HomeFeedPage.css'

export default function HomeFeedPage() {

  const [posts, setPosts] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  // CURRENT USER
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: 'Palak',
    username: 'palak',
    followers: 10,
    following: [],
  })

  // USERS
  const users = [

    { id: 1, name: 'Palak', username: 'palak' },

    { id: 2, name: 'Rahul', username: 'rahul' },

    { id: 3, name: 'Aman', username: 'aman' },

    { id: 4, name: 'Priya', username: 'priya' },

    { id: 5, name: 'Sneha', username: 'sneha' },

    { id: 6, name: 'Karan', username: 'karan' },

    { id: 7, name: 'Anjali', username: 'anjali' },

    { id: 8, name: 'Rohit', username: 'rohit' },

    { id: 9, name: 'Neha', username: 'neha' },

    { id: 10, name: 'Arjun', username: 'arjun' },

    { id: 11, name: 'Simran', username: 'simran' },

    { id: 12, name: 'Yash', username: 'yash' },

    { id: 13, name: 'Aditi', username: 'aditi' },

    { id: 14, name: 'Harsh', username: 'harsh' },

    { id: 15, name: 'Meera', username: 'meera' },

    { id: 16, name: 'Dev', username: 'dev' },

    { id: 17, name: 'Riya', username: 'riya' },

    { id: 18, name: 'Aryan', username: 'aryan' },

    { id: 19, name: 'Pooja', username: 'pooja' },

    { id: 20, name: 'Kabir', username: 'kabir' },

  ]

  // LOAD POSTS
  const loadFeed = async () => {

    try {

      setIsLoading(true)

      const response =
        await socialApi.fetchFeed()

      setPosts(response.data)

    } catch (error) {

      console.log(error)

    } finally {

      setIsLoading(false)
    }
  }

  // LOAD POSTS
  useEffect(() => {

    loadFeed()

  }, [])

  // CREATE POST
  const handleCreatePost = async ({
    content,
    image
  }) => {

    try {

      await socialApi.createPost({

        userId:
          Math.floor(Math.random() * 20) + 1,

        caption: content,

        imageUrl: image,
      })

      await loadFeed()

    } catch (error) {

      console.log(error)
    }
  }

  // LIKE POST
  const handleToggleLike = async (
    postId
  ) => {

    try {

      await socialApi.toggleLike(
        postId,
        currentUser.id
      )

      await loadFeed()

    } catch (error) {

      console.log(error)
    }
  }

  // ADD COMMENT
  const handleAddComment = async (
    postId,
    comment
  ) => {

    try {

      await socialApi.addComment(
        postId,
        comment
      )

      await loadFeed()

    } catch (error) {

      console.log(error)
    }
  }

  // FOLLOW / UNFOLLOW
  const handleToggleFollow = async (
    followingId
  ) => {

    try {

      await socialApi.toggleFollow(
        currentUser.id,
        followingId
      )

      if (
        currentUser.following.includes(
          followingId
        )
      ) {

        setCurrentUser({

          ...currentUser,

          following:
            currentUser.following.filter(
              (id) =>
                id !== followingId
            )
        })

      } else {

        setCurrentUser({

          ...currentUser,

          following: [
            ...currentUser.following,
            followingId
          ]
        })
      }

    } catch (error) {

      console.log(error)
    }
  }

  if (isLoading) {

    return <h1>Loading...</h1>
  }

  return (

    <div className="page-shell">

      <Navbar />

      <main className="feed-layout">

        <section className="feed-main">

          <div className="hero-box">

            <h1>
              Welcome to SocialSphere 🚀
            </h1>

            <p>
              Share your thoughts and connect with people.
            </p>

          </div>

          <CreatePost
            currentUser={currentUser}
            onCreate={handleCreatePost}
          />

          <div className="feed-posts">

            {posts.map((post) => (

              <PostCard
                key={post.id}
                post={post}
                users={users}
                onToggleLike={() =>
                  handleToggleLike(post.id)
                }
                onAddComment={
                  handleAddComment
                }
              />

            ))}

          </div>

        </section>

        <SideBar
          currentUser={currentUser}
          onToggleFollow={handleToggleFollow}
          users={users}
        />

      </main>

    </div>
  )
}