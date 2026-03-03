'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

const AVATARS = ['🔬', '⚗️', '🧲', '🌡️', '🔭', '🧬', '⚡', '🪐']
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-yellow-500',
  'bg-red-500',
]

const GRADE_OPTIONS = [
  { id: 'middle', label: 'Middle School', sublabel: 'Grade 6-8' },
  { id: 'high', label: 'High School', sublabel: 'Grade 9-10' },
  { id: 'senior', label: 'Senior High', sublabel: 'Grade 11-12' },
  { id: 'university', label: 'University', sublabel: 'Self-learning' },
]

const EXPERIENCE_OPTIONS = [
  { id: 'beginner', label: 'Complete beginner', sublabel: "never studied it" },
  { id: 'basics', label: 'Some basics', sublabel: "I've covered the fundamentals" },
  { id: 'intermediate', label: 'Intermediate', sublabel: "I'm comfortable with most topics" },
]

type Step = 1 | 2 | 3 | 4

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Avatar
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)

  // Step 2: Username
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'checking' | 'available' | 'taken' | 'invalid'>('invalid')
  const [usernameError, setUsernameError] = useState<string | null>(null)

  // Step 3: Grade
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)

  // Step 4: Experience
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)

  // Check username availability (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!username) {
        setUsernameStatus('invalid')
        setUsernameError(null)
        return
      }

      // Validate format: 3-20 characters, letters/numbers/underscores only
      const isValid = /^[a-zA-Z0-9_]{3,20}$/.test(username)
      if (!isValid) {
        setUsernameStatus('invalid')
        setUsernameError('Username must be 3-20 characters, letters/numbers/underscores only')
        return
      }

      setUsernameStatus('checking')
      setUsernameError(null)

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle()

      if (error) {
        setUsernameStatus('invalid')
        setUsernameError('Failed to check username')
        return
      }

      if (data) {
        setUsernameStatus('taken')
        setUsernameError('Username is already taken')
      } else {
        setUsernameStatus('available')
        setUsernameError(null)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [username, supabase])

  const canContinue = () => {
    switch (step) {
      case 1:
        return selectedAvatar !== null
      case 2:
        return usernameStatus === 'available'
      case 3:
        return selectedGrade !== null
      case 4:
        return selectedExperience !== null
      default:
        return false
    }
  }

  const handleContinue = async () => {
    if (step < 4) {
      setStep((step + 1) as Step)
    } else {
      // Complete onboarding
      await completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        username: username,
        avatar_url: selectedAvatar!,
        onboarding_completed: true,
        xp: 0,
        streak: 0,
        hearts: 5,
        is_premium: false,
      })

    if (error) {
      console.error('Failed to create profile:', error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  const progress = ((step - 1) / 3) * 100

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-white">Step {step} of 4</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Step Content */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Pick your avatar</h2>
              <p className="mt-2 text-gray-600">Choose an emoji that represents you</p>

              <div className="mt-8 grid grid-cols-4 gap-4">
                {AVATARS.map((avatar, index) => (
                  <button
                    key={avatar}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`flex aspect-square items-center justify-center rounded-full text-4xl transition-all ${
                      selectedAvatar === avatar
                        ? `${AVATAR_COLORS[index]} ring-4 ring-offset-4 ring-blue-500`
                        : `${AVATAR_COLORS[index]} hover:scale-110`
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Choose a username</h2>
              <p className="mt-2 text-gray-600">This is how others will see you</p>

              <div className="mt-8">
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    placeholder="Enter username"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {usernameStatus === 'available' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {usernameStatus === 'taken' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                  {usernameStatus === 'checking' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                    </div>
                  )}
                </div>
                {usernameError && (
                  <p className="mt-2 text-sm text-red-600">{usernameError}</p>
                )}
                {usernameStatus === 'available' && (
                  <p className="mt-2 text-sm text-green-600">Username is available!</p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What grade are you in?</h2>
              <p className="mt-2 text-gray-600">This helps us personalize your learning</p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {GRADE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedGrade(option.id)}
                    className={`rounded-xl border-2 p-6 text-left transition-all ${
                      selectedGrade === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What's your physics experience?</h2>
              <p className="mt-2 text-gray-600">We'll adapt the content to your level</p>

              <div className="mt-8 space-y-4">
                {EXPERIENCE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedExperience(option.id)}
                    className={`w-full rounded-xl border-2 p-6 text-left transition-all ${
                      selectedExperience === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.sublabel}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep((step - 1) as Step)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canContinue() || loading}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                </div>
              ) : step === 4 ? (
                'Complete'
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
