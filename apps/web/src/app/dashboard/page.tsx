'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Types
interface Quest {
  id: number;
  questType: string;
  description: string;
  rewardAmount: number;
  status: string;
}

interface Pet {
  petType: string;
  stage: number;
  hunger: number;
  expeditionStatus: string;
}

interface RankData {
  name: string;
  color: string;
  rankId: number;
}

// Mock data
const mockQuests: Quest[] = [
  { id: 1, questType: 'visit_whale', description: 'Check the Whale Radar', rewardAmount: 50, status: 'active' },
  { id: 2, questType: 'check_profile', description: 'Visit your Profile page', rewardAmount: 50, status: 'completed' },
  { id: 3, questType: 'visit_defi', description: 'Explore DeFi options', rewardAmount: 75, status: 'active' },
];

const mockPet: Pet = { petType: 'dragon_baby', stage: 2, hunger: 72, expeditionStatus: 'idle' };
const mockRank: RankData = { name: 'Cosmic Explorer', color: '#3b82f6', rankId: 3 };

const questConfig: Record<string, { icon: string; link: string }> = {
  visit_whale: { icon: 'ti-radar', link: '/whale-radar' },
  check_profile: { icon: 'ti-user-circle', link: '/profile' },
  visit_defi: { icon: 'ti-building-bank', link: '/defi' },
  click_buy: { icon: 'ti-shopping-cart', link: '/buyaster' },
  open_tools: { icon: 'ti-tools', link: '/tools' },
  read_story: { icon: 'ti-book', link: '/story' },
  visit_market: { icon: 'ti-shopping-bag', link: '/marketplace' },
  visit_gaming: { icon: 'ti-device-gamepad', link: '/gaming' },
};

const petEmojis: Record<string, string> = {
  dragon_egg: '🥚',
  dragon_baby: '🐲',
  dragon_teen: '🐉',
  dragon_adult: '🔥',
};

