'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/tasks'
  const decodedCallbackUrl = decodeURIComponent(callbackUrl)
  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      router.push(decodedCallbackUrl)
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (session) {
    return null
  }

  return <>{children}</>
}