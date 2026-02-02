'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PaymentPage() {
  const [txHash, setTxHash] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'danger'>('success');
  const [status, setStatus] = useState<'none' | 'pending' | 'approved'>('none');
  const [trialEligible] = useState(true);
  const [trialOfferActive] = useState(true);

  const adminWallet = '0x16b167bA961cF43E92AD49B5053A401F2CE0Ec12';

  const copyAddress = () => {
    navigator.clipboard.writeText(adminWallet).then(() => {
      const btn = document.querySelector('.copy-btn') as HTMLButtonElement;
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="ti ti-check"></i> Copied!';
        setTimeout(() => (btn.innerHTML = original), 2000);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate transaction hash format
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      setMessage('Incorrect: Invalid Transaction Hash format (must start with 0x and be 66 chars).');
      setMessageType('danger');
      return;
    }

    // Mock verification - in real app, verify on-chain
    setStatus('pending');
    setTimeout(() => {
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      setMessage(`Ok: Transaction Verified! Premium Activated until ${expiresAt.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}.`);
      setMessageType('success');
      setStatus('approved');
    }, 2000);
  };

  const startTrial = (e: React.FormEvent) => {
    e.preventDefault();
    const trialEnd = new Date();
    trialEnd.setMonth(trialEnd.getMonth() + 1);
    setMessage(`Free 1-month premium trial activated until ${trialEnd.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}.`);
    setMessageType('success');
    setStatus('approved');
  };

  return (
    <>
      {/* Back Button */}
      <Link href="/" className="btn-back" title="Back to Home">
        <i className="ti ti-arrow-left"></i>
      </Link>

      {/* Background */}
      <div className="night-sky-container">
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
        <div className="star"></div>
      </div>

      <div className="payment-wrapper">
        <div className="logo-container">
          <img src="/assets/images/logo.png" alt="Asterbook" />
        </div>

        <div className="text-center mb-4">
          <h2 className="title">PREMIUM ACCESS</h2>
          <p className="text-muted m-0">Unlock the full power of Asterbook</p>
        </div>

        {message && (
          <div
            className="alert text-center p-3 mb-4"
            style={{
              borderRadius: '12px',
              background: messageType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${messageType === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: messageType === 'success' ? '#34d399' : '#f87171',
            }}
          >
            {message}
          </div>
        )}

        {status === 'pending' ? (
          <div className="text-center py-4">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>&#9203;</div>
            <h4 className="mb-3">Verification in Progress</h4>
            <p className="text-muted mb-2">We&apos;ve received your transaction hash.</p>
            <p className="text-muted small">This usually takes a few minutes.</p>
          </div>
        ) : (
          <>
            {trialOfferActive && trialEligible && (
              <div
                className="alert text-center p-3 mb-4"
                style={{
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  color: '#bfdbfe',
                }}
              >
                <h4 style={{ marginBottom: '0.5rem' }}>Free 1-month premium trial</h4>
                <p style={{ marginBottom: '0.25rem' }}>1 month free premium membership until January 25, 2026.</p>
                <p style={{ marginBottom: '0.25rem' }}>Offer valid until January 25, 2026.</p>
                <p style={{ marginBottom: '0.75rem' }}>After your trial period, standard pricing will apply.</p>
                <p className="small text-muted" style={{ marginBottom: '1rem' }}>
                  This promotional trial is limited to one per user account and does not create any automatic billing.
                </p>
                <form onSubmit={startTrial} style={{ marginTop: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary">
                    Start Free Trial <i className="ti ti-arrow-right ms-2"></i>
                  </button>
                </form>
              </div>
            )}

            <div className="price-tag">
              $2.47 <span className="price-sub">/ month</span>
            </div>

            <ul className="list-unstyled feature-list">
              <li>
                <i className="ti ti-brain"></i> - Full Intelligence Access
              </li>
              <li>
                <i className="ti ti-chart-dots"></i> - Advanced AI Charts
              </li>
              <li>
                <i className="ti ti-radar"></i> - Live Whale Radar
              </li>
              <li>
                <i className="ti ti-rocket"></i> - Priority Support
              </li>
              <li>
                <i className="ti ti-radar"></i> - Premium Secure Analysis
              </li>
            </ul>

            <div className="mb-4 text-center">
              <p className="small text-muted mb-2">
                Send <strong>$2.47</strong> (BNB/USDT/ASTER) to:
              </p>
              <div className="wallet-box">
                <div className="wallet-address" id="walletAddr">
                  {adminWallet}
                </div>
                <button className="copy-btn" onClick={copyAddress}>
                  <i className="ti ti-copy"></i> Copy Address
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="tx_hash"
                  className="form-control"
                  placeholder="Paste Transaction Hash (0x...)"
                  required
                  autoComplete="off"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Activate Premium <i className="ti ti-arrow-right ms-2"></i>
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          <Link href="/" className="me-3">
            Back to Home
          </Link>
          <span className="text-muted mx-2">|</span>
          <Link href="/auth/login">Logout</Link>
        </div>
      </div>

      <style jsx>{`
        body {
          background: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          overflow-x: hidden;
          font-family: 'Outfit', sans-serif;
          perspective: 1000px;
        }

        .btn-back {
          position: fixed;
          top: 30px;
          left: 30px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .btn-back:hover {
          transform: scale(1.1) rotate(-10deg);
          border-color: rgba(70, 128, 255, 0.5);
          color: #fff;
          box-shadow: 0 0 20px rgba(70, 128, 255, 0.3);
        }

        .night-sky-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
          background: radial-gradient(circle at center, #0a0a12 0%, #000000 100%);
        }

        .star {
          position: absolute;
          top: 50%;
          left: 50%;
          height: 2px;
          background: linear-gradient(-45deg, #5f91ff, rgba(0, 0, 255, 0));
          filter: drop-shadow(0 0 6px #699bff);
          animation: tail 3000ms ease-in-out infinite, shooting 3000ms ease-in-out infinite;
        }

        .star:nth-child(1) { top: 0; left: 50%; animation-delay: 0s; }
        .star:nth-child(2) { top: 0; left: 20%; animation-delay: 2s; }
        .star:nth-child(3) { top: 0; left: 80%; animation-delay: 4s; }
        .star:nth-child(4) { top: 20%; left: 0; animation-delay: 6s; }
        .star:nth-child(5) { top: 60%; left: 0; animation-delay: 8s; }

        @keyframes tail {
          0% { width: 0; }
          30% { width: 100px; }
          100% { width: 0; }
        }

        @keyframes shooting {
          0% { transform: translateX(0); }
          100% { transform: translateX(300px); }
        }

        .payment-wrapper {
          position: relative;
          max-width: 500px;
          width: 100%;
          padding: 3rem;
          background: rgba(10, 10, 12, 0.6);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin: 20px;
          animation: cardFloat 6s ease-in-out infinite;
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .logo-container {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .logo-container img {
          height: 40px;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
        }

        .title {
          font-weight: 700;
          font-size: 2rem;
          background: linear-gradient(to right, #ffd700, #fff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .price-tag {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffd700;
          margin: 1.5rem 0;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .price-sub {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          vertical-align: middle;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .feature-list li i {
          color: #ffd700;
          margin-right: 8px;
          font-size: 1.1rem;
        }

        .wallet-box {
          background: rgba(0, 0, 0, 0.5);
          border: 1px dashed rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 15px;
          margin-top: 10px;
          transition: all 0.3s ease;
        }

        .wallet-box:hover {
          border-color: rgba(255, 215, 0, 0.6);
          background: rgba(0, 0, 0, 0.7);
        }

        .wallet-address {
          font-family: 'Courier New', monospace;
          color: #fff;
          font-size: 0.85rem;
          word-break: break-all;
          margin-bottom: 10px;
          letter-spacing: 0.5px;
        }

        .copy-btn {
          background: rgba(255, 215, 0, 0.1);
          color: #ffd700;
          border: 1px solid rgba(255, 215, 0, 0.2);
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 500;
        }

        .copy-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: translateY(-1px);
        }

        .form-control {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 14px 16px;
          border-radius: 12px;
          width: 100%;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-control:focus {
          background: rgba(0, 0, 0, 0.6);
          border-color: #ffd700;
          box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.1);
          outline: none;
        }

        .btn-primary {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #ffd700 0%, #f59e0b 100%);
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          color: #000;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
        }

        .auth-footer a {
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .auth-footer a:hover {
          color: #ffd700;
        }

        .text-muted {
          color: rgba(255, 255, 255, 0.5) !important;
        }

        .mb-4 {
          margin-bottom: 1.5rem;
        }

        .mb-3 {
          margin-bottom: 1rem;
        }

        .text-center {
          text-align: center;
        }
      `}</style>
    </>
  );
}
