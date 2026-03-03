'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'signin' | 'signup'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">SciLens</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Learn science, earn rewards</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 pb-3 text-center text-sm font-medium transition-colors ${
                tab === 'signin'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 pb-3 text-center text-sm font-medium transition-colors ${
                tab === 'signup'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700 dark:border-zinc-600 dark:border-t-zinc-300" />
            ) : (
              <>
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">or</span>
            <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              ) : tab === 'signin' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
