'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useGlobalState } from '@/app/context/global';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/tasks';
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    login: '',
    password: '',
  });
  const { fetchTasks } = useGlobalState()
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);


      const res = await signIn('credentials', {
        login: formValues.login,
        password: formValues.password,
        redirect: false,
        callbackUrl
      });


      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.ok) {
        toast.success('Signed in successfully!');
        router.push(callbackUrl);
        router.refresh();
        await fetchTasks()
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block mb-2">
              Email or Username
            </label>
            <input
              id="login"
              type="text"
              className="w-full p-2 border rounded "
              value={formValues.login}
              onChange={(e) =>
                setFormValues({ ...formValues, login: e.target.value })
              }
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
              type="password"
              className="w-full p-2 border rounded "
              value={formValues.password}
              onChange={(e) =>
                setFormValues({ ...formValues, password: e.target.value })
              }
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent text-white p-2 rounded hover:bg-accent/80"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
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