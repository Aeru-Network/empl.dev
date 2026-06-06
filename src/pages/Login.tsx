import React, { useState } from 'react';
import { tokens } from '../tokens';
import { GithubIcon } from '../components/Icons';

type Page =
  | 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage'
  | 'postDetail' | 'settings' | 'onboarding' | 'companies' | 'company' | 'companyManage';

interface LoginProps {
  onNavigate: (page: Page) => void;
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{
      minHeight: '100vh',
      background: tokens.colors.background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: tokens.colors.surface,
        borderRadius: tokens.borderRadius.xxl,
        border: `1px solid ${tokens.colors.border}`,
        boxShadow: tokens.shadows.xl,
        width: '100%',
        maxWidth: 400,
        padding: '36px 32px',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: tokens.borderRadius.lg,
            background: tokens.colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <span style={{ color: '#fff', fontWeight: tokens.fontWeights.extrabold, fontSize: '20px' }}>e</span>
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: 0, letterSpacing: '-0.5px' }}>
            empl<span style={{ color: tokens.colors.primary }}>.dev</span>
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted, marginTop: 6 }}>
            {mode === 'login' ? '계정에 로그인하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* Tab */}
        <div style={{
          display: 'flex',
          backgroundColor: tokens.colors.surfaceAlt,
          borderRadius: tokens.borderRadius.md,
          padding: '3px',
          marginBottom: 24,
        }}>
          {(['login', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '7px',
                border: 'none',
                borderRadius: '6px',
                fontSize: tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
                backgroundColor: mode === m ? tokens.colors.surface : 'transparent',
                color: mode === m ? tokens.colors.textPrimary : tokens.colors.textMuted,
                boxShadow: mode === m ? tokens.shadows.xs : 'none',
                transition: `all ${tokens.transitions.fast}`,
              }}
            >
              {m === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        {/* OAuth */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          <button
            onClick={onLogin}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '10px',
              background: tokens.colors.navy,
              color: '#fff',
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              fontSize: tokens.fontSizes.sm,
              fontWeight: tokens.fontWeights.semibold,
              cursor: 'pointer',
            }}
          >
            <GithubIcon size={18} color="#fff" />
            GitHub으로 계속하기
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: tokens.colors.border }} />
          <span style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>또는 이메일로</span>
          <div style={{ flex: 1, height: 1, background: tokens.colors.border }} />
        </div>

        {/* Email form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.medium, color: tokens.colors.textSecondary, display: 'block', marginBottom: 5 }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.dev"
              style={{
                width: '100%',
                padding: '9px 12px',
                border: `1.5px solid ${tokens.colors.border}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSizes.sm,
                color: tokens.colors.textPrimary,
                outline: 'none',
                boxSizing: 'border-box',
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onFocus={e => (e.target.style.borderColor = tokens.colors.primary)}
              onBlur={e => (e.target.style.borderColor = tokens.colors.border)}
            />
          </div>
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.medium, color: tokens.colors.textSecondary, display: 'block', marginBottom: 5 }}>
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '9px 12px',
                border: `1.5px solid ${tokens.colors.border}`,
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSizes.sm,
                color: tokens.colors.textPrimary,
                outline: 'none',
                boxSizing: 'border-box',
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onFocus={e => (e.target.style.borderColor = tokens.colors.primary)}
              onBlur={e => (e.target.style.borderColor = tokens.colors.border)}
            />
          </div>
          <button
            onClick={onLogin}
            style={{
              padding: '10px',
              background: tokens.colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: tokens.borderRadius.md,
              fontSize: tokens.fontSizes.sm,
              fontWeight: tokens.fontWeights.bold,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            {mode === 'login' ? '로그인' : '가입하기'}
          </button>
        </div>

        <button
          onClick={() => onNavigate('landing')}
          style={{
            display: 'block',
            width: '100%',
            marginTop: 20,
            background: 'none',
            border: 'none',
            fontSize: tokens.fontSizes.xs,
            color: tokens.colors.textMuted,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Login;
