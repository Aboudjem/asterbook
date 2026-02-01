import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Asterbook
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Gaming/DeFi Platform - Play, Earn & Stake
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition"
          >
            Register
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <FeatureCard
            emoji="🐉"
            title="Virtual Pet"
            description="Raise, feed, and evolve your dragon pet through 3 stages"
          />
          <FeatureCard
            emoji="⚔️"
            title="Arena Battles"
            description="Fight PvE or PvP battles to win Stardust coins"
          />
          <FeatureCard
            emoji="💰"
            title="Staking"
            description="Stake your Stardust to earn passive rewards"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ emoji, title, description }: { emoji: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-slate-700">
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
}
