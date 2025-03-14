'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Tasks from '@/app/components/tasks/Tasks'
import { useGlobalState } from "@/app/context/global"

export default function TasksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { tasks, allTasks, isLoading } = useGlobalState()

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Auth Status:', status)
      console.log('Session:', session)

      if (status === 'unauthenticated') {
        console.log('Redirecting to signin...')
        await router.replace('/auth/signin')
        return
      }

      if (status === 'authenticated' && session?.user) {
        console.log('User authenticated, fetching tasks...')
        await allTasks()
      }
    }

    checkAuth()
  }, [status, session, router])

  // Show loading state while checking auth or loading tasks
  if (status === 'loading' || isLoading) {
    console.log('Loading state...')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  // Redirect if no user session
  if (!session?.user) {
    console.log('No user session, redirecting...')
    return null
  }

  console.log('Rendering tasks page')
  return <Tasks title="All Tasks" tasks={tasks} />
}