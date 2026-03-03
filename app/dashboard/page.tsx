import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Welcome to SciLens
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Logged in as <span className="font-medium text-zinc-900 dark:text-zinc-50">{user.email}</span>
          </p>

          <form action="/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
