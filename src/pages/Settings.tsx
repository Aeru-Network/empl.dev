import React, { useState } from 'react';
import { tokens } from '../tokens';
import type { ProfileData } from '../data/defaultData';
import { SparklesIcon, PlusIcon, CloseIcon, CheckIcon, TrashIcon } from '../components/Icons';

interface SettingsProps {
  profile: ProfileData | null;
  onSave: (p: ProfileData) => void;
  onReset: () => void;
  onInitialize: () => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold,
  color: tokens.colors.textSecondary, display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1.5px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm, color: tokens.colors.textPrimary,
  outline: 'none', boxSizing: 'border-box', background: tokens.colors.surface, fontFamily: 'inherit',
  transition: `border-color ${tokens.transitions.fast}`,
};

const focusBlur = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = tokens.colors.primary),
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = tokens.colors.border),
};

const Settings: React.FC<SettingsProps> = ({ profile, onSave, onReset, onInitialize }) => {
  /* ── Empty state ── */
  if (!profile || !profile.name.trim()) {
    return (
      <div style={{ background: tokens.colors.background, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '64px 20px' }}>
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xxl, border: `1px solid ${tokens.colors.border}`, boxShadow: tokens.shadows.card, maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: tokens.colors.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <SparklesIcon size={28} color={tokens.colors.primary} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 10px' }}>설정할 프로필이 없어요</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: '0 0 24px', lineHeight: 1.65 }}>먼저 프로필을 만들어 주세요.</p>
          <button onClick={onInitialize} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: tokens.colors.primary, color: '#fff', border: 'none', borderRadius: tokens.borderRadius.lg, fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, cursor: 'pointer' }}>
            <SparklesIcon size={17} color="#fff" /> 프로필 시작하기
          </button>
        </div>
      </div>
    );
  }

  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [role, setRole] = useState(profile.role);
  const [location, setLocation] = useState(profile.location);
  const [years, setYears] = useState(String(profile.yearsOfExp || ''));
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState<string[]>(profile.skills);
  const [skillInput, setSkillInput] = useState('');
  const [saved, setSaved] = useState(false);

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills(s => [...s, v]);
    setSkillInput('');
  };
  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const handleSave = () => {
    onSave({
      ...profile,
      name: name.trim() || profile.name,
      headline: headline.trim(),
      role: role.trim(),
      location: location.trim(),
      yearsOfExp: Number(years) || 0,
      bio: bio.trim(),
      skills,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 24px', letterSpacing: '-0.5px' }}>설정</h1>

        {/* Profile info */}
        <Card title="프로필 정보">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${tokens.colors.border}` }} />
            ) : (
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: tokens.colors.navyGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: tokens.fontWeights.bold }}>{name.trim()[0]}</div>
            )}
            <div>
              <div style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{name}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 3 }}>아바타는 온보딩에서 선택할 수 있어요</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="이름"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} {...focusBlur} /></Field>
            <Field label="한 줄 소개"><input style={inputStyle} value={headline} onChange={e => setHeadline(e.target.value)} {...focusBlur} /></Field>
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="직무"><input style={inputStyle} value={role} onChange={e => setRole(e.target.value)} {...focusBlur} /></Field>
              <div style={{ width: 110 }}>
                <Field label="경력(년)"><input style={inputStyle} value={years} onChange={e => setYears(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" {...focusBlur} /></Field>
              </div>
            </div>
            <Field label="위치"><input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} {...focusBlur} /></Field>
            <Field label="소개글"><textarea style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 90 }} value={bio} onChange={e => setBio(e.target.value)} rows={4} {...focusBlur} /></Field>
            <Field label="스킬">
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Enter로 추가" {...focusBlur} />
                <button onClick={addSkill} style={{ flexShrink: 0, padding: '0 14px', borderRadius: tokens.borderRadius.md, border: 'none', background: tokens.colors.primary, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <PlusIcon size={16} color="#fff" />
                </button>
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {skills.map(s => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: tokens.colors.tag, color: tokens.colors.tagText, padding: '4px 6px 4px 10px', borderRadius: tokens.borderRadius.full, fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.medium }}>
                      {s}
                      <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                        <CloseIcon size={12} color={tokens.colors.tagText} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </Card>

        {/* Notifications */}
        <Card title="알림 설정">
          {[
            { label: '새 팔로워', desc: '누군가 나를 팔로우하면 알림 받기' },
            { label: '메시지', desc: '새 메시지 수신 시 알림 받기' },
            { label: '채용 추천', desc: '맞춤 채용 공고 추천 받기' },
          ].map((item, i) => <NotifRow key={i} label={item.label} desc={item.desc} />)}
        </Card>

        {/* Account */}
        <Card title="계정">
          <Field label="이메일">
            <input defaultValue="arriha96@gmail.com" readOnly style={{ ...inputStyle, color: tokens.colors.textMuted, backgroundColor: tokens.colors.surfaceAlt }} />
          </Field>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button
              onClick={onReset}
              style={{ padding: '8px 16px', background: 'none', border: `1.5px solid ${tokens.colors.border}`, borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, cursor: 'pointer', fontWeight: tokens.fontWeights.medium }}
            >
              프로필 초기화
            </button>
            <button
              style={{ padding: '8px 16px', background: 'none', border: `1.5px solid ${tokens.colors.error}`, borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm, color: tokens.colors.error, cursor: 'pointer', fontWeight: tokens.fontWeights.medium, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <TrashIcon size={14} color={tokens.colors.error} /> 계정 탈퇴
            </button>
          </div>
        </Card>

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '12px', background: saved ? tokens.colors.success : tokens.colors.primary,
            color: '#fff', border: 'none', borderRadius: tokens.borderRadius.lg, fontSize: tokens.fontSizes.md,
            fontWeight: tokens.fontWeights.bold, cursor: 'pointer', transition: `background ${tokens.transitions.normal}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
        >
          <CheckIcon size={17} color="#fff" /> {saved ? '저장되었습니다' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '24px', marginBottom: 16, boxShadow: tokens.shadows.card }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 18px' }}>{title}</h2>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ flex: 1 }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

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
        style={{ width: 42, height: 24, borderRadius: tokens.borderRadius.full, border: 'none', backgroundColor: on ? tokens.colors.primary : tokens.colors.border, cursor: 'pointer', position: 'relative', transition: `background ${tokens.transitions.normal}`, flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: `left ${tokens.transitions.normal}`, boxShadow: tokens.shadows.sm }} />
      </button>
    </div>
  );
};

export default Settings;
