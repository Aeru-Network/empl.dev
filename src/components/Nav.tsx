import React, { useState, useRef, useEffect } from 'react';
import { tokens } from '../tokens';
import { ChevronDownIcon, UserIcon, SettingsIcon, LogOutIcon, HomeIcon } from './Icons';

type Page = 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage' | 'postDetail' | 'settings';

interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn?: boolean;
}

const Logo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: 0,
    }}
  >
    <div style={{
      width: 30,
      height: 30,
      borderRadius: tokens.borderRadius.md,
      background: tokens.colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <span style={{ color: '#fff', fontWeight: tokens.fontWeights.bold, fontSize: '14px', letterSpacing: '-0.5px' }}>e</span>
    </div>
    <span style={{
      fontWeight: tokens.fontWeights.extrabold,
      fontSize: tokens.fontSizes.md,
      color: tokens.colors.textPrimary,
      letterSpacing: '-0.5px',
    }}>
      empl<span style={{ color: tokens.colors.primary }}>.dev</span>
    </span>
  </button>
);

const Nav: React.FC<NavProps> = ({ currentPage, onNavigate, isLoggedIn = true }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
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

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: tokens.fontSizes.sm,
    fontWeight: active ? tokens.fontWeights.semibold : tokens.fontWeights.medium,
    color: active ? tokens.colors.primary : tokens.colors.textSecondary,
    padding: '6px 12px',
    borderRadius: tokens.borderRadius.md,
    backgroundColor: active ? tokens.colors.primaryLight : 'transparent',
    transition: `all ${tokens.transitions.fast}`,
    whiteSpace: 'nowrap' as const,
  });

  const dropdownItems: { label: string; page: Page; icon: React.ReactNode }[] = [
    { label: '마이페이지', page: 'mypage', icon: <HomeIcon size={15} /> },
    { label: '프로필', page: 'profile', icon: <UserIcon size={15} /> },
    { label: '설정', page: 'settings', icon: <SettingsIcon size={15} /> },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: tokens.zIndex.nav,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${tokens.colors.border}`,
      height: 56,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        maxWidth: 1100,
        margin: '0 auto',
        width: '100%',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Logo onClick={() => onNavigate('landing')} />

        {/* Center links — hidden on mobile */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              style={navLinkStyle(currentPage === 'explore')}
              onClick={() => onNavigate('explore')}
              onMouseEnter={e => { if (currentPage !== 'explore') (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.surfaceAlt; }}
              onMouseLeave={e => { if (currentPage !== 'explore') (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              탐색
            </button>
            <button
              style={navLinkStyle(currentPage === 'jobs')}
              onClick={() => onNavigate('jobs')}
              onMouseEnter={e => { if (currentPage !== 'jobs') (e.target as HTMLButtonElement).style.backgroundColor = tokens.colors.surfaceAlt; }}
              onMouseLeave={e => { if (currentPage !== 'jobs') (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
            >
              채용공고
            </button>
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isLoggedIn ? (
            <button
              onClick={() => onNavigate('login')}
              style={{
                backgroundColor: tokens.colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                padding: '7px 16px',
                fontSize: tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
              }}
            >
              로그인
            </button>
          ) : (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.borderRadius.full,
                  padding: '3px 10px 3px 3px',
                  cursor: 'pointer',
                  transition: `border-color ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = tokens.colors.primary)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = tokens.colors.border)}
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=minjun&backgroundColor=b6e3f4"
                  alt="avatar"
                  style={{ width: 28, height: 28, borderRadius: '50%', display: 'block' }}
                />
                <ChevronDownIcon size={13} color={tokens.colors.textSecondary} />
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: tokens.colors.surface,
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.borderRadius.lg,
                  boxShadow: tokens.shadows.lg,
                  minWidth: 160,
                  overflow: 'hidden',
                  zIndex: tokens.zIndex.dropdown,
                }}>
                  <div style={{ padding: '12px 14px 8px', borderBottom: `1px solid ${tokens.colors.borderLight}` }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>김민준</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>minjun@example.dev</div>
                  </div>
                  {dropdownItems.map(item => (
                    <button
                      key={item.page}
                      onClick={() => { onNavigate(item.page); setDropdownOpen(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '9px 14px',
                        cursor: 'pointer',
                        fontSize: tokens.fontSizes.sm,
                        color: tokens.colors.textSecondary,
                        textAlign: 'left',
                        transition: `background ${tokens.transitions.fast}`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = tokens.colors.surfaceAlt)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: `1px solid ${tokens.colors.borderLight}` }}>
                    <button
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        padding: '9px 14px',
                        cursor: 'pointer',
                        fontSize: tokens.fontSizes.sm,
                        color: tokens.colors.error,
                        textAlign: 'left',
                        transition: `background ${tokens.transitions.fast}`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fff1f2')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      <LogOutIcon size={15} color={tokens.colors.error} />
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
