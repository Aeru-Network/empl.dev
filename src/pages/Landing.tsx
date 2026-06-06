import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../tokens';
import { SearchIcon, CodeIcon, BriefcaseIcon, UsersIcon } from '../components/Icons';

type Page =
  | 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage'
  | 'postDetail' | 'postEditor' | 'settings' | 'onboarding' | 'companies' | 'company' | 'companyManage';

interface LandingProps {
  onNavigate: (page: Page) => void;
}

const D = {
  bg: '#000',
  card: '#0f0f0f',
  cardHover: '#161616',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.18)',
  heading: '#ffffff',
  body: '#a1a1aa',
  muted: '#52525b',
  accent: '#0070f3',
  accentDim: 'rgba(0,112,243,0.12)',
  success: '#10b981',
  successDim: 'rgba(16,185,129,0.12)',
  orange: '#f97316',
  orangeDim: 'rgba(249,115,22,0.12)',
  tag: 'rgba(255,255,255,0.06)',
  tagText: '#a1a1aa',
};

const NAV_H = 56;
const TOTAL = 3;
const SH = `calc(100vh - ${NAV_H}px)`;

const FeatureCard: React.FC<{ icon: React.ReactNode; accentDim: string; title: string; desc: string }> = ({ icon, accentDim, title, desc }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? D.cardHover : D.card,
        borderRadius: 14,
        padding: '32px 28px',
        border: `1px solid ${hovered ? D.borderHover : D.border}`,
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: `all ${tokens.transitions.normal}`,
        flex: 1,
      }}
    >
      <div style={{
        width: 48, height: 48, borderRadius: 12, backgroundColor: accentDim,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0, lineHeight: 1.75 }}>{desc}</p>
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const [section, setSection] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const sectionRef = useRef(0);
  const blockRef = useRef(false);

  // Lock body scroll while fullpage is active
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Register all scroll/key/touch handlers once with stable refs
  useEffect(() => {
    const go = (i: number) => {
      if (blockRef.current || i < 0 || i >= TOTAL || i === sectionRef.current) return;
      blockRef.current = true;
      sectionRef.current = i;
      setSection(i);
      setTimeout(() => { blockRef.current = false; }, 820);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) < 20) return;
      go(e.deltaY > 0 ? sectionRef.current + 1 : sectionRef.current - 1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); go(sectionRef.current + 1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); go(sectionRef.current - 1); }
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = touchY - e.changedTouches[0].clientY;
      if (diff > 40) go(sectionRef.current + 1);
      else if (diff < -40) go(sectionRef.current - 1);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const goTo = (i: number) => {
    if (blockRef.current || i < 0 || i >= TOTAL || i === sectionRef.current) return;
    blockRef.current = true;
    sectionRef.current = i;
    setSection(i);
    setTimeout(() => { blockRef.current = false; }, 820);
  };

  return (
    <div style={{ height: SH, overflow: 'hidden', position: 'relative', background: D.bg }}>

      {/* ── Fullpage slider ── */}
      <div style={{
        transform: `translateY(calc(${section} * -1 * (100vh - ${NAV_H}px)))`,
        transition: 'transform 0.78s cubic-bezier(0.77, 0, 0.175, 1)',
        willChange: 'transform',
      }}>

        {/* ─────────────────────────────
            Section 0: Hero
        ───────────────────────────── */}
        <div style={{
          height: SH, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#000',
        }}>
          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
          {/* Glow */}
          <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 320, background: 'radial-gradient(ellipse,rgba(0,112,243,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 680, width: '100%', padding: '0 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${D.border}`,
              borderRadius: 999, padding: '5px 14px', marginBottom: 24,
            }}>
              <CodeIcon size={12} color={D.accent} />
              <span style={{ fontSize: 11, color: D.body, fontWeight: 500, letterSpacing: '0.3px' }}>개발자를 위한 커리어 플랫폼</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(38px, 7.5vw, 76px)',
              fontWeight: 800, color: D.heading, margin: '0 0 18px',
              lineHeight: 1.04, letterSpacing: '-2.5px',
            }}>
              코드로 말하는<br />개발자 커리어
            </h1>

            <p style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)', color: D.body,
              margin: '0 auto 36px', lineHeight: 1.7, maxWidth: 460,
            }}>
              GitHub 프로젝트, 기술 블로그, 오픈소스 기여로<br />당신의 역량을 증명하세요.
            </p>

            {/* Search */}
            <div style={{
              display: 'flex', background: '#111', borderRadius: 9,
              border: `1px solid ${D.border}`, overflow: 'hidden',
              maxWidth: 500, margin: '0 auto 44px',
            }}>
              <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }}>
                <SearchIcon size={16} color={D.muted} />
              </div>
              <input
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="개발자 또는 기술 스택 검색..."
                style={{
                  flex: 1, border: 'none', outline: 'none',
                  fontSize: tokens.fontSizes.sm, color: D.heading,
                  padding: '14px 0', background: 'transparent', fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => onNavigate('explore')}
                style={{
                  background: '#fff', color: '#000', border: 'none',
                  padding: '0 22px', fontSize: tokens.fontSizes.sm,
                  fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                검색
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(28px, 6vw, 72px)', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 800, color: D.heading, lineHeight: 1, letterSpacing: '-1px' }}>12,000+</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 6, fontWeight: 500 }}>개발자</div>
              </div>
              <div style={{ width: 1, height: 36, background: D.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 800, color: D.heading, lineHeight: 1, letterSpacing: '-1px' }}>850+</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 6, fontWeight: 500 }}>채용 공고</div>
              </div>
              <div style={{ width: 1, height: 36, background: D.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(20px, 3.5vw, 30px)', fontWeight: 800, color: D.heading, lineHeight: 1, letterSpacing: '-1px' }}>3,200+</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 6, fontWeight: 500 }}>오픈소스</div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <ScrollHint onClick={() => goTo(1)} />
        </div>

        {/* ─────────────────────────────
            Section 1: Features
        ───────────────────────────── */}
        <div style={{
          height: SH, position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#040404',
          borderTop: `1px solid ${D.border}`,
        }}>
          {/* Subtle radial */}
          <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse,rgba(16,185,129,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1000, width: '100%', padding: '0 20px', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: D.muted, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: 14 }}>
                PLATFORM
              </div>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 800, color: D.heading, margin: 0, letterSpacing: '-1.2px' }}>
                왜 empl.dev인가요?
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <FeatureCard
                icon={<CodeIcon size={24} color={D.accent} />}
                accentDim={D.accentDim}
                title="코드 포트폴리오"
                desc="GitHub 연동으로 프로젝트와 기여도를 자동으로 가져와 보여줍니다. 코드가 곧 이력서입니다."
              />
              <FeatureCard
                icon={<BriefcaseIcon size={24} color={D.orange} />}
                accentDim={D.orangeDim}
                title="개발자 맞춤 채용"
                desc="기술 스택 기반 매칭으로 딱 맞는 포지션을 추천받으세요. 헤드헌터 없이 직접 지원."
              />
              <FeatureCard
                icon={<UsersIcon size={24} color={D.success} />}
                accentDim={D.successDim}
                title="개발자 네트워크"
                desc="같은 기술을 쓰는 개발자들과 연결하고 오픈소스로 협업하세요. 커뮤니티가 경력입니다."
              />
            </div>
          </div>

          <ScrollHint onClick={() => goTo(2)} />
        </div>

        {/* ─────────────────────────────
            Section 2: CTA
        ───────────────────────────── */}
        <div style={{
          height: SH, position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#000',
          borderTop: `1px solid ${D.border}`,
        }}>
          {/* Top accent line */}
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,112,243,0.4), transparent)' }} />
          {/* Glow */}
          <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 300, background: 'radial-gradient(ellipse,rgba(0,112,243,0.1) 0%,transparent 65%)', pointerEvents: 'none' }} />

          <div style={{ textAlign: 'center', maxWidth: 600, padding: '0 20px', position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(0,112,243,0.1)', border: '1px solid rgba(0,112,243,0.25)',
              borderRadius: 999, padding: '5px 16px', marginBottom: 28,
              fontSize: 11, fontWeight: 600, color: D.accent, letterSpacing: '0.3px',
            }}>
              무료로 시작 · 신용카드 불필요
            </div>

            <h2 style={{
              fontSize: 'clamp(32px, 6vw, 68px)',
              fontWeight: 800, color: D.heading, margin: '0 0 16px',
              lineHeight: 1.05, letterSpacing: '-2px',
            }}>
              지금 시작하세요
            </h2>

            <p style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', color: D.body, margin: '0 0 40px', lineHeight: 1.65 }}>
              무료로 프로필을 만들고 개발자 커뮤니티에 합류하세요.<br />채용 담당자에게 먼저 발견되는 기회를 잡으세요.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('login')}
                style={{
                  background: '#fff', color: '#000', border: 'none', borderRadius: 9,
                  padding: '13px 32px', fontSize: tokens.fontSizes.md,
                  fontWeight: 700, cursor: 'pointer',
                  transition: `opacity ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                무료로 시작하기
              </button>
              <button
                onClick={() => onNavigate('explore')}
                style={{
                  background: 'none', color: D.body, border: `1px solid ${D.border}`, borderRadius: 9,
                  padding: '13px 28px', fontSize: tokens.fontSizes.md,
                  fontWeight: 600, cursor: 'pointer',
                  transition: `border-color ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
              >
                개발자 탐색 →
              </button>
            </div>
          </div>
        </div>

      </div>{/* end slider */}

      {/* ── Dot navigation ── */}
      <div style={{
        position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 50,
      }}>
        {Array.from({ length: TOTAL }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            title={['히어로', '기능', '시작하기'][i]}
            style={{
              width: 8, height: section === i ? 22 : 8,
              borderRadius: 999, border: 'none', padding: 0, cursor: 'pointer',
              background: section === i ? '#fff' : 'rgba(255,255,255,0.22)',
              transition: 'all 0.3s ease',
              display: 'block',
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ScrollHint: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
      background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      opacity: 0.45, transition: `opacity ${tokens.transitions.fast}`,
      animation: 'bob 2s ease-in-out infinite',
    }}
    onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
    onMouseLeave={e => (e.currentTarget.style.opacity = '0.45')}
  >
    <span style={{ fontSize: '10px', color: '#fff', fontWeight: 500, letterSpacing: '0.5px' }}>SCROLL</span>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
    <style>{`
      @keyframes bob {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(5px); }
      }
    `}</style>
  </button>
);

export default Landing;
