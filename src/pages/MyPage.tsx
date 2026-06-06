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

const D = {
  bg: '#000', card: '#0f0f0f', section: '#0a0a0a',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.18)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
};

const Avatar: React.FC<{ profile: ProfileData; size: number }> = ({ profile, size }) => {
  if (profile.avatar) return <img src={profile.avatar} alt={profile.name} style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg, #1a56db 0%, #6366f1 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      color: '#fff', fontSize: size * 0.4, fontWeight: 700,
    }}>
      {profile.name.trim()[0]}
    </div>
  );
};

const MyPage: React.FC<MyPageProps> = ({ profile, companies, onNavigate, onInitialize, onOpenCompany, onManageCompanies }) => {
  if (!profile || !profile.name.trim()) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: D.accentDim, border: `1px solid rgba(0,112,243,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <SparklesIcon size={26} color={D.accent} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, margin: '0 0 10px', letterSpacing: '-0.4px' }}>환영합니다</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 24px', lineHeight: 1.65 }}>
            프로필을 설정하면 마이페이지에서 내 활동을<br />한눈에 관리할 수 있어요.
          </p>
          <button onClick={onInitialize} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: 9, fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: 'pointer' }}>
            <SparklesIcon size={17} color="#000" /> 프로필 시작하기
          </button>
        </div>
      </div>
    );
  }

  const myCompanies = companies.filter(c => c.isManaged);

  const quickActions = [
    { label: '내 프로필', desc: '프로필 보기 및 편집', icon: <UserIcon size={20} color="#5b9cf6" />, color: '#0070f3', onClick: () => onNavigate('profile') },
    { label: '회사 관리', desc: '기업 페이지 관리', icon: <BuildingIcon size={20} color="#a78bfa" />, color: '#7c3aed', onClick: onManageCompanies },
    { label: '채용 둘러보기', desc: '맞춤 포지션 탐색', icon: <BriefcaseIcon size={20} color="#34d399" />, color: '#10b981', onClick: () => onNavigate('jobs') },
    { label: '설정', desc: '계정 및 프로필 설정', icon: <SettingsIcon size={20} color={D.body} />, color: '#52525b', onClick: () => onNavigate('settings') },
  ];

  return (
    <div style={{ background: D.bg, minHeight: '100vh', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Greeting header */}
        <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '22px 24px', marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar profile={profile} size={58} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              안녕하세요, {profile.name}님
            </h1>
            <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile.headline || '오늘도 좋은 하루 되세요!'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'rgba(255,255,255,0.06)', color: D.body, border: `1px solid ${D.border}`, borderRadius: 8, fontSize: tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer' }}
          >
            <PencilIcon size={13} color={D.body} /> 편집
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginBottom: 16 }}>
          {quickActions.map(a => (
            <button
              key={a.label}
              onClick={a.onClick}
              style={{
                background: D.card, borderRadius: 10, border: `1px solid ${D.border}`,
                padding: '18px', cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 12, transition: `border-color ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
            >
              <div style={{ width: 40, height: 40, borderRadius: 9, background: a.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{a.label}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{a.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* My companies */}
        <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '20px 22px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: 0 }}>내 회사 페이지</h2>
            <button onClick={onManageCompanies} style={{ background: 'none', border: 'none', color: '#5b9cf6', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <PlusIcon size={12} color="#5b9cf6" /> 관리
            </button>
          </div>
          {myCompanies.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myCompanies.map(c => (
                <button
                  key={c.id}
                  onClick={() => onOpenCompany(c.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', borderRadius: 8, border: `1px solid ${D.border}`, background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', transition: `border-color ${tokens.transitions.fast}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: c.logoGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{c.name}</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{c.openings.length}개 채용중 · {c.followers.toLocaleString()} 팔로워</div>
                  </div>
                  <ChevronDownIcon size={13} color={D.muted} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, padding: '16px', textAlign: 'center', border: `1px dashed ${D.border}`, borderRadius: 8 }}>
              관리하는 회사 페이지가 없어요. <button onClick={onManageCompanies} style={{ background: 'none', border: 'none', color: '#5b9cf6', cursor: 'pointer', fontWeight: 600, fontSize: tokens.fontSizes.sm }}>만들기</button>
            </div>
          )}
        </div>

        {/* My content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
          <ContentList
            title="내 포스트"
            icon={<HomeIcon size={14} color={D.body} />}
            items={profile.posts.map(p => ({ id: p.id, title: p.title, sub: p.date }))}
            emptyText="작성한 포스트가 없어요."
            onAll={() => onNavigate('profile')}
          />
          <ContentList
            title="내 프로젝트"
            icon={<CodeIcon size={14} color={D.body} />}
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
  <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '18px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {icon}
        <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading, margin: 0 }}>{title}</h2>
      </div>
      {items.length > 0 && (
        <button onClick={onAll} style={{ background: 'none', border: 'none', color: '#5b9cf6', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>전체</button>
      )}
    </div>
    {items.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.slice(0, 3).map(item => (
          <div key={item.id} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${D.border}`, background: '#0a0a0a' }}>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 500, color: D.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, padding: '14px', textAlign: 'center', border: `1px dashed ${D.border}`, borderRadius: 8 }}>
        {emptyText}
      </div>
    )}
  </div>
);

export default MyPage;
