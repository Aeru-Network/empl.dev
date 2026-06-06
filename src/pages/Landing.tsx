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

const StatBadge: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: '#fff', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>{label}</div>
  </div>
);

const FeatureCard: React.FC<{ icon: React.ReactNode; color: string; title: string; desc: string }> = ({ icon, color, title, desc }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, padding: '28px 24px',
        border: `1px solid ${hovered ? color : tokens.colors.border}`,
        boxShadow: hovered ? tokens.shadows.lg : tokens.shadows.card,
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: `all ${tokens.transitions.normal}`,
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: tokens.borderRadius.lg, backgroundColor: color + '18',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, marginBottom: 8 }}>{title}</div>
      <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: 0, lineHeight: 1.65 }}>{desc}</p>
    </div>
  );
};

const Landing: React.FC<LandingProps> = ({ onNavigate }) => {
  const [searchValue, setSearchValue] = useState('');

  const featuredProfiles = exploreProfiles.slice(0, 3);
  const featuredJobs = sampleJobs.filter(j => j.featured).slice(0, 2);

  return (
    <div style={{ background: tokens.colors.background }}>
      {/* Hero */}
      <div style={{
        background: tokens.colors.navyGrad,
        padding: '84px 20px 88px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative glows */}
        <div style={{ position: 'absolute', top: -120, left: '15%', width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -140, right: '10%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,86,219,0.35) 0%, transparent 70%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: tokens.borderRadius.full,
            padding: '5px 14px',
            marginBottom: 24,
          }}>
            <CodeIcon size={13} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.85)', fontWeight: tokens.fontWeights.medium }}>
              개발자를 위한 채용 플랫폼
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 46px)',
            fontWeight: tokens.fontWeights.extrabold,
            color: '#fff',
            margin: '0 0 16px',
            lineHeight: 1.15,
            letterSpacing: '-1px',
          }}>
            코드로 말하는<br />개발자 커리어 플랫폼
          </h1>
          <p style={{
            fontSize: tokens.fontSizes.md,
            color: 'rgba(255,255,255,0.7)',
            margin: '0 0 36px',
            lineHeight: 1.7,
          }}>
            GitHub 프로젝트, 기술 블로그, 오픈소스 기여로<br />
            당신의 역량을 증명하세요.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex',
            backgroundColor: '#fff',
            borderRadius: tokens.borderRadius.full,
            overflow: 'hidden',
            boxShadow: tokens.shadows.xl,
            maxWidth: 480,
            margin: '0 auto 40px',
          }}>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={18} color={tokens.colors.textMuted} />
            </div>
            <input
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="개발자 또는 기술 스택 검색..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: tokens.fontSizes.sm,
                color: tokens.colors.textPrimary,
                padding: '13px 0',
                background: 'transparent',
              }}
            />
            <button
              onClick={() => onNavigate('explore')}
              style={{
                backgroundColor: tokens.colors.primary,
                color: '#fff',
                border: 'none',
                padding: '0 22px',
                fontSize: tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              검색
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 60px)' }}>
            <StatBadge value="12,000+" label="개발자" />
            <StatBadge value="850+" label="채용 공고" />
            <StatBadge value="3,200+" label="오픈소스 프로젝트" />
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.bold, color: tokens.colors.primary, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 8 }}>
            FEATURES
          </div>
          <h2 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>
            왜 empl.dev인가요?
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px',
        }}>
          {[
            { icon: <CodeIcon size={22} color={tokens.colors.primary} />, color: tokens.colors.primary, title: '코드 포트폴리오', desc: 'GitHub 연동으로 프로젝트와 기여도를 자동으로 가져와 보여줍니다.' },
            { icon: <BriefcaseIcon size={22} color={tokens.colors.accent} />, color: tokens.colors.accent, title: '개발자 맞춤 채용', desc: '기술 스택 기반 매칭으로 딱 맞는 포지션을 추천받으세요.' },
            { icon: <UsersIcon size={22} color={tokens.colors.success} />, color: tokens.colors.success, title: '개발자 네트워크', desc: '같은 기술을 쓰는 개발자들과 연결하고 오픈소스로 협업하세요.' },
          ].map((f, i) => (
            <FeatureCard key={i} icon={f.icon} color={f.color} title={f.title} desc={f.desc} />
          ))}
        </div>
      </div>

      {/* Featured devs */}
      <div style={{ backgroundColor: tokens.colors.surfaceAlt, padding: '52px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>
              주목할 개발자
            </h2>
            <button
              onClick={() => onNavigate('explore')}
              style={{
                background: 'none',
                border: 'none',
                color: tokens.colors.primary,
                fontSize: tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
              }}
            >
              전체 보기 →
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '14px',
          }}>
            {featuredProfiles.map(p => (
              <div
                key={p.id}
                onClick={() => onNavigate('profile')}
                style={{
                  background: tokens.colors.surface,
                  borderRadius: tokens.borderRadius.xl,
                  padding: '20px',
                  border: `1px solid ${tokens.colors.border}`,
                  cursor: 'pointer',
                  boxShadow: tokens.shadows.card,
                  display: 'flex',
                  gap: 14,
                  transition: `box-shadow ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = tokens.shadows.md)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = tokens.shadows.card)}
              >
                <img src={p.avatar} alt={p.name} style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{p.name}</div>
                  <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary, margin: '3px 0 8px', lineHeight: 1.4 }}>{p.headline}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {p.skills.slice(0, 3).map(s => (
                      <span key={s} style={{ backgroundColor: tokens.colors.tag, color: tokens.colors.tagText, padding: '2px 7px', borderRadius: tokens.borderRadius.full, fontSize: '10px', fontWeight: tokens.fontWeights.medium }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured jobs */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '52px 20px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>
            추천 채용 공고
          </h2>
          <button
            onClick={() => onNavigate('jobs')}
            style={{
              background: 'none',
              border: 'none',
              color: tokens.colors.primary,
              fontSize: tokens.fontSizes.sm,
              fontWeight: tokens.fontWeights.semibold,
              cursor: 'pointer',
            }}
          >
            전체 보기 →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {featuredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => onNavigate('jobs')}
              style={{
                background: tokens.colors.surface,
                borderRadius: tokens.borderRadius.xl,
                padding: '20px 24px',
                border: `1.5px solid ${tokens.colors.border}`,
                cursor: 'pointer',
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = tokens.colors.primary)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = tokens.colors.border)}
            >
              <img src={job.logo} alt={job.company} style={{ width: 44, height: 44, borderRadius: tokens.borderRadius.md, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{job.title}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary, margin: '2px 0 8px' }}>{job.company} · {job.location}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {job.tags.map(t => <span key={t} style={{ backgroundColor: tokens.colors.tag, color: tokens.colors.tagText, padding: '2px 8px', borderRadius: tokens.borderRadius.full, fontSize: '10px', fontWeight: tokens.fontWeights.medium }}>{t}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{job.salary}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{job.posted}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: tokens.colors.navyGrad,
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
          지금 시작하세요
        </h2>
        <p style={{ fontSize: tokens.fontSizes.md, color: 'rgba(255,255,255,0.7)', margin: '0 0 28px' }}>
          무료로 프로필을 만들고 개발자 커뮤니티에 합류하세요.
        </p>
        <button
          onClick={() => onNavigate('login')}
          style={{
            backgroundColor: '#fff',
            color: tokens.colors.navy,
            border: 'none',
            borderRadius: tokens.borderRadius.full,
            padding: '12px 32px',
            fontSize: tokens.fontSizes.md,
            fontWeight: tokens.fontWeights.bold,
            cursor: 'pointer',
          }}
        >
          무료로 시작하기
        </button>
      </div>
    </div>
  );
};

export default Landing;
