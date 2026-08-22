import { useState } from "react"
import { loginUser } from "../services/authService"

export default function SignIn({ onSignInSuccess, onNavigateToSignUp }) {
  const [loginId, setLoginId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")

    if (!loginId.trim()) {
      setError("Please enter your Login ID or Email.")
      return
    }
    if (!password) {
      setError("Please enter your password.")
      return
    }

    try {
      setLoading(true)
      const user = await loginUser({ loginId: loginId.trim(), password })
      if (onSignInSuccess) {
        onSignInSuccess(user)
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-bg text-ink-primary flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md bg-base-panel border border-base-border rounded-2xl p-8 shadow-2xl space-y-6">
        {/* App Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-sidebar border border-base-border mb-2">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center font-display font-bold text-xs text-white">
              W
            </div>
            <span className="font-display font-bold text-base tracking-tight text-ink-primary">
              Workly
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-ink-primary">
            Sign in
          </h1>
          <p className="text-xs text-ink-secondary">
            Enter your Login ID or Work Email to access your HR dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <span>??</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login ID / Email */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Login Id/Email :-
            </label>
            <input
              type="text"
              required
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="e.g. WOADUS20260001 or admin@workly.com"
              className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-ink-secondary mb-1.5">
              Password :-
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-base-sidebar border border-base-border rounded-lg px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-base-border">
          <p className="text-xs text-ink-secondary">
            Don't have an Account?{" "}
            <button
              type="button"
              onClick={onNavigateToSignUp}
              className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
