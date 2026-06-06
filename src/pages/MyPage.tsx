import React from 'react';
import { tokens } from '../tokens';
import type { ProfileData, Company } from '../data/defaultData';
import {
  UserIcon, BuildingIcon, BriefcaseIcon, SettingsIcon, PencilIcon,
  SparklesIcon, PlusIcon, ChevronDownIcon, CodeIcon, HomeIcon,
} from '../components/Icons';

type Page =
  | 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage'
  | 'postDetail' | 'settings' | 'onboarding' | 'companies' | 'company' | 'companyManage';

interface MyPageProps {
  profile: ProfileData | null;
  companies: Company[];
  onNavigate: (page: Page) => void;
  onInitialize: () => void;
  onOpenCompany: (id: string) => void;
  onManageCompanies: () => void;
}

const Avatar: React.FC<{ profile: ProfileData; size: number }> = ({ profile, size }) => {
  if (profile.avatar) return <img src={profile.avatar} alt={profile.name} style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0 }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: tokens.colors.navyGrad,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      color: '#fff', fontSize: size * 0.4, fontWeight: tokens.fontWeights.bold,
    }}>
      {profile.name.trim()[0]}
    </div>
  );
};

const MyPage: React.FC<MyPageProps> = ({ profile, companies, onNavigate, onInitialize, onOpenCompany, onManageCompanies }) => {
  /* ── Empty state ── */
  if (!profile || !profile.name.trim()) {
    return (
      <div style={{ background: tokens.colors.background, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '64px 20px' }}>
        <div style={{
          background: tokens.colors.surface, borderRadius: tokens.borderRadius.xxl, border: `1px solid ${tokens.colors.border}`,
          boxShadow: tokens.shadows.card, maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center',
        }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: tokens.colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <SparklesIcon size={28} color={tokens.colors.primary} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 10px', letterSpacing: '-0.4px' }}>
            환영합니다 👋
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: '0 0 24px', lineHeight: 1.65 }}>
            프로필을 설정하면 마이페이지에서 내 활동을<br />한눈에 관리할 수 있어요.
          </p>
          <button
            onClick={onInitialize}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: tokens.colors.primary, color: '#fff', border: 'none', borderRadius: tokens.borderRadius.lg, fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, cursor: 'pointer' }}
          >
            <SparklesIcon size={17} color="#fff" /> 프로필 시작하기
          </button>
        </div>
      </div>
    );
  }

  const myCompanies = companies.filter(c => c.isManaged);

  const quickActions: { label: string; desc: string; icon: React.ReactNode; color: string; onClick: () => void }[] = [
    { label: '내 프로필', desc: '프로필 보기 및 편집', icon: <UserIcon size={20} color={tokens.colors.primary} />, color: tokens.colors.primary, onClick: () => onNavigate('profile') },
    { label: '회사 관리', desc: '기업 페이지 관리', icon: <BuildingIcon size={20} color={tokens.colors.accent} />, color: tokens.colors.accent, onClick: onManageCompanies },
    { label: '채용 둘러보기', desc: '맞춤 포지션 탐색', icon: <BriefcaseIcon size={20} color={tokens.colors.success} />, color: tokens.colors.success, onClick: () => onNavigate('jobs') },
    { label: '설정', desc: '계정 및 프로필 설정', icon: <SettingsIcon size={20} color={tokens.colors.textSecondary} />, color: tokens.colors.textSecondary, onClick: () => onNavigate('settings') },
  ];

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Greeting header */}
        <div style={{
          background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`,
          padding: '24px', marginBottom: 20, boxShadow: tokens.shadows.card, display: 'flex', gap: 16, alignItems: 'center',
        }}>
          <Avatar profile={profile} size={60} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              안녕하세요, {profile.name}님
            </h1>
            <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.headline || '오늘도 좋은 하루 되세요!'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: tokens.colors.primaryLight, color: tokens.colors.primary, border: 'none', borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer' }}
          >
            <PencilIcon size={13} color={tokens.colors.primary} /> 프로필 편집
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={a.onClick}
              style={{
                background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`,
                padding: '18px', boxShadow: tokens.shadows.card, cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 12, transition: `all ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = tokens.shadows.md; e.currentTarget.style.borderColor = a.color; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = tokens.shadows.card; e.currentTarget.style.borderColor = tokens.colors.border; }}
            >
              <div style={{ width: 42, height: 42, borderRadius: tokens.borderRadius.lg, backgroundColor: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{a.label}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* My companies */}
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '22px 24px', marginBottom: 16, boxShadow: tokens.shadows.card }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>내 회사 페이지</h2>
            <button onClick={onManageCompanies} style={{ background: 'none', border: 'none', color: tokens.colors.primary, fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <PlusIcon size={13} color={tokens.colors.primary} /> 관리
            </button>
          </div>
          {myCompanies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {myCompanies.map(c => (
                <button
                  key={c.id}
                  onClick={() => onOpenCompany(c.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: tokens.borderRadius.lg, border: `1px solid ${tokens.colors.borderLight}`, background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: tokens.borderRadius.md, background: c.logoGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: tokens.fontWeights.bold, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{c.name}</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{c.openings.length}개 채용중 · {c.followers.toLocaleString()} 팔로워</div>
                  </div>
                  <ChevronDownIcon size={14} color={tokens.colors.textMuted} style={{ transform: 'rotate(-90deg)' }} />
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted, padding: '14px', textAlign: 'center', border: `1px dashed ${tokens.colors.border}`, borderRadius: tokens.borderRadius.lg, background: tokens.colors.surfaceAlt }}>
              관리하는 회사 페이지가 없어요. <button onClick={onManageCompanies} style={{ background: 'none', border: 'none', color: tokens.colors.primary, cursor: 'pointer', fontWeight: tokens.fontWeights.semibold, fontSize: tokens.fontSizes.sm }}>만들기</button>
            </div>
          )}
        </div>

        {/* My content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <ContentList
            title="내 포스트"
            icon={<HomeIcon size={15} color={tokens.colors.textSecondary} />}
            items={profile.posts.map(p => ({ id: p.id, title: p.title, sub: p.date }))}
            emptyText="작성한 포스트가 없어요."
            onAll={() => onNavigate('profile')}
          />
          <ContentList
            title="내 프로젝트"
            icon={<CodeIcon size={15} color={tokens.colors.textSecondary} />}
            items={profile.projects.map(p => ({ id: p.id, title: p.title, sub: p.techStack.slice(0, 2).join(' · ') }))}
            emptyText="등록한 프로젝트가 없어요."
            onAll={() => onNavigate('profile')}
          />
        </div>
      </div>
    </div>
  );
};

const ContentList: React.FC<{
  title: string; icon: React.ReactNode;
  items: { id: string; title: string; sub: string }[];
  emptyText: string; onAll: () => void;
}> = ({ title, icon, items, emptyText, onAll }) => (
  <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '20px 22px', boxShadow: tokens.shadows.card }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {icon}
        <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>{title}</h2>
      </div>
      {items.length > 0 && (
        <button onClick={onAll} style={{ background: 'none', border: 'none', color: tokens.colors.primary, fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer' }}>전체</button>
      )}
    </div>
    {items.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.slice(0, 3).map(item => (
          <div key={item.id} style={{ padding: '10px 12px', borderRadius: tokens.borderRadius.md, border: `1px solid ${tokens.colors.borderLight}` }}>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.medium, color: tokens.colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, padding: '12px', textAlign: 'center', border: `1px dashed ${tokens.colors.border}`, borderRadius: tokens.borderRadius.md, background: tokens.colors.surfaceAlt }}>
        {emptyText}
      </div>
    )}
  </div>
);

export default MyPage;
