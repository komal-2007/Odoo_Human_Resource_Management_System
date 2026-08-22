import { useState, useId } from "react"
import { generateLoginId } from "../utils/idGenerator"
import { registerAdmin } from "../services/authService"

export default function SignUp({ onSignUpSuccess, onNavigateToSignIn }) {
  const [companyName, setCompanyName] = useState("")
  const [companyLogo, setCompanyLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const logoInputId = useId()

  // Live calculation of the generated Login ID per wireframe formula
  const generatedId = generateLoginId(
    companyName || "DayFlow",
    name || "Admin User",
    new Date().getFullYear(),
    1
  )

  // Handle Logo Image Upload
  function handleLogoUpload(e) {
    const file = e.target.files[0]
    if (file) {
      setCompanyLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Sign Up Form Submission
  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!companyName.trim()) {
      setError("Please enter your company name.")
      return
    }
    if (!name.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (!email.trim()) {
      setError("Please enter a valid email address.")
      return
    }
    if (!phone.trim()) {
      setError("Please enter your contact phone number.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.")
      return
    }

    try {
      setLoading(true)
      const userData = {
        companyName: companyName.trim(),
        companyLogo: logoPreview,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        loginId: generatedId,
      }

      const registeredUser = await registerAdmin(userData)
      if (onSignUpSuccess) {
        onSignUpSuccess(registeredUser)
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-bg text-ink-primary flex items-center justify-center p-4 py-8 font-body selection:bg-brand-purple selection:text-white">
      <div className="w-full max-w-xl bg-base-panel border border-base-border rounded-2xl p-8 shadow-2xl space-y-6">
        {/* App Logo & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-base-sidebar border border-base-border mb-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center font-display font-bold text-xs text-white">
              D
            </div>
            <span className="font-display font-bold text-base tracking-tight text-ink-primary">
              DayFlow
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-ink-primary">
            Create Admin Account
          </h1>
          <p className="text-xs text-ink-secondary">
            Set up your organization workspace and generate your Admin credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name & Logo Upload */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Company Name :-
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. DayFlow Technologies"
                className="flex-1 bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
              />

              {/* Logo Upload Button & Preview */}
              <label
                htmlFor={logoInputId}
                className="cursor-pointer shrink-0 px-3 py-2 bg-base-sidebar hover:bg-base-sidebar/80 border border-base-border rounded-lg text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
                title="Upload Company Logo"
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-5 h-5 rounded object-cover"
                  />
                ) : (
                  <span>??</span>
                )}
                <span>{logoPreview ? "Change Logo" : "Upload Logo"}</span>
              </label>
              <input
                id={logoInputId}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Name :-
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Email & Phone (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                Email :-
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@company.com"
                className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                Phone :-
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Password & Confirm Password (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                Password :-
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="��������"
                  className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 pr-10 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary text-sm p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "??" : "???"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-secondary mb-1.5">
                Confirm Password :-
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="��������"
                  className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 pr-10 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-secondary hover:text-ink-primary text-sm p-1"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? "??" : "???"}
                </button>
              </div>
            </div>
          </div>

          {/* Generated Login ID Callout (per Excalidraw formula) */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-purple-300/80 font-medium">
                Auto-Generated Login ID
              </p>
              <p className="text-base font-display font-bold text-purple-200 tracking-wider">
                {generatedId}
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-mono">
              [Auto-Assigned]
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Workspace...</span>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Footer: Switch to Sign In */}
        <div className="text-center pt-2 border-t border-base-border">
          <p className="text-xs text-ink-secondary">
            Already have an account ?{" "}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
