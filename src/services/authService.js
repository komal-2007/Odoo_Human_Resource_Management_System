/**
 * Authentication Service — DayFlow HRMS
 * 
 * Connects to Person 1's backend API for login.
 * Falls back to mock mode when backend is not available.
 * 
 * Toggle USE_REAL_BACKEND to switch between real API and mock:
 * - true  → calls the real backend (Person 1's API at /api)
 * - false → uses localStorage mock (for offline frontend dev)
 */

import { apiLogin, apiGetMe } from "./apiService"

const USE_REAL_BACKEND = true  // Set to false if backend server is not running

// ─── LOGIN ────────────────────────────────────────────

export async function loginUser(credentials) {
  if (USE_REAL_BACKEND) {
    try {
      // Backend expects { loginId, password } and returns { token, user }
      const data = await apiLogin(credentials.loginId, credentials.password)

      // Store JWT token for future API calls
      localStorage.setItem("dayflow_token", data.token)

      // Normalize user object for frontend components
      // Backend user: { id, email, loginId, role, mustChangePassword }
      // Backend may include profile info depending on the endpoint
      const normalizedUser = normalizeUser(data.user)
      localStorage.setItem("dayflow_user", JSON.stringify(normalizedUser))

      return normalizedUser
    } catch (err) {
      // If backend is down, fall through to mock if desired
      console.error("Backend login error:", err)
      throw err
    }
  }

  // ── Mock login fallback (for offline development) ──
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

// ─── SIGNUP (Admin Registration) ──────────────────────
// NOTE: The backend has NO /auth/signup endpoint.
// Admin is created via seed script. Employee creation is POST /api/employees (ADMIN only).
// This function keeps the mock implementation for hackathon demo purposes.

export async function registerAdmin(userData) {
  // Mock implementation for demo / hackathon
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

// ─── SESSION HELPERS ──────────────────────────────────

export function getCurrentUser() {
  const saved = localStorage.getItem("dayflow_user")
  return saved ? JSON.parse(saved) : null
}

export function getAuthToken() {
  return localStorage.getItem("dayflow_token")
}

export function logoutUser() {
  localStorage.removeItem("dayflow_user")
  localStorage.removeItem("dayflow_token")
}

// ─── INTERNAL: Normalize backend user for frontend ───

function normalizeUser(backendUser) {
  // Backend roles are UPPERCASE ("ADMIN", "EMPLOYEE")
  // Frontend expects lowercase ("admin", "employee")
  const role = (backendUser.role || "employee").toLowerCase()

  // The profile may be nested or flat depending on the endpoint
  const profile = backendUser.profile || {}

  return {
    id: backendUser.id,
    loginId: backendUser.loginId || backendUser.email,
    email: backendUser.email,
    name: profile.firstName
      ? `${profile.firstName} ${profile.lastName || ""}`.trim()
      : backendUser.email?.split("@")[0] || "User",
    role,
    mustChangePassword: backendUser.mustChangePassword || false,
    // Profile fields (may be empty for admin users without a profile)
    employeeProfileId: profile.id || null,
    employeeCode: profile.employeeCode || null,
    phone: profile.phone || null,
    department: profile.department || (role === "admin" ? "Management" : null),
    jobTitle: profile.jobTitle || (role === "admin" ? "Administrator" : null),
    company: "DayFlow Technologies",
    location: "Bengaluru, IN",
  }
}
