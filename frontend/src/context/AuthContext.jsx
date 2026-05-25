import { createContext, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {

  // LOGIN
  const login = async (formData) => {

    try {

      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        formData
      )

      // SAVE JWT TOKEN
      localStorage.setItem('token', response.data)

      return response.data

    } catch (error) {

      throw new Error(
        error.response?.data || 'Invalid email or password'
      )
    }
  }

  // REGISTER
  const register = async (formData) => {

    try {

      const response = await axios.post(
        'http://localhost:8080/api/auth/signup',
        formData
      )

      return response.data

    } catch (error) {

      throw new Error(
        error.response?.data || 'Registration failed'
      )
    }
  }

  // LOGOUT
  const logout = () => {

    localStorage.removeItem('token')
  }

  return (

    <AuthContext.Provider
      value={{
        login,
        register,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

export function useAuth() {

  return useContext(AuthContext)
}