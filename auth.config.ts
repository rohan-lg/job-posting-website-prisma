import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";

// Edge-safe config (no database imports) so middleware can use it.
export default {
  session: {
    strategy: "jwt",
  },
  providers: [Github],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
