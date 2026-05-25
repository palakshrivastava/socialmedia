import Navbar from '../components/Navbar'

import './ProfilePage.css'

export default function ProfilePage() {

  return (

    <div className="page-shell">

      <Navbar />

      <div className="profile-page">

        <div className="profile-card">

          <div className="profile-avatar">
            P
          </div>

          <h1>Palak</h1>

          <p className="profile-username">
            @palak
          </p>

          <p className="profile-bio">
            Full Stack Developer 🚀
          </p>

          <div className="profile-stats">

            <div>
              <strong>12</strong>
              <span>Posts</span>
            </div>

            <div>
              <strong>220</strong>
              <span>Followers</span>
            </div>

            <div>
              <strong>180</strong>
              <span>Following</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}