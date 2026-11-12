import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Reads AUTH_SECRET, AUTH_GITHUB_ID and AUTH_GITHUB_SECRET from the environment.
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    jwt({ token, account }) {
      // Stable per-user key: provider + the provider's immutable account id (not the email or username).
      if (account) token.uid = `${account.provider}:${account.providerAccountId}`;
      return token;
    },
    session({ session, token }) {
      if (token.uid && session.user) session.user.id = token.uid as string;
      return session;
    },
  },
});
