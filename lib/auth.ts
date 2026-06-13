import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as Parameters<typeof PrismaAdapter>[0]),
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/gmail.send",
          ].join(" "),
        },
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }

      const account = await prisma.account.findFirst({
        where: {
          userId: user.id,
          provider: "google",
        },
        select: {
            access_token: true,
            refresh_token: true,
            expires_at: true
        }
      });

      session.user.gmailAccessToken  = account?.access_token  ?? null
      session.user.gmailRefreshToken = account?.refresh_token ?? null

      return session;
    }
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "database"
  }
};
