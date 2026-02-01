'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Layout components
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

// Profile components
import { ProfileHero, UserProfile } from '@/components/profile/profile-hero';

// UI components
import { GlassCard } from '@/components/ui/glass-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { AvatarBorder, BorderType } from '@/components/avatar/avatar-border';
import { NameEffect, NameEffectType } from '@/components/effects/name-effect';
import { cn } from '@/lib/utils';

type ProfileTab = 'overview' | 'edit' | 'borders' | 'effects';

const availableBorders: { id: BorderType; name: string; price: number; owned: boolean }[] = [
  { id: 'simple', name: 'Simple', price: 0, owned: true },
  { id: 'luminous', name: 'Luminous', price: 500, owned: true },
  { id: 'gradient', name: 'Gradient', price: 750, owned: false },
  { id: 'gold', name: 'Gold', price: 1000, owned: false },
  { id: 'neon', name: 'Neon', price: 1500, owned: true },
  { id: 'fire', name: 'Fire', price: 2000, owned: false },
  { id: 'ice', name: 'Ice', price: 2000, owned: false },
  { id: 'galaxy', name: 'Galaxy', price: 3000, owned: false },
  { id: 'rainbow-flow', name: 'Rainbow Flow', price: 5000, owned: false },
  { id: 'cosmic-legendary', name: 'Cosmic Legendary', price: 10000, owned: false },
];

