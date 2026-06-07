import React, { useState, useRef, useEffect } from 'react';
import { tokens } from '../tokens';
import { ChevronDownIcon, UserIcon, SettingsIcon, LogOutIcon, HomeIcon, BriefcaseIcon, MessageIcon, SearchIcon, BuildingIcon } from './Icons';
import type { ProfileData } from '../data/defaultData';

type Page =
  | 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage'
  | 'postDetail' | 'postEditor' | 'settings' | 'onboarding' | 'companies' | 'company' | 'companyManage'
  | 'messages';

interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn?: boolean;
  profile?: ProfileData | null;
  onLogout?: () => void;
}

const D = {
  bg: 'rgba(0,0,0,0.85)',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.2)',
  heading: '#ffffff',
  body: '#a1a1aa',
  muted: '#52525b',
  activeText: '#ffffff',
  activeBg: 'rgba(255,255,255,0.08)',
  hoverBg: 'rgba(255,255,255,0.05)',
  dropdownBg: '#111111',
  dropdownBorder: 'rgba(255,255,255,0.1)',
  dropdownDivider: 'rgba(255,255,255,0.06)',
  dropdownHover: 'rgba(255,255,255,0.05)',
};

export const MOBILE_NAV_H = 60;
export const DESKTOP_NAV_H = 56;

const Logo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
    <span style={{ fontWeight: 800, fontSize: tokens.fontSizes.md, color: '#ffffff', letterSpacing: '-0.5px' }}>
      empl<span style={{ color: '#3D7BFF' }}>.dev</span>
    </span>
  </button>
);

const Avatar: React.FC<{ profile?: ProfileData | null; size: number }> = ({ profile, size }) => {
  const initial = profile?.name?.trim()?.[0] ?? '';
  if (profile?.avatar) {
    return <img src={profile.avatar} alt="avatar" style={{ width: size, height: size, borderRadius: '50%', display: 'block' }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'rgba(255,255,255,0.1)', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 700,
    }}>
      {initial || <UserIcon size={size * 0.5} color="#fff" />}
    </div>
  );
};

