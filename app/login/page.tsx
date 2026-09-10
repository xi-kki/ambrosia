"use client"
import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await signIn("resend", { email, redirect: true, callbackUrl: "/formulate" })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ambrosia-dark text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
        <h1 className="font-heading text-4xl mb-2">Meet Bevis</h1>
        <p className="text-white/70 mb-6 text-sm">Enter your email once — we’ll send a secure magic link. No password needed.</p>

        {!sent ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-ambrosia-pink"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-ambrosia-pink text-ambrosia-dark font-bold hover:scale-[1.02] transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send magic link →"}
            </button>
            <p className="text-xs text-white/40 text-center">Open signup — invite-only later via AUTH_ALLOWLIST</p>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-ambrosia-pink font-medium">Check your email ✉️</p>
            <p className="text-white/60 text-sm mt-2">Click the link to access Bevis. It expires in 15 minutes.</p>
          </div>
        )}

        <a href="/" className="block text-center text-white/50 text-sm mt-6 hover:text-white">← Back to Home</a>
      </div>
    </div>
  )
}
