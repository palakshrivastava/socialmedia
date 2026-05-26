import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_BASE, getApiErrorMessage } from '../services/api'

const AuthContext = createContext()

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
    setUser(nextUser)
  }

  const refreshUser = async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      persistUser(null)
      return null
    }

    const response = await axios.get(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    persistUser(response.data)
    return response.data
  }

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        persistUser(null)
        setIsBootstrapping(false)
        return
      }

      try {
        await refreshUser()
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        persistUser(null)
      } finally {
        setIsBootstrapping(false)
      }
    }

    bootstrap()
  }, [])

  const login = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email: formData.email.trim(),
        password: formData.password,
      })

      const token = response.data?.token
      const loggedInUser = response.data?.user

      if (!token || !loggedInUser) {
        throw new Error('Login failed')
      }

      localStorage.setItem(TOKEN_KEY, token)
      persistUser(loggedInUser)

      return token
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Invalid email or password'))
    }
  }

  const register = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/signup`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      })

      if (response.data?.message !== 'User registered successfully') {
        throw new Error(response.data?.message || 'Registration failed')
      }

      // Automatically log the user in after registration
      await login({
        email: formData.email.trim(),
        password: formData.password,
      })

      return response.data
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration failed'))
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    persistUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isBootstrapping,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