const Nav: React.FC<NavProps> = ({ currentPage, onNavigate, isLoggedIn = true, profile, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Mobile: bottom tab bar only ── */
  if (isMobile) {
    type Tab = { label: string; page: Page; icon: (active: boolean) => React.ReactNode };
    const tabs: Tab[] = [
      { label: '탐색', page: 'explore', icon: (a) => <SearchIcon size={22} color={a ? '#fff' : '#52525b'} /> },
      { label: '채용', page: 'jobs', icon: (a) => <BriefcaseIcon size={22} color={a ? '#fff' : '#52525b'} /> },
      { label: '회사', page: 'companies', icon: (a) => <BuildingIcon size={22} color={a ? '#fff' : '#52525b'} /> },
      ...(isLoggedIn ? [{ label: '메시지', page: 'messages' as Page, icon: (a: boolean) => <MessageIcon size={22} color={a ? '#fff' : '#52525b'} /> }] : []),
    ];

    const profileActive = ['mypage', 'profile', 'settings', 'postDetail', 'postEditor', 'onboarding'].includes(currentPage);

    return (
      <>
        {/* 0-height spacer so App layout doesn't shift */}
        <div style={{ height: 0 }} />
        {/* Fixed bottom bar */}
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
          height: MOBILE_NAV_H,
          background: '#000',
          borderTop: `1px solid ${D.border}`,
          display: 'flex', alignItems: 'stretch',
        }}>
          {tabs.map(tab => {
            const active = currentPage === tab.page;
            return (
              <button
                key={tab.label}
                onClick={() => onNavigate(tab.page)}
                style={{
                  flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 4, background: 'none', border: 'none',
                  cursor: 'pointer', padding: '6px 4px',
                  color: active ? '#fff' : '#52525b', fontFamily: 'inherit',
                }}
              >
                {tab.icon(active)}
                <span style={{ fontSize: 9, fontWeight: active ? 700 : 400, letterSpacing: '0.1px' }}>{tab.label}</span>
              </button>
            );
          })}

          {/* Profile / Login tab */}
          {isLoggedIn ? (
            <button
              onClick={() => onNavigate('mypage')}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 4, background: 'none', border: 'none',
                cursor: 'pointer', padding: '6px 4px', fontFamily: 'inherit',
                color: profileActive ? '#fff' : '#52525b',
              }}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', border: profileActive ? '1.5px solid #fff' : '1.5px solid #52525b' }}>
                <Avatar profile={profile} size={24} />
              </div>
              <span style={{ fontSize: 9, fontWeight: profileActive ? 700 : 400 }}>마이</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 4, background: 'none', border: 'none',
                cursor: 'pointer', padding: '6px 4px', fontFamily: 'inherit',
                color: currentPage === 'login' ? '#fff' : '#52525b',
              }}
            >
              <UserIcon size={22} color={currentPage === 'login' ? '#fff' : '#52525b'} />
              <span style={{ fontSize: 9 }}>로그인</span>
            </button>
          )}
        </nav>
      </>
    );
  }

  /* ── Desktop: sticky top nav ── */
  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    background: active ? D.activeBg : 'transparent',
    border: 'none', cursor: 'pointer',
    fontSize: tokens.fontSizes.sm,
    fontWeight: active ? 600 : 400,
    color: active ? D.activeText : D.body,
    padding: '6px 12px', borderRadius: 7,
    transition: `all ${tokens.transitions.fast}`, whiteSpace: 'nowrap',
  });

  const centerLinks: { label: string; page: Page; icon?: React.ReactNode }[] = [
    { label: '탐색', page: 'explore' },
    { label: '채용공고', page: 'jobs' },
    { label: '회사', page: 'companies' },
    ...(isLoggedIn ? [{ label: '메시지', page: 'messages' as Page, icon: <MessageIcon size={14} color="currentColor" /> }] : []),
  ];

  const dropdownItems: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: '마이페이지', page: 'mypage', icon: <HomeIcon size={15} /> },
    { label: '프로필', page: 'profile', icon: <UserIcon size={15} /> },
    { label: '회사 관리', page: 'companies', icon: <BriefcaseIcon size={15} /> },
    { label: '설정', page: 'settings', icon: <SettingsIcon size={15} /> },
  ];

  const displayName = profile?.name?.trim() || '게스트';
  const displayEmail = 'arriha96@gmail.com';

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: tokens.zIndex.nav,
      background: '#000',
      borderBottom: `1px solid ${D.border}`, height: DESKTOP_NAV_H,
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%', padding: '0 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo onClick={() => onNavigate('landing')} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {centerLinks.map(link => {
            const active = currentPage === link.page;
            return (
              <button
                key={link.page}
                style={{ ...navLinkStyle(active), display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={() => onNavigate(link.page)}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = D.hoverBg; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
              >
                {link.icon}
                {link.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isLoggedIn ? (
            <button
              onClick={() => onNavigate('login')}
              style={{
                background: '#fff', color: '#000', border: 'none',
                borderRadius: 7, padding: '7px 16px',
                fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: 'pointer',
              }}
            >
              로그인
            </button>
          ) : (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', background: 'none',
                  border: `1px solid ${D.border}`, borderRadius: 999,
                  padding: '3px 10px 3px 3px', cursor: 'pointer',
                  transition: `border-color ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
              >
                <Avatar profile={profile} size={28} />
                <ChevronDownIcon size={13} color={D.body} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: D.dropdownBg, border: `1px solid ${D.dropdownBorder}`,
                  borderRadius: 10, boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                  minWidth: 190, overflow: 'hidden', zIndex: tokens.zIndex.dropdown,
                }}>
                  <div style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${D.dropdownDivider}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar profile={profile} size={34} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{displayName}</div>
                      <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayEmail}</div>
                    </div>
                  </div>
                  {dropdownItems.map(item => (
                    <button
                      key={item.page + item.label}
                      onClick={() => { onNavigate(item.page); setDropdownOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '9px', width: '100%',
                        background: 'none', border: 'none', padding: '9px 14px', cursor: 'pointer',
                        fontSize: tokens.fontSizes.sm, color: D.body,
                        textAlign: 'left', transition: `background ${tokens.transitions.fast}`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = D.dropdownHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${D.dropdownDivider}` }}>
                    <button
                      onClick={() => { setDropdownOpen(false); onLogout?.(); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '9px', width: '100%',
                        background: 'none', border: 'none', padding: '9px 14px', cursor: 'pointer',
                        fontSize: tokens.fontSizes.sm, color: '#f87171',
                        textAlign: 'left', transition: `background ${tokens.transitions.fast}`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOutIcon size={15} color="#f87171" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
