'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'danger'>('success');

  const lengthOk = newPassword.length >= 8;
  const numberOk = /\d/.test(newPassword);
  const caseOk = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const strength = (lengthOk ? 1 : 0) + (numberOk ? 1 : 0) + (caseOk ? 1 : 0);
  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const canSubmit = strength === 3 && !mismatch && newPassword.length > 0 && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission - in real app, call API
    setMessage('Password changed successfully!');
    setMessageType('success');
  };

  return (
    <div className="auth-chronicle">
      <Link href="/profile" className="ac-back" title="Back to Profile">
        <i className="ti ti-arrow-left"></i>
      </Link>

      <div className="auth-chronicle-bg" aria-hidden="true"></div>

      <main className="ac-shell">
        <section className="ac-book">
          <div className="ac-spine" aria-hidden="true"></div>
          <div className="ac-book-grid">
            <div className="ac-page ac-page-left">
              <div className="ac-brand">
                <div className="ac-logo">
                  <img src="/assets/images/logo.png" alt="Asterbook" />
                </div>
                <div className="ac-chip">
                  <i className="ti ti-shield-lock"></i> Security
                </div>
              </div>

              <div className="ac-hero">
                <h1>
                  Chapter 02: <span>Change password</span>
                </h1>
                <p>
                  Update your password to keep your account safe. Use at least 8 characters and
                  avoid reused passwords.
                </p>
              </div>

              <div className="ac-map">
                <div className="ac-map-grid" aria-hidden="true">
                  <span className="ac-node is-accent" style={{ left: '18%', top: '34%' }}></span>
                  <span className="ac-node" style={{ left: '30%', top: '22%' }}></span>
                  <span className="ac-node" style={{ left: '48%', top: '46%' }}></span>
                  <span className="ac-node" style={{ left: '66%', top: '28%' }}></span>
                  <span className="ac-node" style={{ left: '82%', top: '52%' }}></span>
                  <span className="ac-node" style={{ left: '58%', top: '74%' }}></span>
                </div>
                <div className="ac-map-caption">
                  <span>
                    <strong>Security</strong> - Confirm your new key
                  </span>
                  <span>Encrypted - Safe - Asterbook</span>
                </div>
              </div>
            </div>

            <div className="ac-page ac-page-right">
              <div className="ac-card" id="authCard">
                <h2>Change password</h2>
                <p>Enter your current password, then choose a new one.</p>

                {message && (
                  <div className="ac-alert">
                    <i className="ti ti-alert-triangle"></i>
                    <div>{message}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="ac-form" noValidate>
                  <div className="ac-field">
                    <label className="ac-label" htmlFor="current_password">
                      Current password
                    </label>
                    <div className="ac-passwrap">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        name="current_password"
                        id="current_password"
                        className="form-control"
                        placeholder="Enter current password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="ac-pass-toggle"
                        onClick={() => setShowCurrent(!showCurrent)}
                        aria-label="Show password"
                      >
                        <i className={`ti ${showCurrent ? 'ti-eye-off' : 'ti-eye'}`}></i>
                      </button>
                    </div>
                  </div>

                  <div className="ac-field">
                    <label className="ac-label" htmlFor="new_password">
                      New password
                    </label>
                    <div className="ac-passwrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        name="new_password"
                        id="new_password"
                        className="form-control"
                        placeholder="Enter new password"
                        minLength={8}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="ac-pass-toggle"
                        onClick={() => setShowNew(!showNew)}
                        aria-label="Show password"
                      >
                        <i className={`ti ${showNew ? 'ti-eye-off' : 'ti-eye'}`}></i>
                      </button>
                    </div>

                    <div className="ac-meter" aria-hidden="true">
                      <div
                        className={`ac-meter-bar ${strength === 1 ? 'is-weak' : strength === 2 ? 'is-medium' : strength === 3 ? 'is-strong' : ''}`}
                      ></div>
                    </div>

                    <div className="ac-validate" aria-live="polite">
                      <div className={`ac-validate-item ${lengthOk ? 'is-valid' : ''}`}>
                        <i className={`ti ${lengthOk ? 'ti-check' : 'ti-circle'}`}></i>
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`ac-validate-item ${numberOk ? 'is-valid' : ''}`}>
                        <i className={`ti ${numberOk ? 'ti-check' : 'ti-circle'}`}></i>
                        <span>Contains a number</span>
                      </div>
                      <div className={`ac-validate-item ${caseOk ? 'is-valid' : ''}`}>
                        <i className={`ti ${caseOk ? 'ti-check' : 'ti-circle'}`}></i>
                        <span>Uppercase & lowercase letters</span>
                      </div>
                    </div>
                  </div>

                  <div className="ac-field">
                    <label className="ac-label" htmlFor="confirm_password">
                      Confirm new password
                    </label>
                    <div className="ac-passwrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        name="confirm_password"
                        id="confirm_password"
                        className="form-control"
                        placeholder="Confirm new password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="ac-pass-toggle"
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label="Show password"
                      >
                        <i className={`ti ${showConfirm ? 'ti-eye-off' : 'ti-eye'}`}></i>
                      </button>
                    </div>
                    <div className={`ac-help ${mismatch ? 'is-visible' : ''}`}>
                      <i className="ti ti-alert-circle me-1"></i> Passwords do not match
                    </div>
                  </div>

                  <div className="ac-actions">
                    <button type="submit" className="btn btn-primary" disabled={!canSubmit}>
                      Update password <i className="ti ti-arrow-right ms-2"></i>
                    </button>
                  </div>

                  <div className="ac-footer">
                    <span>Changed your mind?</span>
                    <Link href="/profile">Back to profile</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .ac-passwrap {
          position: relative;
        }
        .ac-passwrap input.form-control {
          padding-right: 56px;
        }
        .ac-pass-toggle {
          position: absolute;
          top: 50%;
          right: 8px;
          transform: translateY(-50%);
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.72);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, color 0.2s ease;
          cursor: pointer;
        }
        .ac-pass-toggle:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
        }
        .ac-meter {
          height: 4px;
          background: rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          overflow: hidden;
          margin-top: 10px;
        }
        .ac-meter-bar {
          height: 100%;
          width: 0%;
          transition: width 0.25s ease, background-color 0.25s ease;
        }
        .ac-meter-bar.is-weak {
          width: 33%;
          background: #ef4444;
        }
        .ac-meter-bar.is-medium {
          width: 66%;
          background: #f59e0b;
        }
        .ac-meter-bar.is-strong {
          width: 100%;
          background: #22c55e;
        }
        .ac-validate {
          margin-top: 10px;
        }
        .ac-validate-item {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.76);
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
          transition: color 0.2s ease;
        }
        .ac-validate-item.is-valid {
          color: rgba(34, 197, 94, 0.95);
        }
        .ac-help {
          font-size: 0.85rem;
          margin-top: 8px;
          color: rgba(255, 90, 90, 0.95);
          display: none;
        }
        .ac-help.is-visible {
          display: block;
        }
      `}</style>
    </div>
  );
}
