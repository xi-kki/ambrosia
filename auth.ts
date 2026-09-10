import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Resend({
      from: process.env.EMAIL_FROM || "Ambrosia <noreply@ambrosia-drink.vercel.app>",
    }),
  ],
  // JWT strategy — no DB needed for v1. Add Drizzle adapter later when PG ready
  session: { strategy: "jwt" },
  // Open signup — set AUTH_ALLOWLIST="a@b.com,b@c.com" in Vercel to make invite-only
  callbacks: {
    async signIn({ user }) {
      const allow = process.env.AUTH_ALLOWLIST
      if (!allow) return true // open
      const list = allow.split(",").map(s => s.trim().toLowerCase())
      return !!user.email && list.includes(user.email.toLowerCase())
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verify=1",
  },
})
