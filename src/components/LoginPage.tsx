import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  ExternalLink,
  Loader2,
  Moon,
  ShieldAlert,
  Sun,
  UserCheck,
  Check,
} from 'lucide-react';
import FluxLines from './FluxLines';
import {
  LOGIN_TRACK_PRESETS,
  LoginTrackId,
  LoginTrackPreset,
  classifyGoogleAuthError,
  getTrackPresetById,
  normalizeGuestCandidateName,
} from '../utils/authSession';

export interface LoginPageProps {
  defaultGuestName: string;
  onGoogleSignIn: (useRedirect?: boolean, preset?: LoginTrackPreset) => Promise<void>;
  onGuestSignIn: (guestName: string, preset: LoginTrackPreset) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  defaultGuestName,
  onGoogleSignIn,
  onGuestSignIn,
}) => {
  const [pageMode, setPageMode] = useState<'light' | 'dark'>('light');
  const [guestName, setGuestName] = useState<string>(
    defaultGuestName && defaultGuestName !== 'Guest Candidate' ? defaultGuestName : ''
  );
  const [selectedTrackId, setSelectedTrackId] = useState<LoginTrackId>('all');
  const [googleBusy, setGoogleBusy] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<{
    kind: 'popup-blocked' | 'popup-closed' | 'network' | 'other';
    message: string;
  } | null>(null);

  const guestInputRef = useRef<HTMLInputElement | null>(null);
  const portalCardRef = useRef<HTMLDivElement | null>(null);

  const isDark = pageMode === 'dark';
  const activePreset = getTrackPresetById(selectedTrackId);
  const resolvedGuestName = normalizeGuestCandidateName(guestName);

  const handleTriggerGoogle = async (useRedirect = false) => {
    setAuthNotice(null);
    setGoogleBusy(true);
    try {
      await onGoogleSignIn(useRedirect, activePreset);
    } catch (err) {
      const classified = classifyGoogleAuthError(err);
      setAuthNotice(classified);
    } finally {
      setGoogleBusy(false);
    }
  };

  const handleGuestSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onGuestSignIn(resolvedGuestName, activePreset);
  };

  const focusGuestEntry = () => {
    portalCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      guestInputRef.current?.focus();
    }, 180);
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-indigo-600 selection:text-white"
      style={{
        backgroundColor: isDark ? '#09090f' : '#fafafa',
        color: isDark ? '#f8fafc' : '#0f172a',
        backgroundImage: isDark
          ? 'radial-gradient(rgba(148, 163, 184, 0.16) 1px, transparent 1px)'
          : 'radial-gradient(rgba(15, 23, 42, 0.14) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Top Bar (3-Zone Contract: Brand Wordmark — 4 Nav Links — Primary CTA) */}
      <header
        className={`w-full border-b backdrop-blur-md sticky top-0 z-30 ${
          isDark ? 'border-[#1e293b]/80 bg-[#09090f]/85' : 'border-slate-200/80 bg-white/85'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#login-portal"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-2.5 text-lg font-bold tracking-tight whitespace-nowrap shrink-0 ${
              isDark ? 'text-[#ffffff]' : 'text-slate-950'
            }`}
          >
            <img
              src="/assets/aistudio/image_2c59f5bc.png"
              alt="NEXUS"
              className="w-7 h-7 object-contain rounded-md"
            />
            <span>NEXUS</span>
          </a>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav
            className={`hidden md:flex items-center gap-6 text-sm font-medium ${
              isDark ? 'text-[#cbd5e1]' : 'text-slate-600'
            }`}
          >
            <button
              type="button"
              onClick={() => {
                setSelectedTrackId('ple');
                focusGuestEntry();
              }}
              className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                isDark ? 'hover:text-[#ffffff]' : 'hover:text-slate-950'
              }`}
            >
              PLE Primary
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrackId('uce');
                focusGuestEntry();
              }}
              className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                isDark ? 'hover:text-[#ffffff]' : 'hover:text-slate-950'
              }`}
            >
              UCE Secondary
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrackId('visuals');
                focusGuestEntry();
              }}
              className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                isDark ? 'hover:text-[#ffffff]' : 'hover:text-slate-950'
              }`}
            >
              1K/2K/4K Visuals
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedTrackId('leaderboard');
                focusGuestEntry();
              }}
              className={`hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer ${
                isDark ? 'hover:text-[#ffffff]' : 'hover:text-slate-950'
              }`}
            >
              Leaderboard
            </button>
          </nav>

          {/* Zone 3: Theme Toggle + Single Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setPageMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
              aria-label={isDark ? 'Switch login theme to light' : 'Switch login theme to dark'}
              className={`p-2 rounded-lg border cursor-pointer ${
                isDark
                  ? 'border-[#1e293b] bg-[#0f172a] text-[#e2e8f0] hover:bg-[#1e293b]'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              type="button"
              onClick={() => handleTriggerGoogle(false)}
              disabled={googleBusy}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#ffffff] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 rounded-lg whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
            >
              {googleBusy ? 'Connecting...' : 'Sign in with Google'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 pt-7 sm:pt-8 pb-10 flex flex-col gap-7">
        {/* Editorial Hero Header Band */}
        <section className="max-w-6xl space-y-4">
          {/* Interactive Portal Announcement Link */}
          <div>
            <button
              type="button"
              onClick={focusGuestEntry}
              className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium shadow-xs cursor-pointer whitespace-nowrap ${
                isDark
                  ? 'border-[#1e293b] bg-[#0f172a] text-[#cbd5e1] hover:border-[#334155]'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <span
                className={`px-1.5 py-0.5 rounded font-semibold text-[11px] ${
                  isDark ? 'bg-[#ffffff] text-[#020617]' : 'bg-slate-950 text-white'
                }`}
              >
                UNEB
              </span>
              <span>Candidate Portal · PLE &amp; UCE/UACE</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>
          </div>

          <h1
            className={`text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.08] max-w-3xl ${
              isDark ? 'text-[#ffffff]' : 'text-slate-950'
            }`}
            style={{ textWrap: 'balance' }}
          >
            Interactive UNEB preparation built for every candidate.
          </h1>

          {/* Two-Column Action Row & Summary Copy */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => handleTriggerGoogle(false)}
                disabled={googleBusy}
                data-testid="hero-google-signin-btn"
                className={`px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2.5 shadow-md active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 ${
                  isDark
                    ? 'bg-[#ffffff] text-[#020617] hover:bg-[#f1f5f9]'
                    : 'bg-slate-950 text-white hover:bg-slate-800'
                }`}
              >
                {googleBusy ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleGuestSubmit()}
                data-testid="hero-guest-signin-btn"
                className={`px-5 py-3 rounded-xl border font-semibold text-sm flex items-center gap-2 shadow-xs active:scale-[0.98] whitespace-nowrap shrink-0 cursor-pointer ${
                  isDark
                    ? 'bg-[#0f172a] border-[#334155] text-[#f1f5f9] hover:bg-[#1e293b] hover:border-[#475569]'
                    : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <UserCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Continue as Guest</span>
              </button>
            </div>

            <p className={`text-sm max-w-sm leading-relaxed ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
              Practice UNEB past-paper stages, explore 1K/2K/4K study photos &amp; diagrams, and track live rankings across PLE, UCE, and UACE.
            </p>
          </div>
        </section>

        {/* Live WebGL2 FluxLines Showcase Stage with Frosted Login Windows */}
        <section
          id="login-portal"
          ref={portalCardRef}
          className={`relative rounded-2xl sm:rounded-3xl border overflow-hidden shadow-2xl min-h-[480px] ${
            isDark ? 'border-[#1e293b]' : 'border-slate-200/90'
          }`}
          style={{ backgroundColor: '#1e1342' }}
        >
          {/* Live Interactive FluxLines WebGL2 Background */}
          <div className="absolute inset-0 z-0" data-testid="flux-lines-backdrop">
            <FluxLines
              colors={activePreset.colors}
              speed={0.55}
              scale={1.35}
              turbulence={1.05}
              fluidity={0.18}
              rimWidth={0.34}
              sharpness={2.1}
              shimmer={1.3}
              glow={2.4}
              lineWidth={1.25}
              flowDirection="down"
              opacity={1}
              mouseInteraction={true}
              mouseStrength={1.15}
              mouseRadius={0.38}
              clickSwirl={true}
              transparent={false}
              backgroundColor="#1e1342"
            />
          </div>

          {/* Soft Luminous Violet Contrast Veil */}
          <div
            className="absolute inset-0 z-1 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 25% 25%, rgba(167, 139, 250, 0.28), transparent 58%), radial-gradient(circle at 80% 75%, rgba(99, 102, 241, 0.22), transparent 55%)',
            }}
          />

          {/* Floating Frosted Glass Window Cards */}
          <div className="relative z-10 p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Window 1 (Left Main Card): Google & Guest Candidate Access */}
            <div
              className={`lg:col-span-7 rounded-2xl backdrop-blur-xl border shadow-2xl overflow-hidden ${
                isDark
                  ? 'bg-[#0b0c15]/88 border-white/15 text-[#f1f5f9]'
                  : 'bg-white/92 border-white/75 text-slate-900'
              }`}
            >
              {/* Window Title Bar */}
              <div
                className={`px-5 py-3 border-b flex items-center justify-between ${
                  isDark ? 'border-[#1e293b]/80' : 'border-slate-200/80'
                }`}
              >
                <span className={`text-xs font-medium ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                  Candidate Sign-In
                </span>
                <span className={`text-xs font-mono tabular-nums ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                  PLE · UCE · UACE
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="space-y-1">
                  <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-950'}`}>
                    Access your UNEB study workspace
                  </h2>
                  <p className={`text-xs sm:text-sm ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
                    Sign in with Google for cloud sync across devices, or enter as a Guest Candidate with your preferred display name.
                  </p>
                </div>

                {/* Inline Auth Error / Popup Blocked Recovery Alert */}
                {authNotice && (
                  <div
                    role="alert"
                    className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
                      isDark
                        ? 'border-amber-700/70 bg-amber-950/75 text-amber-100'
                        : 'border-amber-300 bg-amber-50 text-amber-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert
                        className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}
                      />
                      <div className="space-y-1">
                        <div className="font-semibold">
                          {authNotice.kind === 'popup-blocked'
                            ? 'Google Sign-In Popup Blocked'
                            : 'Google Sign-In Notice'}
                        </div>
                        <p className="leading-relaxed opacity-90">{authNotice.message}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleTriggerGoogle(false)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs hover:opacity-90 cursor-pointer ${
                          isDark ? 'bg-[#ffffff] text-[#0f172a]' : 'bg-slate-900 text-white'
                        }`}
                      >
                        Retry Popup
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTriggerGoogle(true)}
                        className={`px-3 py-1.5 rounded-lg border font-semibold text-xs cursor-pointer ${
                          isDark
                            ? 'border-amber-600/60 bg-[#0f172a]/80 text-amber-100 hover:bg-[#0f172a]'
                            : 'border-amber-400/60 bg-white/90 text-amber-950 hover:bg-white'
                        }`}
                      >
                        Try Redirect Sign-In
                      </button>
                      <button
                        type="button"
                        onClick={focusGuestEntry}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs underline underline-offset-2 cursor-pointer ${
                          isDark ? 'text-amber-200' : 'text-amber-900'
                        }`}
                      >
                        Use Guest Access Instead
                      </button>
                    </div>
                  </div>
                )}

                {/* Google Account Sign-In Option */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleTriggerGoogle(false)}
                    disabled={googleBusy}
                    data-testid="card-google-signin-btn"
                    className={`w-full py-3 px-4 rounded-xl border font-semibold text-sm flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60 whitespace-nowrap ${
                      isDark
                        ? 'bg-[#0f172a] border-[#334155] hover:border-[#64748b] hover:bg-[#1e293b]/80 text-[#ffffff]'
                        : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-900'
                    }`}
                  >
                    {googleBusy ? (
                      <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    )}
                    <span>{googleBusy ? 'Connecting Google...' : 'Continue with Google'}</span>
                  </button>
                  <p className={`text-xs text-center ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                    Cloud Leaderboard Sync · Google Drive Notes · Calendar Study Drills
                  </p>
                </div>

                {/* Hairline Divider */}
                <div className="relative flex items-center py-0.5">
                  <div className={`flex-grow border-t ${isDark ? 'border-[#1e293b]' : 'border-slate-200'}`} />
                  <span className={`shrink-0 mx-3 text-xs font-medium ${isDark ? 'text-[#64748b]' : 'text-slate-400'}`}>
                    or enter as a guest
                  </span>
                  <div className={`flex-grow border-t ${isDark ? 'border-[#1e293b]' : 'border-slate-200'}`} />
                </div>

                {/* Guest Candidate Form */}
                <form onSubmit={handleGuestSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="login-guest-name-input"
                      className={`block text-xs font-semibold mb-1 ${isDark ? 'text-[#cbd5e1]' : 'text-slate-700'}`}
                    >
                      Guest Candidate Display Name
                    </label>
                    <input
                      ref={guestInputRef}
                      id="login-guest-name-input"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      maxLength={60}
                      placeholder="e.g. Sarah Namubiru (or leave blank for Guest Candidate)"
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                      style={{
                        backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        color: isDark ? '#ffffff' : '#0f172a',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    data-testid="card-guest-submit-btn"
                    className="w-full py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[#ffffff] font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-[0.99] cursor-pointer whitespace-nowrap"
                  >
                    <span className="truncate">Continue as Guest ({resolvedGuestName})</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Two Floating Frosted Windows (Session Preview + Starting Tracks) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {/* Top-Right Window: Session Preview */}
              <div
                className={`rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden ${
                  isDark
                    ? 'bg-[#0b0c15]/85 border-white/15 text-[#f1f5f9]'
                    : 'bg-white/88 border-white/75 text-slate-900'
                }`}
              >
                <div
                  className={`px-4 py-2.5 border-b flex items-center justify-between ${
                    isDark ? 'border-[#1e293b]/80' : 'border-slate-200/80'
                  }`}
                >
                  <span className={`text-xs font-medium ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                    Session Preview
                  </span>
                  <span className={`text-[11px] font-mono ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                    Ready
                  </span>
                </div>
                <div className={`p-4 font-mono text-xs space-y-2 ${isDark ? 'text-[#cbd5e1]' : 'text-slate-700'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className={isDark ? 'text-[#64748b]' : 'text-slate-400'}>candidate:</span>
                    <span className={`font-semibold truncate max-w-[200px] ${isDark ? 'text-[#ffffff]' : 'text-slate-950'}`}>
                      {resolvedGuestName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={isDark ? 'text-[#64748b]' : 'text-slate-400'}>starting track:</span>
                    <span className={`font-semibold truncate ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {activePreset.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={isDark ? 'text-[#64748b]' : 'text-slate-400'}>syllabus filter:</span>
                    <span className="tabular-nums">{activePreset.levelFilter}</span>
                  </div>
                </div>
              </div>

              {/* Bottom-Right Window: Curriculum Track Presets */}
              <div
                className={`rounded-2xl backdrop-blur-xl border shadow-xl overflow-hidden ${
                  isDark
                    ? 'bg-[#0b0c15]/85 border-white/15 text-[#f1f5f9]'
                    : 'bg-white/88 border-white/75 text-slate-900'
                }`}
              >
                <div
                  className={`px-4 py-2.5 border-b flex items-center justify-between ${
                    isDark ? 'border-[#1e293b]/80' : 'border-slate-200/80'
                  }`}
                >
                  <span className={`text-xs font-medium ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                    Starting Tracks
                  </span>
                  <span className={`text-[11px] ${isDark ? 'text-[#64748b]' : 'text-slate-400'}`}>
                    Interactive preview
                  </span>
                </div>
                <div className="p-2.5 space-y-1">
                  {LOGIN_TRACK_PRESETS.map((preset) => {
                    const isSelected = preset.id === activePreset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedTrackId(preset.id)}
                        className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 text-left cursor-pointer ${
                          isSelected
                            ? isDark
                              ? 'bg-indigo-950/70 text-[#ffffff]'
                              : 'bg-indigo-50 text-slate-950'
                            : isDark
                              ? 'hover:bg-[#0f172a]/70 text-[#cbd5e1]'
                              : 'hover:bg-slate-100/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="flex items-center -space-x-1 shrink-0" aria-hidden="true">
                            {preset.dots.map((hex, i) => (
                              <span
                                key={i}
                                className={`w-3 h-3 rounded-full ring-1 ${
                                  isDark ? 'ring-[#020617]' : 'ring-white'
                                }`}
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold truncate">
                            {preset.name}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] truncate flex items-center gap-1.5 ${
                            isDark ? 'text-[#94a3b8]' : 'text-slate-500'
                          }`}
                        >
                          <span className="hidden sm:inline">{preset.subtitle}</span>
                          {isSelected && (
                            <Check
                              className={`w-3.5 h-3.5 shrink-0 ${
                                isDark ? 'text-indigo-400' : 'text-indigo-600'
                              }`}
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer
        className={`border-t py-5 px-5 sm:px-8 text-xs ${
          isDark ? 'border-[#1e293b]/80 text-[#94a3b8]' : 'border-slate-200/80 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`font-semibold ${isDark ? 'text-[#e2e8f0]' : 'text-slate-800'}`}>NEXUS</span>
            <span aria-hidden="true">·</span>
            <span>Uganda National Examinations Board Study Portal</span>
          </div>
          <a
            href="https://uneb.ac.ug/"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 ${
              isDark ? 'text-[#cbd5e1] hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <span>uneb.ac.ug</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
