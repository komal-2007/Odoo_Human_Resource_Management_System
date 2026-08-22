// Security tab — kept simple: login ID, password status, 2FA status.
export default function SecurityTab({ employee }) {
  const { security } = employee

  return (
    <div className="bg-base-panel border border-base-border rounded-xl p-5 max-w-md space-y-5">
      <div className="flex items-center justify-between border-b border-base-border pb-4">
        <div>
          <p className="text-sm font-medium">Login ID</p>
          <p className="text-xs text-ink-secondary mt-0.5">
            System-generated, used to sign in
          </p>
        </div>
        <p className="text-sm text-ink-secondary">{employee.loginId}</p>
      </div>

      <div className="flex items-center justify-between border-b border-base-border pb-4">
        <div>
          <p className="text-sm font-medium">Password</p>
          <p className="text-xs text-ink-secondary mt-0.5">
            Last changed on {security.lastPasswordChange}
          </p>
        </div>
        <button
          title="Coming soon"
          className="text-xs font-medium px-3 py-1.5 rounded-md bg-base-sidebar border border-base-border text-ink-secondary cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Two-Factor Authentication</p>
          <p className="text-xs text-ink-secondary mt-0.5">
            Adds an extra step when signing in
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            security.twoFactorEnabled
              ? "bg-brand-green/10 text-brand-green"
              : "bg-brand-amber/10 text-brand-amber"
          }`}
        >
          {security.twoFactorEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  )
}
