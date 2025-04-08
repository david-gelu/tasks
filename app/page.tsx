'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/tasks'
  const decodedCallbackUrl = decodeURIComponent(callbackUrl)

  useEffect(() => {
    if (status === 'loading') return

    if (session) {
      router.push(decodedCallbackUrl)
    } else {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  return null // or loading spinner
}
