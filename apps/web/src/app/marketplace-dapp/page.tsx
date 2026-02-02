'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Component {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  username: string;
  avatar: string;
  is_owned: boolean;
}

// Mock data for components
const mockComponents: Component[] = [
  {
    id: 1,
    title: 'Secure Wallet Connect',
    description: 'A reusable wallet connection component with support for MetaMask, WalletConnect, and Coinbase Wallet.',
    category: 'UI Component',
    price: 50,
    username: 'asterdev',
    avatar: '/assets/images/user/avatar-1.jpg',
    is_owned: false,
  },
  {
    id: 2,
    title: 'Token Swap Module',
    description: 'Complete DEX swap interface with price impact calculation and slippage protection.',
    category: 'Full DApp',
    price: 150,
    username: 'web3master',
    avatar: '/assets/images/user/avatar-2.jpg',
    is_owned: true,
  },
  {
    id: 3,
    title: 'NFT Gallery Grid',
    description: 'Responsive NFT display grid with lazy loading and metadata fetching.',
    category: 'UI Component',
    price: 0,
    username: 'nftbuilder',
    avatar: '/assets/images/user/avatar-3.jpg',
    is_owned: false,
  },
  {
    id: 4,
    title: 'Staking Contract',
    description: 'Battle-tested staking smart contract with reward distribution logic.',
    category: 'Smart Contract',
    price: 200,
    username: 'solidityking',
    avatar: '/assets/images/user/avatar-4.jpg',
    is_owned: false,
  },
];

