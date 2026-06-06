import React, { useRef, useState } from 'react';
import { tokens } from '../tokens';
import type { ProfileData } from '../data/defaultData';
import { SparklesIcon, PlusIcon, CloseIcon, CheckIcon, TrashIcon } from '../components/Icons';

interface SettingsProps {
  profile: ProfileData | null;
  onSave: (p: ProfileData) => void;
  onReset: () => void;
  onInitialize: () => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', input: '#111',
  border: 'rgba(255,255,255,0.08)', inputBorder: 'rgba(255,255,255,0.10)',
  borderFocus: 'rgba(255,255,255,0.28)', heading: '#fff', body: '#a1a1aa',
  muted: '#52525b', accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
  error: '#ef4444', errorDim: 'rgba(239,68,68,0.1)', success: '#10b981',
};

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: 600,
  color: D.body, display: 'block', marginBottom: 6, letterSpacing: '0.2px',
};

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1px solid ${D.inputBorder}`,
  borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.heading,
  outline: 'none', boxSizing: 'border-box', background: D.input,
  fontFamily: 'inherit', transition: `border-color ${tokens.transitions.fast}`,
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target!.result as string); r.readAsDataURL(file); });

const Settings: React.FC<SettingsProps> = ({ profile, onSave, onReset, onInitialize }) => {
  if (!profile || !profile.name.trim()) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: D.accentDim, border: `1px solid rgba(0,112,243,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <SparklesIcon size={26} color={D.accent} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, margin: '0 0 10px' }}>설정할 프로필이 없어요</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 24px', lineHeight: 1.65 }}>먼저 프로필을 만들어 주세요.</p>
          <button onClick={onInitialize} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: 9, fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: 'pointer' }}>
            <SparklesIcon size={17} color="#000" /> 프로필 시작하기
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
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar || '');
  const [bannerUrl, setBannerUrl] = useState(profile.banner || '');
  const [saved, setSaved] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUrl(await fileToDataUrl(file));
    e.target.value = '';
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUrl(await fileToDataUrl(file));
    e.target.value = '';
  };

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
      avatar: avatarUrl,
      banner: bannerUrl || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.borderFocus);
  const blur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.inputBorder);

  return (
    <div style={{ background: D.bg, minHeight: '100vh', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: D.heading, margin: '0 0 24px', letterSpacing: '-1px' }}>설정</h1>

        {/* Banner */}
        <Card title="커버 배너">
          <div style={{
            height: 96, borderRadius: 10, border: `1px solid ${D.border}`, cursor: 'pointer',
            background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)',
            position: 'relative', overflow: 'hidden', marginBottom: 8,
          }} onClick={() => bannerInputRef.current?.click()}>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
              <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.85)', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>
                {bannerUrl ? '배너 변경' : '+ 배너 업로드'}
              </span>
            </div>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerFile} />
          {bannerUrl && <button onClick={() => setBannerUrl('')} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0 }}>배너 제거</button>}
        </Card>

        {/* Profile info */}
        <Card title="프로필 정보">
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: `2px solid ${D.border}`, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 26, fontWeight: 700 }}>
                  {name.trim()[0] ?? '?'}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => avatarInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: '6px 14px', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>
                사진 업로드
              </button>
              {avatarUrl && <button onClick={() => setAvatarUrl('')} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0, textAlign: 'left' }}>사진 제거</button>}
            </div>
            <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="이름"><input style={inputBase} value={name} onChange={e => setName(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
            <Field label="한 줄 소개"><input style={inputBase} value={headline} onChange={e => setHeadline(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="직무"><input style={inputBase} value={role} onChange={e => setRole(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
              <div style={{ width: 110 }}>
                <Field label="경력(년)"><input style={inputBase} value={years} onChange={e => setYears(e.target.value.replace(/[^0-9]/g, ''))} inputMode="numeric" onFocus={focus} onBlur={blur} /></Field>
              </div>
            </div>
            <Field label="위치"><input style={inputBase} value={location} onChange={e => setLocation(e.target.value)} onFocus={focus} onBlur={blur} /></Field>
            <Field label="소개글"><textarea style={{ ...inputBase, resize: 'vertical', lineHeight: 1.6, minHeight: 90 }} value={bio} onChange={e => setBio(e.target.value)} rows={4} onFocus={focus} onBlur={blur} /></Field>
            <Field label="스킬">
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputBase, flex: 1 }} value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Enter로 추가" onFocus={focus} onBlur={blur} />
                <button onClick={addSkill} style={{ flexShrink: 0, padding: '0 14px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                  <PlusIcon size={16} color="#000" />
                </button>
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {skills.map(s => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: D.tag, color: D.tagText, padding: '4px 6px 4px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
                      {s}
                      <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
                        <CloseIcon size={12} color={D.tagText} />
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
            <input defaultValue="arriha96@gmail.com" readOnly style={{ ...inputBase, color: D.muted, background: '#0a0a0a', cursor: 'not-allowed' }} />
          </Field>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button onClick={onReset} style={{ padding: '8px 16px', background: 'none', border: `1px solid ${D.border}`, borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.body, cursor: 'pointer', fontWeight: 500 }}>
              프로필 초기화
            </button>
            <button style={{ padding: '8px 16px', background: D.errorDim, border: `1px solid rgba(239,68,68,0.25)`, borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.error, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrashIcon size={14} color={D.error} /> 계정 탈퇴
            </button>
          </div>
        </Card>

        <button
          onClick={handleSave}
          style={{
            width: '100%', padding: '13px', background: saved ? '#10b981' : '#fff',
            color: saved ? '#fff' : '#000', border: 'none', borderRadius: 9,
            fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: 'pointer',
            transition: `background ${tokens.transitions.normal}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          }}
        >
          <CheckIcon size={17} color={saved ? '#fff' : '#000'} /> {saved ? '저장 완료 — 프로필로 이동 중' : '변경사항 저장'}
        </button>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: '#0f0f0f', borderRadius: 12, border: `1px solid rgba(255,255,255,0.08)`, padding: '22px 24px', marginBottom: 14 }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: '#fff', margin: '0 0 18px', letterSpacing: '-0.3px' }}>{title}</h2>
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
      <div>
        <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 500, color: '#fff' }}>{label}</div>
        <div style={{ fontSize: tokens.fontSizes.xs, color: '#52525b', marginTop: 2 }}>{desc}</div>
      </div>
      <button
        onClick={() => setOn(v => !v)}
        style={{ width: 42, height: 24, borderRadius: 999, border: 'none', background: on ? '#0070f3' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: `background ${tokens.transitions.normal}`, flexShrink: 0 }}
      >
        <div style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: `left ${tokens.transitions.normal}` }} />
      </button>
    </div>
  );
};

export default Settings;
