import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import prisma from "@/app/utils/connect"
import "next-auth/jwt"
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      username: string
    } & DefaultSession["user"]
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        login: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          throw new Error("Please enter both login and password")
        }

        try {
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.login.toLowerCase() },
                { username: credentials.login.toLowerCase() }
              ]
            }
          })

          if (!user) {
            console.log('No user found for login:', credentials.login);
            throw new Error("Invalid login credentials")
          }

          if (!user.password) {
            console.log('User has no password set');
            throw new Error("Invalid login method")
          }

          const passwordValid = await compare(credentials.password, user.password)

          if (!passwordValid) {
            console.log('Invalid password for user:', user.email);
            throw new Error("Invalid login credentials")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.username,
            username: user.username
          }
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const productionUrl = process.env.NEXTAUTH_URL ?? baseUrl
      const baseURL = process.env.NODE_ENV === 'production' ? productionUrl : baseUrl

      if (url.startsWith("/")) {
        return `${baseURL}${url}`
      } else if (new URL(url).origin === baseURL) {
        return url
      }
      return baseURL
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}