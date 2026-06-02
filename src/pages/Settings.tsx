import React, { useState } from 'react';
import { tokens } from '../tokens';
import { defaultProfile } from '../data/defaultData';

const Settings: React.FC = () => {
  const [name, setName] = useState(defaultProfile.name);
  const [headline, setHeadline] = useState(defaultProfile.headline);
  const [bio, setBio] = useState(defaultProfile.bio);
  const [location, setLocation] = useState(defaultProfile.location);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    border: `1.5px solid ${tokens.colors.border}`,
    borderRadius: tokens.borderRadius.md,
    fontSize: tokens.fontSizes.sm,
    color: tokens.colors.textPrimary,
    outline: 'none',
    boxSizing: 'border-box',
    background: tokens.colors.surface,
    transition: `border-color ${tokens.transitions.fast}`,
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: tokens.fontSizes.xs,
    fontWeight: tokens.fontWeights.semibold,
    color: tokens.colors.textSecondary,
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 24px', letterSpacing: '-0.5px' }}>
          설정
        </h1>

        {/* Profile section */}
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '24px', marginBottom: 16, boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 20px' }}>프로필 정보</h2>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <img src={defaultProfile.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${tokens.colors.border}` }} />
            <div>
              <button style={{
                padding: '7px 14px',
                border: `1.5px solid ${tokens.colors.border}`,
                borderRadius: tokens.borderRadius.md,
                background: 'none',
                fontSize: tokens.fontSizes.sm,
                color: tokens.colors.textSecondary,
                cursor: 'pointer',
                marginBottom: 4,
                display: 'block',
              }}>
                사진 변경
              </button>
              <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>JPG, PNG 최대 2MB</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>이름</label>
              <input value={name} onChange={e => setName(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = tokens.colors.primary)}
                onBlur={e => (e.target.style.borderColor = tokens.colors.border)} />
            </div>
            <div>
              <label style={labelStyle}>한 줄 소개</label>
              <input value={headline} onChange={e => setHeadline(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = tokens.colors.primary)}
                onBlur={e => (e.target.style.borderColor = tokens.colors.border)} />
            </div>
            <div>
              <label style={labelStyle}>위치</label>
              <input value={location} onChange={e => setLocation(e.target.value)} style={inputStyle}
                onFocus={e => (e.target.style.borderColor = tokens.colors.primary)}
                onBlur={e => (e.target.style.borderColor = tokens.colors.border)} />
            </div>
            <div>
              <label style={labelStyle}>소개글</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => (e.target.style.borderColor = tokens.colors.primary)}
                onBlur={e => (e.target.style.borderColor = tokens.colors.border)}
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '24px', marginBottom: 16, boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>알림 설정</h2>
          {[
            { label: '새 팔로워', desc: '누군가 나를 팔로우하면 알림 받기' },
            { label: '메시지', desc: '새 메시지 수신 시 알림 받기' },
            { label: '채용 추천', desc: '맞춤 채용 공고 추천 받기' },
          ].map((item, i) => (
            <NotifRow key={i} label={item.label} desc={item.desc} />
          ))}
        </div>

        {/* Account */}
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '24px', marginBottom: 24, boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>계정</h2>
          <div>
            <label style={labelStyle}>이메일</label>
            <input
              defaultValue="minjun@example.dev"
              style={{ ...inputStyle, color: tokens.colors.textMuted, backgroundColor: tokens.colors.surfaceAlt }}
              readOnly
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <button style={{
              padding: '8px 16px',
              background: 'none',
              border: `1.5px solid ${tokens.colors.error}`,
              borderRadius: tokens.borderRadius.md,
              fontSize: tokens.fontSizes.sm,
              color: tokens.colors.error,
              cursor: 'pointer',
              fontWeight: tokens.fontWeights.medium,
            }}>
              계정 탈퇴
            </button>
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '12px',
            background: saved ? tokens.colors.success : tokens.colors.primary,
            color: '#fff',
            border: 'none',
            borderRadius: tokens.borderRadius.lg,
            fontSize: tokens.fontSizes.md,
            fontWeight: tokens.fontWeights.bold,
            cursor: 'pointer',
            transition: `background ${tokens.transitions.normal}`,
          }}
        >
          {saved ? '✓ 저장되었습니다' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
};

const NotifRow: React.FC<{ label: string; desc: string }> = ({ label, desc }) => {
  const [on, setOn] = useState(true);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${tokens.colors.borderLight}` }}>
      <div>
        <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.medium, color: tokens.colors.textPrimary }}>{label}</div>
        <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        style={{
          width: 42,
          height: 24,
          borderRadius: tokens.borderRadius.full,
          border: 'none',
          backgroundColor: on ? tokens.colors.primary : tokens.colors.border,
          cursor: 'pointer',
          position: 'relative',
          transition: `background ${tokens.transitions.normal}`,
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2,
          left: on ? 20 : 2,
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: `left ${tokens.transitions.normal}`,
          boxShadow: tokens.shadows.sm,
        }} />
      </button>
    </div>
  );
};

export default Settings;
