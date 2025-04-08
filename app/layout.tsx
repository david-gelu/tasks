'use client'

import { Nunito } from "next/font/google"
import "./globals.scss"
import NextTopLoader from "nextjs-toploader"
import ContextProviders from "./components/providers/ContextProviders"
import Sidebar from "./components/sidebar/Sidebar"
import GlobalStyles from "./components/providers/GlobalStyles"
import AuthContext from "./context/AuthContext"
import { SessionProvider } from "next-auth/react"

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={nunito.className} suppressHydrationWarning>
        <NextTopLoader
          height={5}
          color="#27AE60"
          easing="cubic-bezier(0.53,0.21,0,1)"
        />
        <SessionProvider refetchInterval={60 * 24} refetchOnWindowFocus={true}>
          <AuthContext>
            <ContextProviders>
              <GlobalStyles>
                <Sidebar />
                <div className="w-full">{children}</div>
              </GlobalStyles>
            </ContextProviders>
          </AuthContext>
        </SessionProvider>
      </body>
    </html>
  )
}
