/**
 * API Service — Centralized backend client for DayFlow
 * 
 * All API calls go through this file.
 * Automatically attaches JWT token from localStorage.
 * Uses the Vite proxy (/api → localhost:5000).
 */

const API_BASE = "/api"

/**
 * Get the stored JWT token
 */
function getToken() {
  return localStorage.getItem("dayflow_token")
}

/**
 * Core fetch wrapper — attaches Authorization header automatically
 */
async function apiFetch(endpoint, options = {}) {
  const token = getToken()
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  // Handle common error responses
  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorData.message || errorMessage
    } catch {
      // Response wasn't JSON, use default message
    }
    throw new Error(errorMessage)
  }

  // Some endpoints return 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

// ─── AUTH ──────────────────────────────────────────────

export function apiLogin(loginId, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ loginId, password }),
  })
}

export function apiGetMe() {
  return apiFetch("/auth/me")
}

export function apiChangePassword(currentPassword, newPassword) {
  return apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

// ─── EMPLOYEES ────────────────────────────────────────

export function apiGetEmployees() {
  return apiFetch("/employees")
}

export function apiGetEmployee(id) {
  return apiFetch(`/employees/${id}`)
}

export function apiGetMyProfile() {
  return apiFetch("/employees/me")
}

export function apiUpdateEmployee(id, data) {
  return apiFetch(`/employees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function apiUpdateMyProfile(data) {
  return apiFetch("/employees/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function apiCreateEmployee(data) {
  return apiFetch("/employees", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ─── ATTENDANCE ───────────────────────────────────────

export function apiCheckIn() {
  return apiFetch("/attendance/check-in", { method: "POST" })
}

export function apiCheckOut() {
  return apiFetch("/attendance/check-out", { method: "POST" })
}

export function apiGetMyAttendance(from, to) {
  const params = new URLSearchParams()
  if (from) params.set("from", from)
  if (to) params.set("to", to)
  const qs = params.toString()
  return apiFetch(`/attendance/me${qs ? `?${qs}` : ""}`)
}

export function apiGetAllAttendance(employeeId, date) {
  const params = new URLSearchParams()
  if (employeeId) params.set("employeeId", employeeId)
  if (date) params.set("date", date)
  const qs = params.toString()
  return apiFetch(`/attendance${qs ? `?${qs}` : ""}`)
}

// ─── LEAVE REQUESTS ───────────────────────────────────

export function apiCreateLeaveRequest(data) {
  return apiFetch("/leave-requests", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function apiGetMyLeaveRequests() {
  return apiFetch("/leave-requests/me")
}

export function apiGetAllLeaveRequests() {
  return apiFetch("/leave-requests")
}

export function apiUpdateLeaveStatus(id, status) {
  return apiFetch(`/leave-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })
}

// ─── PAYROLL ──────────────────────────────────────────

export function apiGetMyPayroll() {
  return apiFetch("/payroll/me")
}

export function apiGetAllPayroll() {
  return apiFetch("/payroll")
}

export function apiGetPayrollRecord(id) {
  return apiFetch(`/payroll/${id}`)
}

export function apiCreatePayroll(data) {
  return apiFetch("/payroll", {
    method: "POST",
    body: JSON.stringify(data),
  })
}
