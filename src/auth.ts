import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      name: "Guest",
      credentials: {
        name: { label: "Display Name", type: "text", placeholder: "Sports Fan" },
      },
      authorize(credentials) {
        // Guest login — creates a session with just a name
        const name = (credentials?.name as string) || "Guest";
        return {
          id: `guest-${Date.now()}`,
          name,
          email: null,
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
