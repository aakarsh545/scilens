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

  // Parse avatar data
  let avatarData = { elementN: 1, color: '#3b82f6', accessory: 'None' }
  try {
    if (profile.avatar_url) {
      avatarData = JSON.parse(profile.avatar_url)
    }
  } catch {
    // Use default if parsing fails
  }

  const element = Object.values({
    H: { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, shells: [1] },
    He: { symbol: 'He', name: 'Helium', atomicNumber: 2, shells: [2] },
    Li: { symbol: 'Li', name: 'Lithium', atomicNumber: 3, shells: [2, 1] },
    Be: { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, shells: [2, 2] },
    B: { symbol: 'B', name: 'Boron', atomicNumber: 5, shells: [2, 3] },
    C: { symbol: 'C', name: 'Carbon', atomicNumber: 6, shells: [2, 4] },
    N: { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, shells: [2, 5] },
    O: { symbol: 'O', name: 'Oxygen', atomicNumber: 8, shells: [2, 6] },
  }).find(e => e.atomicNumber === avatarData.elementN) || { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, shells: [1] }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Avatar and Welcome */}
          <div className="flex items-center gap-6">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
              style={{ backgroundColor: avatarData.color + '20' }}
            >
              <span style={{ color: avatarData.color }}>{element.symbol}</span>
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
