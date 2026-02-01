'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShootingStars } from '@/components/auth/shooting-stars';
import { NetworkMap } from '@/components/auth/network-map';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registered = searchParams.get('registered') === 'true';

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
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
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
                    background: '#22d3ee',
                    boxShadow: '0 0 8px rgba(34, 211, 238, 0.6)'
                  }} />
                  Secure Login
                </div>
              </div>

              <div className="ac-hero">
                <h1>
                  Welcome back to<br />
                  <span>Asterbook</span>
                </h1>
                <p>
                  Enter your credentials to access your dashboard, manage your portfolio,
                  and explore the universe of possibilities.
                </p>
              </div>

              <NetworkMap />
            </div>

            {/* Spine */}
            <div className="ac-spine" />

            {/* Right Page */}
            <div className="ac-page ac-page-right">
              <div className="ac-card">
                <h2>Sign In</h2>
                <p>Access your Asterbook account</p>

                {/* Success message from registration */}
                {registered && (
                  <div className="ac-alert" style={{
                    borderColor: 'rgba(34, 197, 94, 0.25)',
                    background: 'rgba(34, 197, 94, 0.10)',
                    color: 'rgba(187, 247, 208, 0.95)',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Registration successful! Please sign in.</span>
                  </div>
                )}

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
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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
                          Signing in...
                        </span>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>

                <div className="ac-footer">
                  <span>New to Asterbook?</span>
                  <Link href="/auth/register">
                    Create an account
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

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070A14]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
