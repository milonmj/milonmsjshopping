import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_LIMIT = 8; // attempts
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes, per IP+phone

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Phone & Password",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.password) return null;

        const ip = getClientIp((req?.headers as any) ?? {});
        const rl = checkRateLimit(`login:${ip}:${credentials.phone}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
        if (!rl.allowed) return null;

        const user = await prisma.user.findUnique({ where: { phone: credentials.phone } });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.role !== "CUSTOMER") return null;

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone || !credentials?.password) return null;

        const ip = getClientIp((req?.headers as any) ?? {});
        const rl = checkRateLimit(`admin-login:${ip}:${credentials.phone}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
        if (!rl.allowed) return null;

        const user = await prisma.user.findUnique({ where: { phone: credentials.phone } });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.role !== "ADMIN") return null;

        return {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as "ADMIN" | "STAFF" | "CUSTOMER";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
