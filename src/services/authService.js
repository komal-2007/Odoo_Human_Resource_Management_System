/**
 * Authentication Service
 * Seamless integration bridge between Frontend and Person 1's Backend.
 * 
 * In hackathon development:
 * - Uses localStorage + mock fallback when backend is not connected.
 * - Simply update BACKEND_API_URL or toggle USE_REAL_BACKEND when Person 1 exposes the API!
 */

const BACKEND_API_URL = "http://localhost:5000/api"
const USE_REAL_BACKEND = false // Set to true when Person 1's backend server is running

export async function registerAdmin(userData) {
  if (USE_REAL_BACKEND) {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }
      const data = await response.json()
      localStorage.setItem("dayflow_user", JSON.stringify(data.user))
      localStorage.setItem("dayflow_token", data.token || "mock-token")
      return data.user
    } catch (err) {
      console.error("Backend signup error:", err)
      throw err
    }
  }

  // Mock implementation for offline / frontend development
  const mockUser = {
    id: Date.now(),
    loginId: userData.loginId,
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    company: userData.companyName,
    companyLogo: userData.companyLogo || null,
    role: "admin",
    department: "Management",
    manager: "Self",
    location: "Headquarters",
  }

  localStorage.setItem("dayflow_user", JSON.stringify(mockUser))
  return mockUser
}

export async function loginUser(credentials) {
  if (USE_REAL_BACKEND) {
    const response = await fetch(`${BACKEND_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Invalid credentials")
    }
    const data = await response.json()
    localStorage.setItem("dayflow_user", JSON.stringify(data.user))
    localStorage.setItem("dayflow_token", data.token || "mock-token")
    return data.user
  }

  // Mock login fallback
  const savedUser = JSON.parse(localStorage.getItem("dayflow_user") || "null")
  if (savedUser && (savedUser.email === credentials.loginId || savedUser.loginId === credentials.loginId)) {
    return savedUser
  }

  // Default admin user fallback
  const defaultAdmin = {
    id: 1,
    loginId: "DFADUS20260001",
    name: "Admin User",
    email: credentials.loginId.includes("@") ? credentials.loginId : "admin@dayflow.com",
    company: "DayFlow Technologies",
    role: "admin",
    department: "Executive",
    manager: "Board",
    location: "Bengaluru, IN",
  }
  localStorage.setItem("dayflow_user", JSON.stringify(defaultAdmin))
  return defaultAdmin
}

export function getCurrentUser() {
  const saved = localStorage.getItem("dayflow_user")
  return saved ? JSON.parse(saved) : null
}

export function logoutUser() {
  localStorage.removeItem("dayflow_user")
  localStorage.removeItem("dayflow_token")
}
