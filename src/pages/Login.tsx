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

const D = {
  bg: '#000', card: '#0f0f0f', input: '#111',
  border: 'rgba(255,255,255,0.08)', inputBorder: 'rgba(255,255,255,0.10)',
  borderFocus: 'rgba(255,255,255,0.28)', heading: '#fff', body: '#a1a1aa', muted: '#52525b',
};

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: `1px solid ${D.inputBorder}`,
    borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.heading,
    outline: 'none', boxSizing: 'border-box', background: D.input,
    fontFamily: 'inherit', transition: `border-color ${tokens.transitions.fast}`,
  };

  return (
    <div style={{ minHeight: '100vh', background: D.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, width: '100%', maxWidth: 400, padding: '36px 32px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            empl<span style={{ color: '#52525b' }}>.dev</span>
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.muted, marginTop: 4 }}>
            {mode === 'login' ? '계정에 로그인하세요' : '새 계정을 만드세요'}
          </p>
        </div>

        {/* Tab */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '3px', marginBottom: 24, border: `1px solid ${D.border}` }}>
          {(['login', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1, padding: '7px', border: 'none', borderRadius: 6,
                fontSize: tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer',
                background: mode === m ? '#1a1a1a' : 'transparent',
                color: mode === m ? D.heading : D.muted,
                transition: `all ${tokens.transitions.fast}`,
              }}
            >
              {m === 'login' ? '로그인' : '회원가입'}
            </button>
          ))}
        </div>

        {/* GitHub OAuth */}
        <button
          onClick={onLogin}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '11px', background: '#fff', color: '#000',
            border: 'none', borderRadius: 8, fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: 'pointer', marginBottom: 20,
          }}
        >
          <GithubIcon size={18} color="#000" />
          GitHub으로 계속하기
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: D.border }} />
          <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}>또는 이메일로</span>
          <div style={{ flex: 1, height: 1, background: D.border }} />
        </div>

        {/* Email form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, display: 'block', marginBottom: 5 }}>이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.dev" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = D.borderFocus)} onBlur={e => (e.target.style.borderColor = D.inputBorder)} />
          </div>
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, display: 'block', marginBottom: 5 }}>비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle}
              onFocus={e => (e.target.style.borderColor = D.borderFocus)} onBlur={e => (e.target.style.borderColor = D.inputBorder)} />
          </div>
          <button
            onClick={onLogin}
            style={{ padding: '11px', background: '#fff', color: '#000', border: 'none', borderRadius: 8, fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
          >
            {mode === 'login' ? '로그인' : '가입하기'}
          </button>
        </div>

        <button
          onClick={() => onNavigate('landing')}
          style={{ display: 'block', width: '100%', marginTop: 20, background: 'none', border: 'none', fontSize: tokens.fontSizes.xs, color: D.muted, cursor: 'pointer', textAlign: 'center' }}
        >
          메인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Login;