const availableEffects: { id: NameEffectType; name: string; price: number; owned: boolean }[] = [
  { id: 'rainbow', name: 'Rainbow', price: 0, owned: true },
  { id: 'neon-blue', name: 'Neon Blue', price: 500, owned: true },
  { id: 'fire', name: 'Fire', price: 1000, owned: false },
  { id: 'gold', name: 'Gold', price: 1500, owned: true },
  { id: 'glitch', name: 'Glitch', price: 2000, owned: false },
  { id: 'matrix', name: 'Matrix', price: 2500, owned: false },
  { id: 'thunder', name: 'Thunder', price: 3000, owned: false },
  { id: 'cosmic', name: 'Cosmic', price: 5000, owned: false },
  { id: 'hologram', name: 'Hologram', price: 7500, owned: false },
  { id: 'royal', name: 'Royal', price: 10000, owned: false },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Form states for edit tab
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDiscord, setEditDiscord] = useState('');
  const [editTwitter, setEditTwitter] = useState('');

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Fetch user profile
  useEffect(() => {
    async function fetchProfile() {
      if (status !== 'authenticated' || !session) return;

      try {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const profile: UserProfile = {
          id: '1',
          username: session.user?.username || session.user?.name || 'Adventurer',
          email: session.user?.email || '',
          avatar: session.user?.image || null,
          banner: null,
          bio: 'Crypto enthusiast and pet battler. Always looking for the next adventure!',
          isPremium: true,
          activeBorder: 'luminous',
          activeEffect: 'rainbow',
          stardustBalance: 12450,
          onlineTime: '156h',
          joinDate: 'Jan 2024',
          arenaWins: 42,
          socialLinks: {
            discord: 'adventurer#1234',
            twitter: '@adventurer',
          },
        };

        setUserProfile(profile);
        setEditUsername(profile.username);
        setEditBio(profile.bio || '');
        setEditDiscord(profile.socialLinks?.discord || '');
        setEditTwitter(profile.socialLinks?.twitter || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [status, session]);

  const handleSaveProfile = async () => {
    // Save profile logic here
    console.log('Saving profile...');
  };

  const handleSelectBorder = (border: BorderType) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, activeBorder: border });
    }
  };

  const handleSelectEffect = (effect: NameEffectType) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, activeEffect: effect });
    }
  };

  // Show loading while checking auth
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !userProfile) {
    return null;
  }

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
    },
    {
      id: 'borders',
      label: 'Avatar Borders',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: 'effects',
      label: 'Name Effects',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header
        user={{
          username: userProfile.username,
          avatar: userProfile.avatar || undefined,
        }}
      />
      <Sidebar
        activePath="/profile"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}
      >
        <div className="max-w-[1200px] mx-auto">
          {/* Profile Hero */}
          <div className="mb-6">
            <ProfileHero
              user={userProfile}
              onEditClick={() => setActiveTab('edit')}
            />
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Account Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-slate-400">Member Since</span>
                    <span className="text-white font-medium">{userProfile.joinDate}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-slate-400">Total Online Time</span>
                    <span className="text-white font-medium">{userProfile.onlineTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-slate-400">Arena Wins</span>
                    <span className="text-white font-medium">{userProfile.arenaWins}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Stardust Balance</span>
                    <span className="text-amber-400 font-bold">{userProfile.stardustBalance?.toLocaleString()} SD</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Active Cosmetics</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 mb-2">Active Border</p>
                    <div className="flex items-center gap-3">
                      <AvatarBorder
                        src={userProfile.avatar}
                        alt={userProfile.username}
                        size="md"
                        border={userProfile.activeBorder || 'simple'}
                        fallback={userProfile.username.slice(0, 2)}
                      />
                      <span className="text-white font-medium capitalize">{userProfile.activeBorder}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-slate-400 mb-2">Active Name Effect</p>
                    <NameEffect
                      name={userProfile.username}
                      effect={userProfile.activeEffect || 'rainbow'}
                      className="text-xl font-bold"
                    />
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Edit Tab */}
          {activeTab === 'edit' && (
            <GlassCard className="p-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-white mb-6">Edit Profile</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Discord</label>
                  <input
                    type="text"
                    value={editDiscord}
                    onChange={(e) => setEditDiscord(e.target.value)}
                    placeholder="username#0000"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Twitter</label>
                  <input
                    type="text"
                    value={editTwitter}
                    onChange={(e) => setEditTwitter(e.target.value)}
                    placeholder="@username"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <CyberButton variant="primary" size="lg" className="w-full" onClick={handleSaveProfile}>
                  Save Changes
                </CyberButton>
              </div>
            </GlassCard>
          )}

          {/* Borders Tab */}
          {activeTab === 'borders' && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Avatar Borders</h2>
                <span className="text-amber-400 font-medium">{userProfile.stardustBalance?.toLocaleString()} SD</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableBorders.map((border) => (
                  <div
                    key={border.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all cursor-pointer',
                      userProfile.activeBorder === border.id
                        ? 'bg-cyan-500/10 border-cyan-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    )}
                    onClick={() => border.owned && handleSelectBorder(border.id)}
                  >
                    <div className="flex justify-center mb-3">
                      <AvatarBorder
                        src={userProfile.avatar}
                        alt={userProfile.username}
                        size="lg"
                        border={border.id}
                        fallback={userProfile.username.slice(0, 2)}
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-white mb-1">{border.name}</p>
                    {border.owned ? (
                      <p className="text-center text-xs text-green-400">Owned</p>
                    ) : (
                      <p className="text-center text-xs text-amber-400">{border.price} SD</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Effects Tab */}
          {activeTab === 'effects' && (
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Name Effects</h2>
                <span className="text-amber-400 font-medium">{userProfile.stardustBalance?.toLocaleString()} SD</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableEffects.map((effect) => (
                  <div
                    key={effect.id}
                    className={cn(
                      'p-4 rounded-xl border transition-all cursor-pointer',
                      userProfile.activeEffect === effect.id
                        ? 'bg-cyan-500/10 border-cyan-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    )}
                    onClick={() => effect.owned && handleSelectEffect(effect.id)}
                  >
                    <div className="h-12 flex items-center justify-center mb-2">
                      <NameEffect
                        name={userProfile.username}
                        effect={effect.id}
                        className="text-lg font-bold"
                      />
                    </div>
                    <p className="text-center text-sm font-medium text-white mb-1">{effect.name}</p>
                    {effect.owned ? (
                      <p className="text-center text-xs text-green-400">Owned</p>
                    ) : (
                      <p className="text-center text-xs text-amber-400">{effect.price} SD</p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1023px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
