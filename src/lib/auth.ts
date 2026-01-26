import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { RoleName } from "@prisma/client";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        if (!user.emailVerified) {
          throw new Error("Email not verified. Please check your inbox.");
        }

        if (user && user.password && (await bcrypt.compare(credentials.password, user.password))) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && token.id) {
         const dbUser = await prisma.user.findUnique({ where: { id: token.id as string } });
         if (dbUser) {
            token.roles = dbUser.roles;
            token.photo = dbUser.photo;
            token.profileComplete = dbUser.profileComplete;
         }
      }
      
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.photo = user.photo;
        token.profileComplete = user.profileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as RoleName[];
        session.user.photo = token.photo as string;
        session.user.profileComplete = token.profileComplete as boolean;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          roles: {
            push: RoleName.MEMBER,
          },
        },
      });
    },
  },
};
