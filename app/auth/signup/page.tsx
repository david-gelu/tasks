'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGlobalState } from '@/app/context/global'
import Button from '@/app/components/button/Button'

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { theme } = useGlobalState()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        router.push('/auth/signin')
      } else {
        const data = await response.json()
        setError(data.error)
      }
    } catch (error) {
      setError('An error occurred during sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="shadow-md"
        style={{
          background: theme.colorBg2,
          padding: '2rem',
          borderRadius: '1rem',
          minWidth: '60%',
          boxShadow: `0 0px 3px ${theme.colorGreenDark}`
        }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 border rounded"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          <Button
            type="submit"
            name={isLoading ? 'Signing Up...' : 'Sign Up'}
            padding={"0.5em 1em"}
            borderRad={"0.8rem"}
            fs={"1rem"}
            background={theme.colorGreenLight}
            width='100%'
          />
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-accent hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}