export default function DashboardPage() {
  const [stardust, setStardust] = useState(12450);
  const [quests] = useState<Quest[]>(mockQuests);
  const [pet, setPet] = useState<Pet>(mockPet);
  const [rank] = useState<RankData>(mockRank);
  const [rankProgress] = useState(67.5);
  const [isLoggedIn] = useState(true);
  const [priceData] = useState({ price: '0.0234', fdv: '$2.34M', volume: '$124.5K', change24h: '+5.67%', isUp: true });

  const [terminalLines, setTerminalLines] = useState([
    { text: '>> Booting Aster...', type: 'info' },
    { text: '>> Mapping Blockchain Nodes...', type: 'info' },
    { text: '>> Active.', type: 'success' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { text: `>> Scanning block ${Math.floor(Math.random() * 1000000) + 45000000}...`, type: 'info' },
        { text: `>> Whale detected: ${(Math.random() * 100000).toFixed(0)} ASTER moved`, type: 'warning' },
        { text: `>> Price update: $${(Math.random() * 0.01 + 0.02).toFixed(4)}`, type: 'success' },
      ];
      setTerminalLines(prev => [...prev.slice(-20), messages[Math.floor(Math.random() * messages.length)]]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const feedPet = () => setPet(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 20) }));
  const getPetStatus = (h: number) => (h > 80 ? 'Happy & Full' : h > 50 ? 'Feeling Okay' : 'Hungry...');

  return (
    <>
      {/* Shooting Stars Background */}
      <div className="night-sky-container">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="star" />)}
      </div>

      <div className="pc-container">
        <div className="pc-content">
          <div className="dashboard-grid">
            {/* WELCOME BANNER */}
            <div className="grid-item item-banner">
              <div className="welcome-banner-modern p-4 p-md-5 mb-4">
                <div className="banner-content row align-items-center">
                  <div className="col-sm-7">
                    <span className="banner-tag">Discovery Hub</span>
                    <h1 className="text-zauth-effect fw-bold mb-2" style={{ fontSize: '2.5rem' }}>WELCOME TO ASTERBOOK</h1>
                    <p className="text-muted fs-5 mb-4">A simple & fluid gateway to explore the Aster Ecosystem.</p>
                    <div className="d-flex flex-wrap gap-3">
                      <a href="https://www.asterdex.com" target="_blank" rel="noopener noreferrer" className="btn-cyber">
                        <i className="ti ti-rocket fs-4"></i> Go to Aster DEX
                      </a>
                      <Link href="/story" className="btn-cyber">
                        <i className="ti ti-book fs-4"></i> Our story
                      </Link>
                    </div>
                  </div>
                  <div className="col-sm-5 text-center d-none d-sm-block">
                    <Image src="/dec.gif" alt="Decorative" width={200} height={200} className="img-fluid" style={{ maxHeight: 200, filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))' }} unoptimized />
                  </div>
                </div>
              </div>
            </div>

            {/* MISSION CONTROL */}
            <div className="grid-item item-quests">
              <div className="mission-card">
                {isLoggedIn ? (
                  <>
                    <div className="mission-header">
                      <div>
                        <h5 className="text-white fw-bold mb-0"><i className="ti ti-target me-2 text-warning"></i>Mission Control</h5>
                        <small className="text-muted">Daily Objectives</small>
                      </div>
                      <div className="stardust-badge"><i className="ti ti-sparkles"></i> {stardust.toLocaleString()}</div>
                    </div>
                    <div className="quest-list">
                      {quests.map(q => {
                        const cfg = questConfig[q.questType] || { icon: 'ti-star', link: '#' };
                        return (
                          <Link key={q.id} href={cfg.link} className="text-decoration-none">
                            <div className={`quest-item ${q.status === 'completed' ? 'completed' : ''}`}>
                              <div className="d-flex align-items-center flex-grow-1">
                                <div className="quest-info">
                                  <div className="quest-title">{q.description}</div>
                                  <div className="quest-reward"><i className="ti ti-sparkles"></i> +{q.rewardAmount} Stardust</div>
                                </div>
                              </div>
                              <div className="quest-check"><i className="ti ti-check"></i></div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="ti ti-lock-square fs-1 text-muted opacity-50 mb-3 d-block"></i>
                    <h6 className="text-white">Login Required</h6>
                    <Link href="/auth/login" className="btn btn-sm btn-primary">Login Now</Link>
                  </div>
                )}
              </div>
            </div>

            {/* RANK WIDGET */}
            <div className="grid-item item-rank">
              <div className="rank-card">
                {isLoggedIn ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="text-white fw-bold mb-0"><i className="ti ti-crown me-2 text-warning"></i>Galactic Rank</h5>
                        <small className="text-muted">Progression</small>
                      </div>
                      <span className="badge" style={{ background: `${rank.color}20`, color: rank.color, border: `1px solid ${rank.color}40` }}>{rank.name}</span>
                    </div>
                    <div className="text-center my-3">
                      <div className="rank-avatar-glow mx-auto" style={{ width: 80, height: 80, borderRadius: '50%', border: `3px solid ${rank.color}`, boxShadow: `0 0 30px ${rank.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                        <i className="ti ti-planet fs-1" style={{ color: rank.color }}></i>
                      </div>
                      <h3 className="text-white fw-bold mb-0 mt-2" style={{ textShadow: `0 0 15px ${rank.color}80` }}>{rank.name}</h3>
                      <p className="text-muted small mb-0">Level {rank.rankId}</p>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between text-muted small mb-1">
                        <span>Next Rank</span><span>{rankProgress.toFixed(1)}%</span>
                      </div>
                      <div className="rank-progress-bar">
                        <div className="rank-progress-fill" style={{ width: `${rankProgress}%`, background: rank.color }}></div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="ti ti-lock-square fs-1 text-muted opacity-50 mb-3 d-block"></i>
                    <h6 className="text-white">Login Required</h6>
                    <Link href="/auth/login" className="btn btn-sm btn-primary">Login Now</Link>
                  </div>
                )}
              </div>
            </div>

            {/* PET WIDGET */}
            {isLoggedIn && (
              <div className="grid-item item-pet" style={{ gridColumn: 'span 12' }}>
                <div className="pet-widget-container p-3 p-md-4 rounded-4" style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div className="d-flex flex-column flex-md-row align-items-center gap-3 gap-md-4">
                    <div className="d-flex flex-column align-items-center">
                      <div className={`pet-avatar-wrapper ${pet.stage > 1 ? 'pet-evolution' : ''}`} style={{ width: 80, height: 80, fontSize: '3rem', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {petEmojis[pet.petType] || '🐲'}
                      </div>
                      {pet.stage > 1 && (
                        <div className="d-flex gap-2 mt-2">
                          <Link href="/pet-adventure" className="btn btn-sm btn-outline-info py-1 px-2" style={{ fontSize: '0.75rem' }}>
                            <i className="ti ti-map-pin"></i> {pet.expeditionStatus === 'active' ? 'Mission' : 'Explore'}
                          </Link>
                          <Link href="/arena" className="btn btn-sm btn-outline-warning py-1 px-2" style={{ fontSize: '0.75rem' }}>
                            <i className="ti ti-swords"></i> Arena
                          </Link>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1 text-center text-md-start w-100">
                      <h4 className="text-white mb-1">Your Companion</h4>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="text-muted small">{getPetStatus(pet.hunger)}</span>
                        <span className="text-white fw-bold small">{pet.hunger}% Energy</span>
                      </div>
                      <div className="progress" style={{ height: 8, background: 'rgba(255,255,255,0.1)' }}>
                        <div className={`progress-bar ${pet.hunger < 30 ? 'bg-danger' : 'bg-success'}`} style={{ width: `${pet.hunger}%` }}></div>
                      </div>
                    </div>
                    <button onClick={feedPet} className="btn btn-primary btn-sm rounded-pill px-4" disabled={pet.expeditionStatus === 'active'}>Feed (Free) 🍎</button>
                  </div>
                </div>
              </div>
            )}

            {/* PERFORMANCE DASHBOARD */}
            <div className="grid-item item-performance">
              <div id="performance-container">
                <div className="radar-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ti ti-chart-bar fs-2 text-primary"></i>
                    <h5 className="m-0 text-white fw-bold">Performance Dashboard</h5>
                  </div>
                </div>
                <div className="p-4">
                  <div className="row g-3">
                    <div className="col-md-3"><div className="portfolio-stat-card h-100"><small className="text-muted fw-bold d-block mb-1">ASTER PRICE (24H)</small><h3 className="text-white mb-0">${priceData.price}</h3></div></div>
                    <div className="col-md-3"><div className="portfolio-stat-card h-100"><small className="text-muted fw-bold d-block mb-1">FULLY DILUTED VALUATION</small><h3 className="text-white mb-0">{priceData.fdv}</h3></div></div>
                    <div className="col-md-3"><div className="portfolio-stat-card h-100"><small className="text-muted fw-bold d-block mb-1">VOLUME (24H)</small><h3 className="text-white mb-0">{priceData.volume}</h3></div></div>
                    <div className="col-md-3"><div className="portfolio-stat-card h-100"><small className="text-muted fw-bold d-block mb-1">24H CHANGE</small><h3 className={`mb-0 ${priceData.isUp ? 'text-success' : 'text-danger'}`}>{priceData.change24h}</h3></div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PORTFOLIO TRACKER */}
            <div className="grid-item item-portfolio">
              <div className="portfolio-card-fintech">
                <div className="fintech-header">
                  <div className="fintech-title"><i className="ti ti-wallet fs-5 text-primary"></i> PORTFOLIO PRO</div>
                  <button className="fintech-btn-icon" style={{ fontSize: '0.8rem', fontWeight: 700, padding: '0 12px' }}><i className="ti ti-settings me-2"></i> ADD</button>
                </div>
                <div className="fintech-body">
                  <div className="fintech-stat-grid">
                    <div className="fintech-stat-card"><div className="fintech-label">Total Balance</div><div className="fintech-value">0 <span className="fs-6 text-muted">ASTER</span></div></div>
                    <div className="fintech-stat-card"><div className="fintech-label">Global PnL</div><div className="fintech-value">--</div></div>
                  </div>
                  <div className="text-center py-4 text-muted small">
                    <i className="ti ti-wallet fs-2 mb-2 d-block opacity-50"></i>
                    Add a wallet to track your portfolio
                  </div>
                </div>
              </div>
            </div>

            {/* WHALE RADAR & AI TERMINAL */}
            <div className="grid-item" style={{ gridColumn: 'span 12' }}>
              <div className="row">
                <div className="col-md-6">
                  <div id="whale-alert-container">
                    <div className="radar-header d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <i className="ti ti-radar fs-2 text-primary"></i>
                        <h5 className="m-0 text-white fw-bold">LIVE WHALE RADAR - &gt;5000</h5>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="status-dot pulsing"></span>
                        <small className="text-muted fw-bold">ON-CHAIN</small>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="custom-scrollbar" style={{ height: 350, overflowY: 'auto' }}>
                        <div className="text-center py-5">
                          <div className="spinner-grow text-primary opacity-50 mb-3"></div>
                          <p className="text-muted small">Listening to $ASTER movements...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div id="ai-analytics-container">
                    <div className="radar-header d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2">
                        <i className="ti ti-cpu fs-2 text-primary"></i>
                        <h5 className="m-0 text-white fw-bold">Aster AI Analytics</h5>
                      </div>
                      <span className="badge bg-light-primary">Deep Scan Mode</span>
                    </div>
                    <div className="p-0">
                      <div className="terminal-body custom-scrollbar">
                        {terminalLines.map((line, i) => <div key={i} className={`terminal-line ${line.type}`}>{line.text}</div>)}
                        <span className="cursor"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DISCORD CARD */}
            <div className="grid-item item-discord">
              <div className="discord-card">
                <div className="discord-content">
                  <h3><i className="ti ti-brand-discord me-2"></i>Join our Discord Community</h3>
                  <p className="mb-0 opacity-75">Connect with the Aster community, get live updates, and chat with fellow investors.</p>
                </div>
                <a href="http://discord.gg/invite/asterdefi" target="_blank" rel="noopener noreferrer" className="discord-btn">
                  <i className="ti ti-login"></i> Join Server
                </a>
                <i className="ti ti-brand-discord discord-bg-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="pc-footer">
        <div className="footer-wrapper container-fluid">
          <div className="row">
            <div className="col my-1">
              <p className="m-0">Asterbook ♥ - Independent directory<br />Not affiliated with the official team.</p>
              <small className="text-muted d-block mt-2">For Donate: 0x16b167bA961cF43E92AD49B5053A401F2CE0Ec12</small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
