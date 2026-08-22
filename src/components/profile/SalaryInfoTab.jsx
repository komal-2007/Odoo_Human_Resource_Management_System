// Salary Info tab — admin/HR only. Shows wage, salary components,
// provident fund contribution, and tax deductions.
function formatINR(amount) {
  return `₹${amount.toLocaleString("en-IN")}`
}

export default function SalaryInfoTab({ employee }) {
  const { salary } = employee

  return (
    <div className="space-y-4">
      {/* Wage summary */}
      <section className="bg-base-panel border border-base-border rounded-xl p-5 grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-ink-secondary mb-1">Month Wage</p>
          <p className="text-lg font-display font-semibold">
            {formatINR(salary.monthWage)}{" "}
            <span className="text-xs text-ink-secondary font-body">/ month</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-secondary mb-1">Yearly Wage</p>
          <p className="text-lg font-display font-semibold">
            {formatINR(salary.yearlyWage)}{" "}
            <span className="text-xs text-ink-secondary font-body">/ yearly</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-secondary mb-1">
            No. of working days / week
          </p>
          <p className="text-lg font-display font-semibold">
            {salary.workingDaysPerWeek}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-secondary mb-1">Break Time</p>
          <p className="text-lg font-display font-semibold">
            {salary.breakTimeHrs} hrs
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Salary components */}
        <section className="bg-base-panel border border-base-border rounded-xl p-5">
          <h3 className="font-display font-semibold text-sm mb-4">
            Salary Components
          </h3>
          <ul className="space-y-3">
            {salary.components.map((c) => (
              <li
                key={c.label}
                className="flex items-center justify-between text-sm border-b border-base-border pb-3 last:border-0 last:pb-0"
              >
                <span>{c.label}</span>
                <span className="text-ink-secondary">
                  {formatINR(c.amountPerMonth)} / month ·{" "}
                  <span className="text-ink-primary">{c.percentOfWage}%</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-4">
          {/* Provident fund */}
          <section className="bg-base-panel border border-base-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm mb-4">
              Provident Fund (PF) Contribution
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-base-border pb-3">
                <span>Employee</span>
                <span className="text-ink-secondary">
                  {formatINR(salary.providentFund.employeeContribution)} / month ·{" "}
                  <span className="text-ink-primary">
                    {salary.providentFund.percent}%
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Employer</span>
                <span className="text-ink-secondary">
                  {formatINR(salary.providentFund.employerContribution)} / month ·{" "}
                  <span className="text-ink-primary">
                    {salary.providentFund.percent}%
                  </span>
                </span>
              </div>
            </div>
          </section>

          {/* Tax deductions */}
          <section className="bg-base-panel border border-base-border rounded-xl p-5">
            <h3 className="font-display font-semibold text-sm mb-4">
              Tax Deductions
            </h3>
            <ul className="space-y-3">
              {salary.taxDeductions.map((t) => (
                <li
                  key={t.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span>{t.label}</span>
                  <span className="text-ink-secondary">
                    {formatINR(t.amountPerMonth)} / month
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
