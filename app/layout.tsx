'use client'

import { Nunito } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.scss"
import NextTopLoader from "nextjs-toploader"
import ContextProviders from "./components/providers/ContextProviders"
import Sidebar from "./components/sidebar/Sidebar"
import GlobalStyles from "./components/providers/GlobalStyles"
import { dark } from "@clerk/themes"

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
    <ClerkProvider
      appearance={{
        baseTheme: [dark],
      }}
    >
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
        <body className={nunito.className}>
          <NextTopLoader
            height={5}
            color="#27AE60"
            easing="cubic-bezier(0.53,0.21,0,1)"
          />
          <ContextProviders>
            <GlobalStyles>
              <Sidebar />
              <div className="w-full">{children}</div>
            </GlobalStyles>
          </ContextProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
