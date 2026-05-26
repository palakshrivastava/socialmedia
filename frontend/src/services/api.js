const API_BASE = import.meta.env.VITE_API_URL || ''

export function getApiErrorMessage(error, fallback) {
  const data = error?.response?.data
  const status = error?.response?.status

  if (status === 502 || status === 503) {
    return 'Backend is not running. In the project root run: .\\mvnw.cmd spring-boot:run'
  }

  if (typeof data === 'string' && data.trim()) {
    return data
  }

  if (data?.message) {
    return data.message
  }

  if (error?.message === 'Network Error') {
    return 'Cannot reach the server. Start the backend: .\\mvnw.cmd spring-boot:run'
  }

  return fallback
}

export function resolveMediaUrl(url) {
  if (!url) {
    return null
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  return `${API_BASE}${url}`
}

export { API_BASE }