export default function MarketplaceDAppPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'library' | 'sell'>('browse');
  const [components, setComponents] = useState<Component[]>([]);
  const [balance, setBalance] = useState(1250);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setComponents(mockComponents);
      setLoading(false);
    }, 500);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple notification
    alert(message);
  };

  const buyComponent = (id: number, price: number) => {
    if (!confirm(`Confirm purchase for ${price} Stardust?`)) return;

    setBalance(prev => prev - price);
    setComponents(prev => prev.map(c => c.id === id ? { ...c, is_owned: true } : c));
    showNotification('Purchase successful!', 'success');
  };

  const escapeHtml = (text: string) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="py-2 mb-0">
        <div className="container">
          <div className="aster-card p-3 rounded-4 d-flex flex-wrap justify-content-between align-items-center gap-3 border border-white border-opacity-10 shadow-lg position-relative overflow-hidden">
            <div className="d-flex align-items-center gap-3 z-1">
              <Link href="/" className="btn btn-dark border-secondary rounded-pill px-4 d-flex align-items-center gap-2">
                <i className="ti ti-arrow-left"></i> <span className="d-none d-md-inline">Dashboard</span>
              </Link>
              <div className="vr bg-secondary opacity-50"></div>
              <Link href="/profile" className="btn btn-dark border-secondary rounded-pill px-4 d-flex align-items-center gap-2">
                <i className="ti ti-user"></i> <span className="d-none d-md-inline">Profile</span>
              </Link>
            </div>

            <div className="d-flex align-items-center z-1">
              <div className="bg-black bg-opacity-50 rounded-pill ps-4 pe-2 py-1 border border-primary border-opacity-50 d-flex align-items-center gap-3">
                <div className="d-flex flex-column align-items-end py-1 gap-1">
                  <span className="text-white text-uppercase fw-bold" style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>Balance</span>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="fw-bold text-white fs-5">{balance.toLocaleString()}</span>
                    <span className="text-primary fw-bold" style={{ fontSize: '0.7rem' }}>Stardust</span>
                  </div>
                </div>
                <div className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center shadow-glow" style={{ width: '36px', height: '36px' }}>
                  <i className="ti ti-wallet text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="pc-container" style={{ marginLeft: 0, width: '100%', paddingTop: 0 }}>
        <div className="pc-content container mx-auto pt-0 pb-5">
          <div className="row mb-3">
            <div className="col-12">
              <h2 className="text-white fw-bold mb-1">DApp Component Marketplace</h2>
              <p className="text-white fs-5 mb-0">Buy, sell, and test reusable DApp components securely.</p>
            </div>
          </div>

          <ul className="nav nav-pills mb-4 gap-2">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
                onClick={() => setActiveTab('browse')}
              >
                <i className="ti ti-world me-2"></i>Browse Components
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'library' ? 'active' : ''}`}
                onClick={() => setActiveTab('library')}
              >
                <i className="ti ti-books me-2"></i>My Library
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'sell' ? 'active' : ''}`}
                onClick={() => setActiveTab('sell')}
              >
                <i className="ti ti-plus me-2"></i>Sell Component
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* BROWSE TAB */}
            {activeTab === 'browse' && (
              <div className="row">
                {loading ? (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-muted mt-3">Loading marketplace...</p>
                  </div>
                ) : components.length > 0 ? (
                  components.map((comp) => (
                    <div key={comp.id} className="col-md-4 col-lg-3 mb-4">
                      <div className="aster-card h-100">
                        <div className="card-img-top-wrapper" style={{
                          height: '140px',
                          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          position: 'relative',
                          margin: '-24px -24px 24px -24px',
                        }}>
                          <i className="ti ti-package text-white" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                          <span className="category-badge" style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(4px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#fff',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}>{comp.category}</span>
                        </div>
                        <div className="card-body p-0 d-flex flex-column flex-grow-1">
                          <h5 className="card-title text-truncate" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{comp.title}</h5>
                          <p className="card-text" style={{
                            color: '#94a3b8',
                            fontSize: '0.9rem',
                            lineHeight: 1.5,
                            marginBottom: '1rem',
                            flexGrow: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}>{comp.description}</p>

                          <div className="card-meta d-flex align-items-center justify-content-between mt-auto pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <div className="d-flex align-items-center">
                              <img src={comp.avatar || '/assets/images/user/avatar-1.jpg'} className="rounded-circle border border-secondary me-2" width="24" height="24" alt="" />
                              <small className="text-muted">{comp.username}</small>
                            </div>
                            <div className="text-white fw-bold">
                              {comp.price === 0 ? 'FREE' : <>{comp.price} <small className="text-muted fw-normal">Stardust</small></>}
                            </div>
                          </div>
                        </div>
                        <div className="card-footer" style={{
                          padding: '1rem 1.25rem',
                          background: 'rgba(0, 0, 0, 0.2)',
                          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                          margin: '24px -24px -24px -24px',
                        }}>
                          <div className="row g-2">
                            <div className="col-6">
                              <button className="btn btn-outline-light btn-sm w-100">Details</button>
                            </div>
                            <div className="col-6">
                              {comp.is_owned ? (
                                <button className="btn btn-success btn-sm w-100" disabled>
                                  <i className="ti ti-check"></i> Owned
                                </button>
                              ) : (
                                <button
                                  className="btn btn-primary btn-sm w-100"
                                  onClick={() => buyComponent(comp.id, comp.price)}
                                >
                                  Buy
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <div className="mb-3 text-white opacity-50">
                      <i className="ti ti-box-off" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="text-white">No components found</h5>
                    <p className="text-white">Be the first to list a component!</p>
                    <button className="btn btn-primary mt-2" onClick={() => setActiveTab('sell')}>
                      Sell Component
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LIBRARY TAB */}
            {activeTab === 'library' && (
              <div className="aster-card border-0">
                <div className="card-body">
                  <h5 className="card-title mb-4 text-white">My Purchased Components</h5>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th className="text-white text-uppercase small">Component</th>
                          <th className="text-white text-uppercase small">Category</th>
                          <th className="text-white text-uppercase small">License Key</th>
                          <th className="text-end text-white text-uppercase small">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {components.filter(c => c.is_owned).length > 0 ? (
                          components.filter(c => c.is_owned).map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 p-2 rounded me-3 text-primary">
                                    <i className="ti ti-package"></i>
                                  </div>
                                  <div>
                                    <h6 className="mb-0 text-white">{item.title}</h6>
                                    <small className="text-white">{item.category}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-primary text-white border border-white border-opacity-25">
                                  {item.price === 0 ? 'FREE' : `${item.price} Stardust`}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <code className="bg-black border border-secondary rounded px-2 py-1 text-warning small">
                                    ASTER-{item.id.toString().padStart(4, '0')}-XXXX
                                  </code>
                                  <button
                                    className="btn btn-sm btn-icon btn-outline-secondary"
                                    onClick={() => {
                                      navigator.clipboard.writeText(`ASTER-${item.id.toString().padStart(4, '0')}-XXXX`);
                                      showNotification('License copied!');
                                    }}
                                  >
                                    <i className="ti ti-copy"></i>
                                  </button>
                                </div>
                              </td>
                              <td className="text-end">
                                <button className="btn btn-sm btn-primary">
                                  <i className="ti ti-download me-1"></i> Access
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="text-center py-5 text-white">
                              You haven't purchased any components yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* SELL TAB */}
            {activeTab === 'sell' && (
              <div className="aster-card border-0">
                <div className="card-body">
                  <h5 className="card-title mb-4 text-white">List a New Component</h5>
                  <form onSubmit={(e) => { e.preventDefault(); showNotification('Component listed successfully!'); }}>
                    <div className="mb-3">
                      <label className="form-label text-white">Title</label>
                      <input type="text" className="form-control" name="title" required placeholder="e.g., Secure Wallet Connect Button" />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label text-white">Price (Stardust)</label>
                        <input type="number" className="form-control" name="price" required min="0" step="0.1" defaultValue="0" />
                        <div className="form-text text-white">Set to 0 for free components.</div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label text-white">Category</label>
                        <select className="form-select" name="category">
                          <option>UI Component</option>
                          <option>Smart Contract</option>
                          <option>Utility Script</option>
                          <option>Full DApp</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label text-white">Description</label>
                      <textarea className="form-control" name="description" rows={3} placeholder="Describe functionality, dependencies, and usage..."></textarea>
                    </div>

                    <hr className="my-4 border-secondary opacity-25" />
                    <h6 className="text-white mb-3">Source Code (Protected)</h6>
                    <div className="mb-3">
                      <label className="form-label text-white">Full Source Code (Visible only to buyers)</label>
                      <textarea className="form-control font-monospace" name="code_snippet" rows={6} required placeholder="// Connect wallet logic..."></textarea>
                    </div>

                    <hr className="my-4 border-secondary opacity-25" />
                    <h6 className="text-white mb-3">Live Preview Data (Public Sandbox)</h6>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label text-white">Demo HTML</label>
                        <textarea className="form-control font-monospace" name="demo_html" rows={4} placeholder="<button id='btn'>Connect</button>"></textarea>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label text-white">Demo CSS</label>
                        <textarea className="form-control font-monospace" name="demo_css" rows={4} placeholder="#btn { color: blue; }"></textarea>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label text-white">Demo JS</label>
                        <textarea className="form-control font-monospace" name="demo_js" rows={4} placeholder="console.log('Clicked');"></textarea>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary px-4">
                        <i className="ti ti-upload me-2"></i>List Component
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pc-footer" style={{ marginLeft: 0, width: '100%' }}>
        <div className="footer-wrapper container-fluid">
          <div className="row">
            <div className="col my-1">
              <hr />
              <p className="m-0 text-white">Asterbook - Independent directory<br />Not affiliated with the official team.</p>
              <small className="text-white d-block mt-2">For Donate: 0x16b167bA961cF43E92AD49B5053A401F2CE0Ec12</small>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.8); }
          100% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
        }
        .form-control, .form-select {
          background: rgba(0, 0, 0, 0.3) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: #fff !important;
        }
        .form-control:focus, .form-select:focus {
          background: rgba(0, 0, 0, 0.5) !important;
          border-color: #3b82f6 !important;
          color: #fff !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }
      `}</style>
    </>
  );
}
