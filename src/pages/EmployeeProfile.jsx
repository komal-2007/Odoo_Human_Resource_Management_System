import { useState } from "react"
import { employees } from "../data/mockData"
import ResumeTab from "../components/profile/ResumeTab"
import PrivateInfoTab from "../components/profile/PrivateInfoTab"
import SalaryInfoTab from "../components/profile/SalaryInfoTab"
import SecurityTab from "../components/profile/SecurityTab"

const tabs = ["Resume", "Private Info", "Salary Info", "Security"]

export default function EmployeeProfile({ employeeId, onBack, currentUser }) {
  const [activeTab, setActiveTab] = useState("Resume")

  const employee = employees.find((emp) => emp.id === employeeId)
  const isAdmin = currentUser?.role === "admin"
  const isOwnProfile = currentUser?.loginId === employee?.loginId || currentUser?.email === employee?.privateInfo?.personalEmail

  if (!employee) {
    return (
      <div className="p-8">
        <p className="text-sm text-ink-secondary">Employee not found.</p>
        <button
          onClick={onBack}
          className="mt-3 text-sm text-brand-green hover:underline"
        >
          ← Back to Employees
        </button>
      </div>
    )
  }

  const visibleTabs = tabs.filter((tab) => tab !== "Salary Info" || isAdmin || isOwnProfile)

  return (
    <div className="p-8 space-y-6">
      {/* Back link */}
      <button
        onClick={onBack}
        className="text-sm text-ink-secondary hover:text-ink-primary transition-colors"
      >
        ← Back to Employees
      </button>

      {/* Profile header */}
      <div className="bg-base-panel border border-base-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-brand-blue/15 border border-base-border flex items-center justify-center text-3xl text-brand-blue shrink-0">
            👤
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            <div className="sm:col-span-2">
              <h1 className="font-display font-semibold text-2xl">
                {employee.name}
              </h1>
              <p className="text-sm text-ink-secondary mt-0.5">
                Login ID: {employee.loginId}
              </p>
            </div>

            <div>
              <p className="text-xs text-ink-secondary mb-1">Company</p>
              <p className="text-sm">{employee.company}</p>
            </div>
            <div>
              <p className="text-xs text-ink-secondary mb-1">Department</p>
              <p className="text-sm">{employee.department}</p>
            </div>
            <div>
              <p className="text-xs text-ink-secondary mb-1">Manager</p>
              <p className="text-sm">{employee.manager}</p>
            </div>
            <div>
              <p className="text-xs text-ink-secondary mb-1">Location</p>
              <p className="text-sm">{employee.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-base-border flex gap-1">
        {visibleTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-brand-green text-brand-green"
                : "border-transparent text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Resume" && <ResumeTab employee={employee} />}
      {activeTab === "Private Info" && <PrivateInfoTab employee={employee} />}
      {activeTab === "Salary Info" && (isAdmin || isOwnProfile) && (
        <SalaryInfoTab employee={employee} />
      )}
      {activeTab === "Security" && <SecurityTab employee={employee} />}
    </div>
  )
}
