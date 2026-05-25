import { Routes, Route } from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomeFeedPage from './pages/HomeFeedPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {

  return (

    <Routes>

      {/* LOGIN PAGE */}
      <Route
        path="/"
        element={<LoginPage />}
      />

      {/* REGISTER PAGE */}
      <Route
        path="/register"
        element={<RegisterPage />}
      />

      {/* FEED PAGE */}
      <Route
        path="/feed"
        element={<HomeFeedPage />}
      />

      {/* PROFILE PAGE */}
      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      {/* NOT FOUND PAGE */}
      <Route
        path="*"
        element={<NotFoundPage />}
      />

    </Routes>
  )
}

export default App