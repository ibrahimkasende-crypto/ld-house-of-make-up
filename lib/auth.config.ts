import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? "ldhouse-demo-auth-secret",
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (!path.startsWith("/admin")) return true;
      if (path.startsWith("/admin/login")) return true;
      return !!auth?.user;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = "admin";
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
