import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SignOutButton from './SignOutButton'
import AvatarCanvas from './AvatarCanvas'

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
    redirect('/signup')
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

  // Calculate level
  const level = Math.floor((profile.xp || 0) / 100) + 1
  const xpInLevel = (profile.xp || 0) % 100
  const xpToNext = 100 - xpInLevel

  // Format current date
  const now = new Date()
  const formatDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  // Grade label
  const gradeLabels: Record<string, string> = {
    middle: 'Middle School',
    high: 'High School',
    senior: 'Senior High',
    university: 'University',
  }

  // Experience label
  const experienceLabels: Record<string, string> = {
    beginner: 'Beginner',
    basics: 'Knows basics',
    intermediate: 'Intermediate',
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900/40 border-r border-slate-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-sm">⚛️</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">SciLens</span>
          </Link>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center p-6">
          <AvatarCanvas
            elementN={avatarData.elementN}
            color={avatarData.color}
            accessory={avatarData.accessory}
          />
          <div className="mt-4 text-center">
            <div className="text-lg font-bold text-white">{profile.username}</div>
            <div className="text-sm text-slate-400">
              {gradeLabels[profile.grade] || profile.grade}
            </div>
            <div className="text-sm text-slate-400">
              {experienceLabels[profile.experience] || profile.experience}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <div className="px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            🏠 Home
          </div>
          <div className="px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            📖 Learn
          </div>
          <div className="px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            🏆 Leaderboard
          </div>
          <div className="px-3 py-2 text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
            👤 Profile
          </div>
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-slate-800">
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Welcome back, {profile.username}! 👋
          </h1>
          <p className="text-slate-400">{formatDate}</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* XP & Level */}
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">Level {level}</div>
              </div>
            </div>
            <div className="mb-2">
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  style={{ width: `${xpInLevel}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-slate-400">
              {xpInLevel} / 100 XP · {xpToNext} XP to next level
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-lg">🔥</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{profile.streak || 0}</div>
                <div className="text-sm text-slate-400">
                  {profile.streak === 0 ? 'Start your streak today!' : 'Keep it up!'}
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 justify-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                <div
                  key={day}
                  className={`h-2 w-2 rounded-full ${
                    i === now.getDay() - 1
                      ? 'bg-blue-500'
                      : i < now.getDay() - 1 && (profile.streak || 0) > 0
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Hearts */}
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <span className="text-lg">❤️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{profile.hearts || 5}</div>
                <div className="text-sm text-slate-400">
                  {profile.hearts === 5 ? 'Full hearts!' : 'Hearts refill daily'}
                </div>
              </div>
            </div>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={i <= (profile.hearts || 5) ? 'text-red-500' : 'text-slate-600'}
                >
                  ❤️
                </span>
              ))}
            </div>
            <div className="text-xs text-slate-500 text-center mt-2">Spend hearts on quizzes</div>
          </div>
        </div>

        {/* Your Journey */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent mb-6">
            Your Journey
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {/* Start Learning */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Physics Awaits</h3>
              <p className="text-slate-400 text-sm mb-6">
                Your personalized curriculum based on your grade and experience is ready.
              </p>
              <button
                onClick={(e) => e.preventDefault()}
                className="inline-block rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                Start Learning →
              </button>
            </div>

            {/* Daily Challenge */}
            <div className="rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Daily Challenge ⚡</h3>
              <p className="text-slate-400 text-sm mb-6">
                Complete today's challenge to earn bonus XP and keep your streak alive.
              </p>
              <button
                disabled
                className="rounded-xl border border-slate-600 px-6 py-3 text-sm font-medium text-slate-500 opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>

        {/* More coming soon */}
        <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Lessons, challenges, and leaderboards are on the way.
          </h3>
          <p className="text-slate-500 text-sm">
            You'll be the first to know when they're ready.
          </p>
        </div>
      </main>
    </div>
  )
}
