'use client';

import { cn } from '@/lib/utils';
import { AvatarBorder, BorderType } from '@/components/avatar/avatar-border';
import { NameEffect, NameEffectType } from '@/components/effects/name-effect';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  banner?: string | null;
  bio?: string | null;
  isPremium?: boolean;
  activeBorder?: BorderType;
  activeEffect?: NameEffectType;
  stardustBalance?: number;
  onlineTime?: string;
  joinDate?: string;
  arenaWins?: number;
  socialLinks?: {
    discord?: string;
    twitter?: string;
    portfolio?: string;
  };
}

interface ProfileHeroProps {
  user: UserProfile;
  onEditClick?: () => void;
  className?: string;
}

export function ProfileHero({ user, onEditClick, className }: ProfileHeroProps) {
  const stats = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: 'Stardust',
      value: user.stardustBalance?.toLocaleString() ?? '0',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Online',
      value: user.onlineTime ?? '0h',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Joined',
      value: user.joinDate ?? 'N/A',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: 'Arena Wins',
      value: user.arenaWins?.toString() ?? '0',
    },
  ];

  const socialLinks = [
    {
      key: 'discord',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
      href: user.socialLinks?.discord,
      label: 'Discord',
    },
    {
      key: 'twitter',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: user.socialLinks?.twitter,
      label: 'X/Twitter',
    },
    {
      key: 'portfolio',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      href: user.socialLinks?.portfolio,
      label: 'Portfolio',
    },
  ];

  return (
    <div className={cn('profile-nova-hero', className)}>
      {/* Banner Background */}
      <div className="profile-nova-hero-bg">
        {user.banner ? (
          <img src={user.banner} alt="Profile banner" />
        ) : (
          <div className="profile-nova-hero-fallback" />
        )}
      </div>

      {/* Overlay */}
      <div className="profile-nova-hero-overlay" />

      {/* Content */}
      <div className="profile-nova-hero-content">
        {/* Identity Section */}
        <div className="profile-nova-identity">
          {/* Avatar */}
          <div className="profile-nova-avatar-wrap">
            <AvatarBorder
              src={user.avatar}
              alt={user.username}
              size="xl"
              border={user.activeBorder || 'simple'}
              fallback={user.username.slice(0, 2)}
            />
            {user.isPremium && (
              <div className="profile-nova-premium" title="Premium Member">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="profile-nova-title">
            <h1 className="profile-nova-username">
              <NameEffect
                name={user.username}
                effect={user.activeEffect || 'rainbow'}
              />
            </h1>

            {/* Pills */}
            <div className="profile-nova-subline">
              {user.isPremium && (
                <span className="profile-nova-pill">
                  <span className="profile-nova-pill-dot" style={{ '--pill-accent': '#fbbf24' } as React.CSSProperties} />
                  Premium
                </span>
              )}
              {user.bio && (
                <p className="profile-nova-bio">{user.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Quick Actions */}
        <div className="flex flex-col gap-3 items-end">
          {/* Edit Button */}
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="profile-nova-quick"
              title="Edit Profile"
            >
              <span className="profile-nova-quick-ico">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </span>
              <span className="profile-nova-quick-txt">Edit</span>
            </button>
          )}

          {/* Social Links */}
          <div className="flex gap-2">
            {socialLinks.map((link) =>
              link.href && (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-nova-quick"
                  title={link.label}
                >
                  <span className="profile-nova-quick-ico">
                    {link.icon}
                  </span>
                </a>
              )
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-6 pb-4">
        <div className="profile-nova-quickgrid">
          {stats.map((stat) => (
            <div key={stat.label} className="profile-nova-kpi">
              <div className="flex items-center gap-2 text-cyan-400">
                {stat.icon}
                <span className="profile-nova-kpi-label">{stat.label}</span>
              </div>
              <div className="profile-nova-kpi-value">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHero;
