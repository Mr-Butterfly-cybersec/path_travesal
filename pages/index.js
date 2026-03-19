import { useState, useEffect } from 'react';
import Head from 'next/head';

const ARCHIVE_FILES = [
  {
    name: 'report_alpha.txt',
    code: 'ALPHA',
    label: 'Titan Specimen #001',
    sub:   'Sawney — Captured Year 854',
  },
  {
    name: 'report_beta.txt',
    code: 'BETA',
    label: 'Wall Breach Analysis',
    sub:   'Wall Maria — Year 845 Incident',
  },
  {
    name: 'specimen_analysis.txt',
    code: 'DELTA',
    label: 'Founding Titan Data',
    sub:   'Partial — Level III Clearance',
  },
];

export default function Home() {
  const [activeFile, setActiveFile] = useState(null);
  const [content,    setContent]    = useState(null);
  const [error,      setError]      = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [elapsed,    setElapsed]    = useState('00:00:00');

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const s   = Math.floor((Date.now() - start) / 1000);
      const h   = String(Math.floor(s / 3600)).padStart(2, '0');
      const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const sec = String(s % 60).padStart(2, '0');
      setElapsed(`${h}:${m}:${sec}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  async function loadFile(filename) {
    setLoading(true);
    setError(null);
    setContent(null);
    setActiveFile(filename);

    try {
      const res = await fetch('/api/file?file=' + encodeURIComponent(filename));
      if (res.ok) {
        setContent(await res.text());
      } else {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(data.error || 'Request failed');
      }
    } catch {
      setError('Network error — connection lost');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Paradis Titan Research Database</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@700;900&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Full-page background — ruined city */}
      <div className="bg-layer" />

      <div className="shell">

        {/* ── HEADER — walking.png as cinematic backdrop ── */}
        <header className="hdr">
          <div className="hdr-img" aria-hidden="true" />
          <div className="hdr-vignette" aria-hidden="true" />
          <div className="hdr-inner">
            <WingsCrest />
            <div className="hdr-center">
              <span className="hdr-eyebrow">Survey Corps · Research Division · Paradis Island</span>
              <h1 className="hdr-title">TITAN RESEARCH DATABASE</h1>
              <span className="hdr-sub">
                <span className="hdr-dot" aria-hidden="true" />
                CLASSIFIED · ACCESS LEVEL III · ALL SESSIONS MONITORED
              </span>
            </div>
            <WingsCrest flip />
          </div>
        </header>

        {/* ── MAIN BODY ── */}
        <div className="body">

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="sb-bracket sb-bracket--tl" aria-hidden="true" />
            <div className="sb-bracket sb-bracket--bl" aria-hidden="true" />

            <div className="sb-head">
              <span className="sb-label">Research Archive</span>
              <div className="sb-rule" />
            </div>

            <ul className="file-list" role="list">
              {ARCHIVE_FILES.map((f, i) => (
                <li
                  key={f.name}
                  role="button"
                  tabIndex={0}
                  style={{ animationDelay: `${0.35 + i * 0.12}s` }}
                  className={'file-entry' + (activeFile === f.name ? ' is-active' : '')}
                  onClick={() => loadFile(f.name)}
                  onKeyDown={e => e.key === 'Enter' && loadFile(f.name)}
                >
                  <span className="fe-code">{f.code}</span>
                  <span className="fe-label">{f.label}</span>
                  <span className="fe-sub">{f.sub}</span>
                  <span className="fe-filename">{f.name}</span>
                </li>
              ))}
            </ul>

            {/* Atmospheric image at sidebar bottom */}
            <div className="sb-img-wrap" aria-hidden="true">
              <div className="sb-img" />
              <div className="sb-img-fade" />
            </div>
          </aside>

          {/* Content pane */}
          <section className="pane" aria-live="polite" aria-label="File content">

            {/* IDLE */}
            {!activeFile && !loading && (
              <div className="pane-idle">
                <WingsCrest large />
                <p className="idle-title">SELECT A DOCUMENT FROM THE ARCHIVE</p>
                <p className="idle-hint">
                  All access is logged and reported to the Military Police Bureau.
                  Unauthorized traversal of restricted paths is a capital offence under Wall Law.
                </p>
                <div className="idle-stamp">SECURE TERMINAL</div>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="pane-loading">
                <div className="loader-ring" />
                <span className="loader-text">RETRIEVING FROM ARCHIVE</span>
              </div>
            )}

            {/* ERROR — titan fills the pane */}
            {error && !loading && (
              <div className="pane-error">
                <div className="err-bg" aria-hidden="true" />
                <div className="err-overlay" aria-hidden="true" />
                <div className="err-content">
                  <p className="err-title">ACCESS DENIED</p>
                  <div className="err-divider" />
                  <p className="err-msg">{error}</p>
                  <p className="err-note">This incident has been logged.</p>
                </div>
              </div>
            )}

            {/* FILE CONTENT */}
            {content && !loading && (
              <div className="pane-content" key={activeFile}>
                <div className="ct-bracket ct-bracket--tr" aria-hidden="true" />
                <div className="ct-bracket ct-bracket--br" aria-hidden="true" />
                <div className="ct-hdr">
                  <span className="ct-badge">
                    {ARCHIVE_FILES.find(f => f.name === activeFile)?.code ?? 'FILE'}
                  </span>
                  <span className="ct-filename">{activeFile}</span>
                  <div className="ct-rule" />
                </div>
                <pre className="ct-body">{content}</pre>
              </div>
            )}

          </section>
        </div>

        {/* ── FOOTER ── */}
        <footer className="ftr">
          <span>Paradis Research Division</span>
          <span className="ftr-sep" aria-hidden="true">◈</span>
          <span>Terminal v3.1.4</span>
          <span className="ftr-sep" aria-hidden="true">◈</span>
          <span>Year 854 — Classified Internal Use Only</span>
          <span className="ftr-right">
            <span className="ftr-live-dot" aria-hidden="true" />
            SESSION &nbsp;<span className="ftr-timer">{elapsed}</span>
          </span>
        </footer>
      </div>
    </>
  );
}

function WingsCrest({ flip, large }) {
  const w = large ? 110 : 78;
  const h = large ? 55  : 39;
  return (
    <svg
      className={'wings' + (flip ? ' wings--flip' : '') + (large ? ' wings--large' : '')}
      viewBox="0 0 80 40"
      width={w}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left feathers — three tiers */}
      <path d="M38 21 C31 15 19 11 3 17 C13 17 23 19 29 25Z"   fill="currentColor" opacity="0.95"/>
      <path d="M38 21 C29 13 15  9 1 13 C11 15 23 17 31 23Z"   fill="currentColor" opacity="0.7"/>
      <path d="M38 21 C27 11 13  7 0  9 C10 13 21 15 33 21Z"   fill="currentColor" opacity="0.45"/>
      {/* Right feathers */}
      <path d="M42 21 C49 15 61 11 77 17 C67 17 57 19 51 25Z"  fill="currentColor" opacity="0.95"/>
      <path d="M42 21 C51 13 65  9 79 13 C69 15 57 17 49 23Z"  fill="currentColor" opacity="0.7"/>
      <path d="M42 21 C53 11 67  7 80  9 C70 13 59 15 47 21Z"  fill="currentColor" opacity="0.45"/>
      {/* Body */}
      <ellipse cx="40" cy="23" rx="3.2" ry="5.5" fill="currentColor"/>
      <circle  cx="40" cy="14.5" r="2.8"          fill="currentColor"/>
    </svg>
  );
}
