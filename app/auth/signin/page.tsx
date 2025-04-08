'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useGlobalState } from '@/app/context/global'
import Button from '@/app/components/button/Button'

export default function SignIn() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/tasks'
  const decodedCallbackUrl = decodeURIComponent(callbackUrl)

  const { theme, fetchTasks } = useGlobalState()

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const res = await signIn('credentials', {
        login: formData.get('login'),
        password: formData.get('password'),
        redirect: false,
        callbackUrl: decodedCallbackUrl,
      })

      if (res?.error) {
        toast.error(res.error)
        return
      }

      if (res?.ok) {
        await fetchTasks()
        // Use the decoded callback URL for navigation
        window.location.href = decodedCallbackUrl
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-md "
        style={{
          background: theme.colorBg2,
          padding: '2rem',
          borderRadius: '1rem',
          minWidth: '60%',
          boxShadow: ` 0 0px 3px ${theme.color1}`
        }}>
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block mb-2">
              Email or Username
            </label>
            <input
              id="login"
              name="login"
              type="text"
              className="w-full p-2 border rounded "
              placeholder="Enter your email or username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full p-2 border rounded "
              placeholder="Enter your password"
              required
            />
          </div>
          <Button
            type="submit"
            name={isLoading ? 'Signing In...' : 'Sign In'}
            padding={"0.5em 1em"}
            borderRad={"0.8rem"}
            fs={"1rem"}
            background={theme.colorGreenLight}
            width='100%'
          />
        </form>
        {/* <div className="mt-4 space-y-2">
          <button
            onClick={() => signIn('google')}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => signIn('facebook')}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Sign in with Facebook
          </button>
        </div> */}
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-accent hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div >
  )
}