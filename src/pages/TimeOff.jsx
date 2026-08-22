import { useState } from "react"
import { initialLeaveRequests, leaveAllocations } from "../data/timeOffData"
import { employees } from "../data/mockData"

export default function TimeOff() {
  const [activeTab, setActiveTab] = useState("timeoff") // "timeoff" | "allocation"
  const [requests, setRequests] = useState(initialLeaveRequests)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All") // "All" | "Pending" | "Approved" | "Rejected"
  const [isModalOpen, setIsModalOpen] = useState(false)

  // New leave form state
  const [formData, setFormData] = useState({
    employeeId: employees[0]?.id || 1,
    leaveType: "Paid Leave",
    startDate: "",
    endDate: "",
    reason: "",
  })

  // Filter requests based on search query and status filter
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(search.toLowerCase()) ||
      req.department.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "All" ? true : req.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Handlers for Admin actions
  function handleApprove(id) {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Approved" } : req
      )
    )
  }

  function handleReject(id) {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "Rejected" } : req
      )
    )
  }

  // Handle new request submission
  function handleCreateRequest(e) {
    e.preventDefault()
    if (!formData.startDate || !formData.endDate) {
      alert("Please select both start and end dates.")
      return
    }

    const selectedEmp = employees.find(
      (emp) => emp.id === Number(formData.employeeId)
    )

    // Calculate rough number of days
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const newRequest = {
      id: Date.now(),
      employeeId: Number(formData.employeeId),
      employeeName: selectedEmp ? selectedEmp.name : "Unknown",
      department: selectedEmp ? selectedEmp.department : "General",
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: diffDays > 0 ? diffDays : 1,
      reason: formData.reason || "No remarks provided",
      status: "Pending",
      appliedOn: new Date().toISOString().slice(0, 10),
    }

    setRequests([newRequest, ...requests])
    setIsModalOpen(false)
    setFormData({
      employeeId: employees[0]?.id || 1,
      leaveType: "Paid Leave",
      startDate: "",
      endDate: "",
      reason: "",
    })
  }

  return (
    <div className="p-8 space-y-6">
      {/* Top Sub-Tabs (per wireframe: Time Off | Allocation) */}
      <div className="flex items-center justify-between border-b border-base-border pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("timeoff")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "timeoff"
                ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                : "text-ink-secondary hover:text-ink-primary hover:bg-base-panel"
            }`}
          >
            Time Off Requests
          </button>
          <button
            onClick={() => setActiveTab("allocation")}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
              activeTab === "allocation"
                ? "bg-brand-green/10 text-brand-green border border-brand-green/20"
                : "text-ink-secondary hover:text-ink-primary hover:bg-base-panel"
            }`}
          >
            Allocation
          </button>
        </div>

        {/* New Time Off Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-md bg-brand-green text-base-bg text-sm font-semibold hover:bg-brand-green/90 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <span>+</span>
          <span>New Time Off</span>
        </button>
      </div>

      {/* SUB-TAB 1: TIME OFF REQUESTS TABLE */}
      {activeTab === "timeoff" && (
        <div className="space-y-4">
          {/* Toolbar: Search + Status Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by employee, leave type, or department..."
              className="flex-1 max-w-md bg-base-panel border border-base-border rounded-md px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary focus:outline-none focus:border-brand-green/50"
            />

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 bg-base-panel border border-base-border p-1 rounded-lg">
              {["All", "Pending", "Approved", "Rejected"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === status
                      ? "bg-brand-green text-base-bg font-semibold"
                      : "text-ink-secondary hover:text-ink-primary"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-base-panel border border-base-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-border text-left text-xs text-ink-secondary bg-base-sidebar/40">
                  <th className="px-5 py-3.5 font-medium">Employee</th>
                  <th className="px-5 py-3.5 font-medium">Leave Type</th>
                  <th className="px-5 py-3.5 font-medium">Dates</th>
                  <th className="px-5 py-3.5 font-medium">Days</th>
                  <th className="px-5 py-3.5 font-medium">Reason</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-base-border last:border-0 hover:bg-base-sidebar/20 transition-colors"
                  >
                    {/* Employee info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-blue/15 border border-base-border flex items-center justify-center text-xs text-brand-blue font-semibold">
                          {req.employeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-ink-primary">
                            {req.employeeName}
                          </p>
                          <p className="text-xs text-ink-secondary">
                            {req.department}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                          req.leaveType === "Paid Leave"
                            ? "bg-brand-blue/15 text-brand-blue"
                            : req.leaveType === "Sick Leave"
                            ? "bg-brand-amber/15 text-brand-amber"
                            : "bg-ink-secondary/15 text-ink-secondary"
                        }`}
                      >
                        {req.leaveType}
                      </span>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-3.5 text-ink-secondary text-xs">
                      {req.startDate} to {req.endDate}
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-3.5 text-ink-primary font-medium text-xs">
                      {req.days} {req.days === 1 ? "day" : "days"}
                    </td>

                    {/* Reason */}
                    <td className="px-5 py-3.5 text-ink-secondary text-xs max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${
                          req.status === "Approved"
                            ? "bg-brand-green/15 text-brand-green"
                            : req.status === "Pending"
                            ? "bg-brand-amber/15 text-brand-amber"
                            : "bg-brand-red/15 text-brand-red"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            req.status === "Approved"
                              ? "bg-brand-green"
                              : req.status === "Pending"
                              ? "bg-brand-amber"
                              : "bg-brand-red"
                          }`}
                        />
                        {req.status}
                      </span>
                    </td>

                    {/* Admin Action Buttons */}
                    <td className="px-5 py-3.5 text-right">
                      {req.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="px-3 py-1 text-xs font-semibold rounded bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-base-bg transition-colors"
                            title="Approve Leave Request"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-3 py-1 text-xs font-semibold rounded bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-base-bg transition-colors"
                            title="Reject Leave Request"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-ink-secondary italic">
                          Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRequests.length === 0 && (
              <p className="text-sm text-ink-secondary px-5 py-8 text-center">
                No leave requests match the selected filters.
              </p>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ALLOCATION OVERVIEW */}
      {activeTab === "allocation" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-base-panel border border-base-border rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-1">Total Paid Leaves Quota</p>
              <p className="text-2xl font-bold font-display text-brand-blue">15 Days / Year</p>
              <p className="text-xs text-ink-secondary mt-2">Standard employee yearly allowance</p>
            </div>
            <div className="bg-base-panel border border-base-border rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-1">Total Sick Leaves Quota</p>
              <p className="text-2xl font-bold font-display text-brand-amber">10 Days / Year</p>
              <p className="text-xs text-ink-secondary mt-2">Medical and emergency medical leave</p>
            </div>
            <div className="bg-base-panel border border-base-border rounded-xl p-5">
              <p className="text-xs text-ink-secondary mb-1">Pending Approval Queue</p>
              <p className="text-2xl font-bold font-display text-brand-green">
                {requests.filter((r) => r.status === "Pending").length} Requests
              </p>
              <p className="text-xs text-ink-secondary mt-2">Awaiting Admin / HR review</p>
            </div>
          </div>

          {/* Employee Allocation Table */}
          <div className="bg-base-panel border border-base-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-base-border">
              <h3 className="font-semibold text-sm text-ink-primary">
                Employee Leave Balances
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-base-border text-left text-xs text-ink-secondary bg-base-sidebar/40">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Department</th>
                  <th className="px-5 py-3 font-medium">Paid Leave (Used / Total)</th>
                  <th className="px-5 py-3 font-medium">Sick Leave (Used / Total)</th>
                  <th className="px-5 py-3 font-medium">Unpaid Leave Taken</th>
                  <th className="px-5 py-3 font-medium">Remaining Paid</th>
                </tr>
              </thead>
              <tbody>
                {leaveAllocations.map((alloc) => (
                  <tr
                    key={alloc.id}
                    className="border-b border-base-border last:border-0"
                  >
                    <td className="px-5 py-3 font-medium text-ink-primary">
                      {alloc.employeeName}
                    </td>
                    <td className="px-5 py-3 text-ink-secondary text-xs">
                      {alloc.department}
                    </td>
                    <td className="px-5 py-3 text-ink-secondary text-xs">
                      <span className="text-ink-primary font-medium">{alloc.paidUsed}</span> / {alloc.paidTotal} days
                    </td>
                    <td className="px-5 py-3 text-ink-secondary text-xs">
                      <span className="text-ink-primary font-medium">{alloc.sickUsed}</span> / {alloc.sickTotal} days
                    </td>
                    <td className="px-5 py-3 text-ink-secondary text-xs">
                      {alloc.unpaidUsed} days
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-brand-green/10 text-brand-green">
                        {alloc.paidTotal - alloc.paidUsed} days left
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW TIME OFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-base-panel border border-base-border rounded-xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-base-border pb-3">
              <h2 className="text-lg font-semibold font-display text-ink-primary">
                Apply for Time Off
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-secondary hover:text-ink-primary text-lg"
              >
                ?
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              {/* Employee selector */}
              <div>
                <label className="block text-xs text-ink-secondary mb-1.5">
                  Employee
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-green/50"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-xs text-ink-secondary mb-1.5">
                  Leave Type
                </label>
                <select
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                  className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-green/50"
                >
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ink-secondary mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-green/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-ink-secondary mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-green/50"
                  />
                </div>
              </div>

              {/* Reason / Remarks */}
              <div>
                <label className="block text-xs text-ink-secondary mb-1.5">
                  Reason / Remarks
                </label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder="Explain the reason for leave..."
                  className="w-full bg-base-sidebar border border-base-border rounded-md px-3 py-2 text-sm text-ink-primary focus:outline-none focus:border-brand-green/50 placeholder:text-ink-secondary"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-md border border-base-border text-ink-secondary hover:text-ink-primary hover:bg-base-sidebar transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-md bg-brand-green text-base-bg hover:bg-brand-green/90 transition-colors"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
