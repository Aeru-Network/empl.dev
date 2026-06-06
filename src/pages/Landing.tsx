import React, { useState } from 'react';
import { tokens } from '../tokens';
import { SearchIcon, CodeIcon, BriefcaseIcon, UsersIcon } from '../components/Icons';
import { exploreProfiles, sampleJobs } from '../data/defaultData';

type Page =
  | 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage'
  | 'postDetail' | 'settings' | 'onboarding' | 'companies' | 'company' | 'companyManage';

interface LandingProps {
  onNavigate: (page: Page) => void;
}

const D = {
  bg: '#000000',
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

const StatBadge: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: D.heading, lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
    <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 6, fontWeight: 500 }}>{label}</div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; accentDim: string; title: string; desc: string }> = ({ icon, accentDim, title, desc }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? D.cardHover : D.card,
        borderRadius: 12,
        padding: '28px 24px',
        border: `1px solid ${hovered ? D.borderHover : D.border}`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: `all ${tokens.transitions.normal}`,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10, backgroundColor: accentDim,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0, lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const [searchValue, setSearchValue] = useState('');

  const featuredProfiles = exploreProfiles.slice(0, 3);
  const featuredJobs = sampleJobs.filter(j => j.featured).slice(0, 2);

  return (
    <div style={{ background: D.bg }}>
      {/* Hero */}
      <div style={{
        padding: 'clamp(72px, 10vw, 120px) 20px clamp(72px, 10vw, 120px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderBottom: `1px solid ${D.border}`,
      }}>
        {/* subtle grid texture */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* glow */}
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse, rgba(0,112,243,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${D.border}`,
            borderRadius: 999, padding: '5px 14px', marginBottom: 28,
          }}>
            <CodeIcon size={12} color={D.accent} />
            <span style={{ fontSize: 11, color: D.body, fontWeight: 500, letterSpacing: '0.3px' }}>
              개발자를 위한 채용 플랫폼
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 7vw, 72px)',
            fontWeight: 800,
            color: D.heading,
            margin: '0 0 20px',
            lineHeight: 1.05,
            letterSpacing: '-2.5px',
          }}>
            코드로 말하는<br />개발자 커리어
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            color: D.body,
            margin: '0 0 44px',
            lineHeight: 1.65,
            maxWidth: 480,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            GitHub 프로젝트, 기술 블로그, 오픈소스 기여로<br />
            당신의 역량을 증명하세요.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            background: '#111',
            borderRadius: 8,
            border: `1px solid ${D.border}`,
            overflow: 'hidden',
            maxWidth: 500,
            margin: '0 auto 52px',
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
                padding: '14px 0', background: 'transparent',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => onNavigate('explore')}
              style={{
                background: '#fff', color: '#000', border: 'none',
                padding: '0 20px', fontSize: tokens.fontSizes.sm,
                fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              검색
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(32px, 7vw, 80px)' }}>
            <StatBadge value="12,000+" label="개발자" />
            <div style={{ width: 1, background: D.border }} />
            <StatBadge value="850+" label="채용 공고" />
            <div style={{ width: 1, background: D.border }} />
            <StatBadge value="3,200+" label="오픈소스" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(60px, 8vw, 96px) 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: D.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>
            FEATURES
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: D.heading, margin: 0, letterSpacing: '-1px' }}>
            왜 empl.dev인가요?
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <FeatureCard icon={<CodeIcon size={22} color={D.accent} />} accentDim={D.accentDim} title="코드 포트폴리오" desc="GitHub 연동으로 프로젝트와 기여도를 자동으로 가져와 보여줍니다." />
          <FeatureCard icon={<BriefcaseIcon size={22} color={D.orange} />} accentDim={D.orangeDim} title="개발자 맞춤 채용" desc="기술 스택 기반 매칭으로 딱 맞는 포지션을 추천받으세요." />
          <FeatureCard icon={<UsersIcon size={22} color={D.success} />} accentDim={D.successDim} title="개발자 네트워크" desc="같은 기술을 쓰는 개발자들과 연결하고 오픈소스로 협업하세요." />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: D.border }} />

      {/* Featured devs */}
      <div style={{ background: '#050505', padding: 'clamp(48px, 7vw, 80px) 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, color: D.heading, margin: 0, letterSpacing: '-0.5px' }}>
              주목할 개발자
            </h2>
            <button
              onClick={() => onNavigate('explore')}
              style={{ background: 'none', border: 'none', color: D.body, fontSize: tokens.fontSizes.sm, fontWeight: 500, cursor: 'pointer' }}
            >
              전체 보기 →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {featuredProfiles.map(p => (
              <div
                key={p.id}
                onClick={() => onNavigate('profile')}
                style={{
                  background: D.card, borderRadius: 10, padding: '18px 20px',
                  border: `1px solid ${D.border}`, cursor: 'pointer',
                  display: 'flex', gap: 14, transition: `border-color ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
              >
                <img src={p.avatar} alt={p.name} style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{p.name}</div>
                  <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '4px 0 10px', lineHeight: 1.4 }}>{p.headline}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {p.skills.slice(0, 3).map(s => (
                      <span key={s} style={{ background: D.tag, color: D.tagText, padding: '2px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: D.border }} />

      {/* Featured jobs */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(48px, 7vw, 80px) 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 700, color: D.heading, margin: 0, letterSpacing: '-0.5px' }}>
            추천 채용 공고
          </h2>
          <button
            onClick={() => onNavigate('jobs')}
            style={{ background: 'none', border: 'none', color: D.body, fontSize: tokens.fontSizes.sm, fontWeight: 500, cursor: 'pointer' }}
          >
            전체 보기 →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {featuredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => onNavigate('jobs')}
              style={{
                background: D.card, borderRadius: 10, padding: '20px 24px',
                border: `1px solid ${D.border}`, cursor: 'pointer',
                display: 'flex', gap: 16, alignItems: 'center',
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
            >
              <img src={job.logo} alt={job.company} style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{job.title}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '3px 0 10px' }}>{job.company} · {job.location}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {job.tags.map(t => <span key={t} style={{ background: D.tag, color: D.tagText, padding: '2px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{t}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{job.salary}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 3 }}>{job.posted}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ borderTop: `1px solid ${D.border}`, background: '#050505', padding: 'clamp(60px, 9vw, 100px) 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 48px)', fontWeight: 800, color: D.heading, margin: '0 0 14px', letterSpacing: '-1.5px' }}>
          지금 시작하세요
        </h2>
        <p style={{ fontSize: tokens.fontSizes.md, color: D.body, margin: '0 0 36px' }}>
          무료로 프로필을 만들고 개발자 커뮤니티에 합류하세요.
        </p>
        <button
          onClick={() => onNavigate('login')}
          style={{
            background: '#fff', color: '#000', border: 'none', borderRadius: 8,
            padding: '12px 28px', fontSize: tokens.fontSizes.md,
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          무료로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Landing;
