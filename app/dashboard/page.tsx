import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // If onboarding not completed, redirect to onboarding
  if (!profile || !profile.onboarding_completed) {
    redirect('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Avatar and Welcome */}
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-4xl">
              {profile.avatar_url}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile.username}!
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{profile.xp}</div>
              <div className="text-sm text-gray-600">XP</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{profile.streak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900">{profile.hearts}</div>
              <div className="text-sm text-gray-600">Hearts</div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mt-8 flex justify-end">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}
