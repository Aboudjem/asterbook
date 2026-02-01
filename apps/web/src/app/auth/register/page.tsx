'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShootingStars } from '@/components/auth/shooting-stars';
import { NetworkMap } from '@/components/auth/network-map';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export default function RegisterPage() {
  const router = useRouter();
  const bookRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mouse tracking for gradient effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (bookRef.current) {
        const rect = bookRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        bookRef.current.style.setProperty('--mx', `${x}%`);
        bookRef.current.style.setProperty('--my', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Add auth-chronicle class to body
  useEffect(() => {
    document.body.classList.add('auth-chronicle');
    return () => document.body.classList.remove('auth-chronicle');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle specific error cases
        if (data.message?.toLowerCase().includes('email')) {
          setError('This email is already registered');
        } else if (data.message?.toLowerCase().includes('username')) {
          setError('This username is already taken');
        } else {
          setError(data.message || 'Registration failed. Please try again.');
        }
        return;
      }

      // Success - redirect to login
      router.push('/auth/login?registered=true');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link rel="stylesheet" href="/assets/css/auth-chronicle.css" />

      {/* Background */}
      <div className="auth-chronicle-bg" />

      {/* Shooting Stars */}
      <ShootingStars />

      {/* Back Button */}
      <Link href="/" className="ac-back" aria-label="Back to home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Main Shell */}
      <div className="ac-shell">
        <div className="ac-book" ref={bookRef}>
          <div className="ac-book-grid">
            {/* Left Page */}
            <div className="ac-page ac-page-left">
              <div className="ac-brand">
                <div className="ac-logo">
                  <Image
                    src="/assets/images/logo.png"
                    alt="Asterbook"
                    width={38}
                    height={38}
                  />
                </div>
                <div className="ac-chip">
                  <span style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#a855f7',
                    boxShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
                  }} />
                  New Account
                </div>
              </div>

              <div className="ac-hero">
                <h1>
                  Join the<br />
                  <span>Asterbook Universe</span>
                </h1>
                <p>
                  Create your account and become part of a thriving community.
                  Collect, trade, and explore endless possibilities in our ecosystem.
                </p>
              </div>

              <NetworkMap />
            </div>

            {/* Spine */}
            <div className="ac-spine" />

            {/* Right Page */}
            <div className="ac-page ac-page-right">
              <div className="ac-card">
                <h2>Create Account</h2>
                <p>Start your journey with Asterbook</p>

                {/* Error Alert */}
                {error && (
                  <div className="ac-alert">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <form className="ac-form" onSubmit={handleSubmit}>
                  <div className="ac-field">
                    <label className="ac-label" htmlFor="username">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      maxLength={20}
                      pattern="^[a-zA-Z0-9_]+$"
                      autoComplete="username"
                    />
                    <span style={{
                      display: 'block',
                      marginTop: 6,
                      fontSize: 12,
                      color: 'var(--ac-muted)'
                    }}>
                      3-20 characters, letters, numbers, and underscores only
                    </span>
                  </div>

                  <div className="ac-field">
                    <label className="ac-label" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="ac-field">
                    <label className="ac-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <span style={{
                      display: 'block',
                      marginTop: 6,
                      fontSize: 12,
                      color: 'var(--ac-muted)'
                    }}>
                      Minimum 8 characters
                    </span>
                  </div>

                  <div className="ac-field">
                    <label className="ac-label" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="ac-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ animation: 'spin 1s linear infinite' }}
                          >
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </form>

                <div className="ac-footer">
                  <span>Already have an account?</span>
                  <Link href="/auth/login">
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline keyframes for spinner */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
