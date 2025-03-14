'use client';

import { signIn, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const { data: session, status } = useSession();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/tasks');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        login,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.replace('/tasks');
      }
    } catch (error) {
      setError('An error occurred during sign in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block mb-2">Email or Username</label>
            <input
              id="login"
              type="text"
              className="w-full p-2 border rounded "
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter your email or username"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">Password</label>
            <input
              id="password"
              type="password"
              className="w-full p-2 border rounded "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white p-2 rounded hover:bg-accent/80"
          >
            Sign In
          </button>
        </form>
        <div className="mt-4 space-y-2">
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
        </div>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-accent hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}