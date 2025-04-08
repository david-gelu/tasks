import NextAuth from "next-auth"
import type { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
      email: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    username: string
    id: string
    email: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    email: string
  }
}