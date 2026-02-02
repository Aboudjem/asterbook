'use client';

import Link from 'next/link';

export default function AsterJumpPage() {
  return (
    <section className="pc-container">
      <div className="pc-content">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <h5>Aster Jump</h5>
              <p className="text-muted">Play Aster Jump and have fun!</p>
            </div>
            <Link href="/gaming" className="btn btn-secondary btn-sm">
              <i className="ti ti-arrow-left me-1"></i> Back to Games
            </Link>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: '650px', overflow: 'hidden' }}
            >
              <iframe
                src="https://stardusthub.fun/games/aster-jump/embed"
                width="808"
                height="608"
                scrolling="no"
                style={{
                  border: 'none',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  maxWidth: '100%',
                }}
                title="Aster-Jump Game"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
