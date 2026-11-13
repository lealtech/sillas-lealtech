import type { NextAuthConfig } from "next-auth";

/** Signed-in users stay authenticated for 8 hours. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

/** The session cookie/JWT is refreshed at most once per hour. */
export const SESSION_UPDATE_AGE_SECONDS = 60 * 60;

/**
 * Configuration shared by the Auth.js instance and the proxy. It must stay
 * free of database imports so it can be used before rendering starts.
 */
export const authConfig = {
  // The credentials provider only supports JWT sessions. The token is signed
  // and encrypted with AUTH_SECRET and stored in an HttpOnly cookie.
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    updateAge: SESSION_UPDATE_AGE_SECONDS,
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === "string") {
        session.user.id = token.id;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
