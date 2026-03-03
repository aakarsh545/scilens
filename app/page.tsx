import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              <span className="text-xl font-bold text-white">SciLens</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Master Science.
            <br />
            <span className="text-blue-500">One Lesson at a Time.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Gamified physics lessons for Grade 9–12 and beyond. Learn with streaks, XP, and your own custom atom.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="rounded-xl bg-blue-500 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-600 transition-all hover:scale-105"
            >
              Start Learning Free
            </Link>
            <a
              href="#features"
              className="rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white hover:bg-white/5 transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-3xl mb-2">📖</div>
              <div className="text-2xl font-bold text-white">Physics First</div>
              <div className="text-sm text-gray-400 mt-1">Foundation focused</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-2xl font-bold text-white">Grade 9–12</div>
              <div className="text-sm text-gray-400 mt-1">Plus university</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-white">XP & Streaks</div>
              <div className="text-sm text-gray-400 mt-1">Stay motivated</div>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-2xl font-bold text-white">Free to Start</div>
              <div className="text-sm text-gray-400 mt-1">No credit card</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Everything you need to master physics
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Powerful features designed to make learning stick
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Atom Avatar</h3>
              <p className="text-gray-400">Customize your own atom mascot with real electron shells and fun accessories</p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold text-white mb-2">Daily Streaks</h3>
              <p className="text-gray-400">Build lasting learning habits with streak tracking and daily goals</p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-2">XP & Levels</h3>
              <p className="text-gray-400">Earn XP for every lesson completed and level up as you progress</p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Hearts System</h3>
              <p className="text-gray-400">5 lives per day — spend them wisely on quizzes and challenges</p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">Leaderboard</h3>
              <p className="text-gray-400">Compete with learners globally and climb the weekly rankings</p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-white mb-2">Structured Lessons</h3>
              <p className="text-gray-400">Grade-based tracks with quizzes that reinforce understanding</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Start learning in under 2 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                  1
                </div>
                <h3 className="text-xl font-semibold text-white">Sign up & customize</h3>
              </div>
              <p className="text-gray-400 ml-16">
                Create your account and design your unique atom avatar with real electron configurations
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                  2
                </div>
                <h3 className="text-xl font-semibold text-white">Pick your track</h3>
              </div>
              <p className="text-gray-400 ml-16">
                Choose your grade level and we'll personalize the curriculum for you
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-xl font-bold text-white">
                  3
                </div>
                <h3 className="text-xl font-semibold text-white">Learn & earn</h3>
              </div>
              <p className="text-gray-400 ml-16">
                Complete lessons, ace quizzes, earn XP, and build your streak
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to start your science journey?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Join thousands of learners mastering physics one lesson at a time
          </p>
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-blue-500 px-10 py-5 text-lg font-semibold text-white hover:bg-blue-600 transition-all hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-gray-500">
            © 2025 SciLens. Built for curious minds.
          </p>
        </div>
      </footer>
    </div>
  )
}
