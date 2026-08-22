import { useState, useEffect } from "react"
import EmployeeCard from "../components/EmployeeCard"
import { employees as mockEmployees } from "../data/mockData"
import { generateLoginId } from "../utils/idGenerator"
import { apiGetEmployees, apiGetMyProfile, apiCreateEmployee } from "../services/apiService"

export default function Employees({ onSelectEmployee, currentUser }) {
  const [employeeList, setEmployeeList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  const isAdmin = currentUser?.role === "admin"

  // Load employees from backend (falls back to mock data)
  useEffect(() => {
    async function loadEmployees() {
      try {
        if (isAdmin) {
          // Admin sees all employees
          const data = await apiGetEmployees()
          // Normalize backend data to match frontend card expectations
          const normalized = data.map((emp) => ({
            id: emp.id,
            name: `${emp.firstName} ${emp.lastName || ""}`.trim(),
            department: emp.department || "General",
            status: "present", // Will be enhanced with real attendance later
            loginId: emp.user?.loginId || emp.employeeCode || "",
            email: emp.user?.email || "",
            phone: emp.phone || "",
            jobTitle: emp.jobTitle || "",
            employeeCode: emp.employeeCode || "",
          }))
          setEmployeeList(normalized)
        } else {
          // Employee sees their own profile in the directory (plus mock colleagues)
          try {
            const myProfile = await apiGetMyProfile()
            const me = {
              id: myProfile.id,
              name: `${myProfile.firstName} ${myProfile.lastName || ""}`.trim(),
              department: myProfile.department || "General",
              status: "present",
              loginId: myProfile.user?.loginId || myProfile.employeeCode || "",
              email: myProfile.user?.email || "",
              phone: myProfile.phone || "",
              jobTitle: myProfile.jobTitle || "",
            }
            setEmployeeList([me, ...mockEmployees.filter(m => m.id !== me.id)])
          } catch {
            setEmployeeList(mockEmployees)
          }
        }
      } catch (err) {
        console.warn("Could not load employees from backend, using mock data:", err.message)
        setEmployeeList(mockEmployees)
      } finally {
        setLoading(false)
      }
    }
    loadEmployees()
  }, [isAdmin])

  // New employee form state
  const [newEmpData, setNewEmpData] = useState({
    name: "",
    email: "",
    department: "Engineering",
    manager: "Anita Rao",
    location: "Bengaluru, IN",
    status: "present",
  })

  const previewLoginId = generateLoginId(
    currentUser?.company || "DayFlow",
    newEmpData.name || "New Employee",
    new Date().getFullYear(),
    employeeList.length + 1
  )

  const filtered = employeeList.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  )

  const [createError, setCreateError] = useState("")

  async function handleCreateEmployee(e) {
    e.preventDefault()
    if (!newEmpData.name.trim()) return
    setCreateError("")

    // Split name into firstName + lastName for the backend
    const nameParts = newEmpData.name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(" ") || firstName

    try {
      // Try creating via backend API
      const result = await apiCreateEmployee({
        email: newEmpData.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@dayflow.com`,
        firstName,
        lastName,
        department: newEmpData.department,
        jobTitle: newEmpData.department, // Use department as job title default
        dateOfJoining: new Date().toISOString().split("T")[0],
      })

      // Backend returns { employee, user, initialPassword }
      const created = {
        id: result.employee.id,
        name: `${result.employee.firstName} ${result.employee.lastName || ""}`.trim(),
        department: result.employee.department || "General",
        status: "present",
        loginId: result.user?.loginId || result.employee.employeeCode || "",
        email: result.user?.email || "",
        initialPassword: result.initialPassword,
      }
      setEmployeeList([created, ...employeeList])

      // Show the initial password to the admin
      if (result.initialPassword) {
        alert(`Employee created!\n\nLogin ID: ${created.loginId}\nInitial Password: ${result.initialPassword}\n\nPlease share these credentials with the employee.`)
      }
    } catch (err) {
      console.warn("Backend employee creation failed, creating locally:", err.message)
      // Fallback: create locally with mock data
      const newEmployee = {
        id: Date.now(),
        name: newEmpData.name.trim(),
        department: newEmpData.department,
        status: newEmpData.status,
        loginId: previewLoginId,
        company: currentUser?.company || "DayFlow Technologies",
      }
      setEmployeeList([newEmployee, ...employeeList])
    }

    setIsNewModalOpen(false)
    setNewEmpData({
      name: "",
      email: "",
      department: "Engineering",
      manager: "Anita Rao",
      location: "Bengaluru, IN",
      status: "present",
    })
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-ink-primary">
            {isAdmin ? "Company Employee Directory" : "Colleagues Directory"}
          </h1>
          <p className="text-xs text-ink-secondary mt-0.5">
            {isAdmin
              ? "Manage all registered team members, their profiles, and work statuses"
              : "Find your teammates, departments, and communication details"}
          </p>
        </div>

        {/* Toolbar: New Button (Admin only) + Search */}
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <span>+</span>
              <span>New Employee</span>
            </button>
          )}

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search directory..."
            className="w-full sm:w-64 bg-base-panel border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-secondary focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-sm text-ink-secondary">Loading employees...</p>
        </div>
      )}

      {/* Employee grid */}
      {!loading && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((employee) => (
          <EmployeeCard
            key={employee.id}
            employee={employee}
            onClick={() => onSelectEmployee(employee.id)}
          />
        ))}
      </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-ink-secondary py-8 text-center">
          No employees match "{search}".
        </p>
      )}

      {/* Status legend */}
      <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-ink-secondary border-t border-base-border/50">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-green" />
          Present in the office
        </span>
        <span className="flex items-center gap-2">
          <span>✈️</span>
          On leave
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber" />
          Absent (no time off applied)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-ink-secondary" />
          Not clocked in
        </span>
      </div>

      {/* NEW EMPLOYEE MODAL (Admin Only) */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-base-panel border border-base-border rounded-xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-border pb-3">
              <h2 className="text-lg font-semibold font-display text-ink-primary">
                Add New Employee
              </h2>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-ink-secondary hover:text-ink-primary text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs text-ink-secondary mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newEmpData.name}
                  onChange={(e) =>
                    setNewEmpData({ ...newEmpData, name: e.target.value })
                  }
                  placeholder="e.g. John Doe"
                  className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink-secondary mb-1.5">
                    Department
                  </label>
                  <select
                    value={newEmpData.department}
                    onChange={(e) =>
                      setNewEmpData({ ...newEmpData, department: e.target.value })
                    }
                    className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-purple-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-ink-secondary mb-1.5">
                    Status
                  </label>
                  <select
                    value={newEmpData.status}
                    onChange={(e) =>
                      setNewEmpData({ ...newEmpData, status: e.target.value })
                    }
                    className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-purple-500"
                  >
                    <option value="present">Present</option>
                    <option value="on-leave">On Leave</option>
                    <option value="absent">Absent</option>
                    <option value="not-clocked-in">Not Clocked In</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-ink-secondary mb-1.5">
                  Manager
                </label>
                <input
                  type="text"
                  value={newEmpData.manager}
                  onChange={(e) =>
                    setNewEmpData({ ...newEmpData, manager: e.target.value })
                  }
                  placeholder="Manager name"
                  className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Generated ID Banner */}
              <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-800/40">
                <p className="text-[11px] text-purple-300">
                  Auto-Assigned Login ID: <span className="font-mono font-bold text-white">{previewLoginId}</span>
                </p>
                <p className="text-[10px] text-ink-secondary mt-0.5">
                  Initial password will be auto-generated for first-time login.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-md border border-base-border text-ink-secondary hover:text-ink-primary hover:bg-base-sidebar"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}