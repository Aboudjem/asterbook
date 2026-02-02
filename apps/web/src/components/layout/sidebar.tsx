'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isPremium?: boolean;
  activePath?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isPremium = false }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="pc-sidebar">
      <div className="navbar-wrapper">
        {/* Logo Header */}
        <div className="m-header">
          <Link href="/dashboard" className="b-brand text-primary">
            <Image
              src="/assets/images/logo.png"
              alt="logo"
              width={35}
              height={35}
              className="logo-lg landing-logo"
            />
            <span className="badge bg-success rounded-pill ms-2 theme-version">v2.31.8</span>
          </Link>
        </div>

        <div className="navbar-content">
          <ul className="pc-navbar">
            <br />

            {/* MAIN */}
            <li className={`pc-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <Link href="/dashboard" className="pc-link">
                <span className="pc-micon">
                  <i className="ti ti-home"></i>
                </span>
                <span className="pc-mtext">Index</span>
              </Link>
            </li>

            {/* PREMIUM SUITE - Only show if premium */}
            {isPremium && (
              <>
                <li className="pc-item pc-caption premium-suite-header">
                  <label>Premium Suite</label>
                  <i className="ti ti-crown" style={{ color: '#f59e0b', fontSize: '14px' }}></i>
                </li>

                <li className={`pc-item premium-item ${isActive('/whale-radar') ? 'active' : ''}`}>
                  <Link href="/whale-radar" className="pc-link">
                    <span className="pc-micon"><i className="ti ti-chart-radar"></i></span>
                    <span className="pc-mtext">Live Whale Radar</span>
                  </Link>
                </li>

                <li className={`pc-item premium-item ${isActive('/premium-analysis') ? 'active' : ''}`}>
                  <Link href="/premium-analysis" className="pc-link">
                    <span className="pc-micon"><i className="ti ti-chart-pie"></i></span>
                    <span className="pc-mtext">Premium Analysis</span>
                  </Link>
                </li>

                <li className={`pc-item premium-item ${isActive('/intelligence') ? 'active' : ''}`}>
                  <Link href="/intelligence" className="pc-link">
                    <span className="pc-micon"><i className="ti ti-bulb"></i></span>
                    <span className="pc-mtext">Intelligence</span>
                  </Link>
                </li>
              </>
            )}

            {/* ECOSYSTEM */}
            <li className="pc-item pc-caption">
              <label>Ecosystem</label>
            </li>

            <li className={`pc-item ${isActive('/defi') ? 'active' : ''}`}>
              <Link href="/defi" className="pc-link">
                <span className="pc-micon"><i className="ti ti-coin"></i></span>
                <span className="pc-mtext">DeFi</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/marketplace') ? 'active' : ''}`}>
              <Link href="/marketplace" className="pc-link">
                <span className="pc-micon"><i className="ti ti-apps"></i></span>
                <span className="pc-mtext">Marketplace & NFT</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/lending') ? 'active' : ''}`}>
              <Link href="/lending" className="pc-link">
                <span className="pc-micon"><i className="ti ti-credit-card"></i></span>
                <span className="pc-mtext">Lending</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/gaming') ? 'active' : ''}`}>
              <Link href="/gaming" className="pc-link">
                <span className="pc-micon"><i className="ti ti-device-gamepad"></i></span>
                <span className="pc-mtext">Gaming</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/tools') ? 'active' : ''}`}>
              <Link href="/tools" className="pc-link">
                <span className="pc-micon"><i className="ti ti-tool"></i></span>
                <span className="pc-mtext">Tools</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/memes') ? 'active' : ''}`}>
              <Link href="/memes" className="pc-link">
                <span className="pc-micon"><i className="ti ti-mood-smile"></i></span>
                <span className="pc-mtext">Memes project</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/bridge') ? 'active' : ''}`}>
              <Link href="/bridge" className="pc-link">
                <span className="pc-micon"><i className="ti ti-transfer-in"></i></span>
                <span className="pc-mtext">Bridge</span>
              </Link>
            </li>

            {/* UTILITY */}
            <li className="pc-item pc-caption">
              <label>Utility</label>
            </li>

            <li className={`pc-item ${isActive('/buyaster') ? 'active' : ''}`}>
              <Link href="/buyaster" className="pc-link">
                <span className="pc-micon"><i className="ti ti-shopping-cart"></i></span>
                <span className="pc-mtext">Buy <b>ASTER</b></span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/staking') ? 'active' : ''}`}>
              <Link href="/staking" className="pc-link">
                <span className="pc-micon"><i className="ti ti-lock"></i></span>
                <span className="pc-mtext">Staking Vault</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/analytics') ? 'active' : ''}`}>
              <Link href="/analytics" className="pc-link">
                <span className="pc-micon"><i className="ti ti-chart-bar"></i></span>
                <span className="pc-mtext">Analytics</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/world-node') ? 'active' : ''}`}>
              <Link href="/world-node" className="pc-link">
                <span className="pc-micon"><i className="ti ti-world"></i></span>
                <span className="pc-mtext">World Node 3D</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/explorer') ? 'active' : ''}`}>
              <Link href="/explorer" className="pc-link">
                <span className="pc-micon"><i className="ti ti-search"></i></span>
                <span className="pc-mtext">Explorer</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/clash') ? 'active' : ''}`}>
              <Link href="/clash" className="pc-link">
                <span className="pc-micon"><i className="ti ti-bolt"></i></span>
                <span className="pc-mtext">Perp Clash ⚔️</span>
              </Link>
            </li>

            {/* EDUCATION */}
            <li className="pc-item pc-caption">
              <label>Education</label>
            </li>

            <li className={`pc-item ${isActive('/story') ? 'active' : ''}`}>
              <Link href="/story" className="pc-link">
                <span className="pc-micon"><i className="ti ti-book"></i></span>
                <span className="pc-mtext">Asterial</span>
              </Link>
            </li>

            {/* DEVELOPERS */}
            <li className="pc-item pc-caption">
              <label>Developers</label>
            </li>

            <li className={`pc-item ${isActive('/developer') ? 'active' : ''}`}>
              <Link href="/developer" className="pc-link">
                <span className="pc-micon"><i className="ti ti-code"></i></span>
                <span className="pc-mtext">Dev Hub</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/marketplace-dapp') ? 'active' : ''}`}>
              <Link href="/marketplace-dapp" className="pc-link">
                <span className="pc-micon"><i className="ti ti-apps"></i></span>
                <span className="pc-mtext">DApp Marketplace</span>
              </Link>
            </li>

            {/* ARENA */}
            <li className="pc-item pc-caption">
              <label>Arena</label>
            </li>

            <li className={`pc-item ${isActive('/arena') ? 'active' : ''}`}>
              <Link href="/arena" className="pc-link">
                <span className="pc-micon"><i className="ti ti-flame"></i></span>
                <span className="pc-mtext">Pet Arena</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/pet-adventure') ? 'active' : ''}`}>
              <Link href="/pet-adventure" className="pc-link">
                <span className="pc-micon"><i className="ti ti-compass"></i></span>
                <span className="pc-mtext">Pet Adventure</span>
              </Link>
            </li>

            {/* PROFILE */}
            <li className="pc-item pc-caption">
              <label>Account</label>
            </li>

            <li className={`pc-item ${isActive('/profile') ? 'active' : ''}`}>
              <Link href="/profile" className="pc-link">
                <span className="pc-micon"><i className="ti ti-user"></i></span>
                <span className="pc-mtext">Profile</span>
              </Link>
            </li>

            <li className={`pc-item ${isActive('/shop') ? 'active' : ''}`}>
              <Link href="/shop" className="pc-link">
                <span className="pc-micon"><i className="ti ti-shopping-cart"></i></span>
                <span className="pc-mtext">Shop</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
}

export default Sidebar;
