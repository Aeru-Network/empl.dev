import React, { useState } from 'react';
import { tokens } from '../tokens';

type Page =
  | 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage'
  | 'postDetail' | 'settings' | 'onboarding' | 'companies' | 'company' | 'companyManage';

interface LoginProps {
  onNavigate: (page: Page) => void;
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      {/* Wordmark */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <span style={{ fontWeight: 800, fontSize: 26, color: '#ffffff', letterSpacing: '-1px' }}>
          empl<span style={{ color: '#a1a1aa', fontWeight: 700 }}>.dev</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        background: '#0D0D14', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18, padding: '32px 32px 28px', width: '100%', maxWidth: 380,
        animation: 'fadeUp 0.35s ease both',
      }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
            계정 로그인
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.55 }}>
            AERU SSO 계정으로 계속합니다
          </p>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 28 }} />

        <button
          onClick={handleSSO}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '14px', borderRadius: 12,
            background: loading ? 'rgba(61,123,255,0.7)' : '#3D7BFF',
            color: '#fff', border: 'none', fontFamily: 'inherit',
            fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: loading ? 'default' : 'pointer',
            boxShadow: '0 8px 28px -10px rgba(61,123,255,0.65)',
            transition: 'all 0.18s ease',
            letterSpacing: '0.1px',
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#5089FF'; }}
          onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#3D7BFF'; }}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              인증 중...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C4.41 1.5 1.5 4.41 1.5 8s2.91 6.5 6.5 6.5S14.5 11.59 14.5 8 11.59 1.5 8 1.5z" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                <path d="M5.5 8h5M8 5.5v5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              AERU SSO로 계속하기
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 20, lineHeight: 1.6 }}>
          계속하면 AERU{' '}
          <button
            onClick={() => {}}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.22)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}
          >
            이용약관
          </button>
          {' '}및{' '}
          <button
            onClick={() => {}}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.22)', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', padding: 0 }}
          >
            개인정보처리방침
          </button>
          에 동의하는 것으로 간주됩니다
        </p>
      </div>

      <button
        onClick={() => onNavigate('landing')}
        style={{ marginTop: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
      >
        ← 메인으로 돌아가기
      </button>

      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: 11, marginTop: 28 }}>
        © 2026 EMPL.DEV
      </p>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <span style={{
    width: 15, height: 15, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  }} />
);

export default Login;
