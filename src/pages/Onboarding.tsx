import React, { useRef, useState } from 'react';
import { tokens } from '../tokens';
import { createEmptyProfile, type ProfileData, type SocialLink } from '../data/defaultData';
import { SparklesIcon, PlusIcon, CloseIcon, GithubIcon, EmailIcon, WebsiteIcon } from '../components/Icons';

interface OnboardingProps {
  onComplete: (profile: ProfileData) => void;
  onLoadSample: () => void;
  onCancel: () => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', input: '#111',
  border: 'rgba(255,255,255,0.08)', inputBorder: 'rgba(255,255,255,0.10)',
  borderFocus: 'rgba(255,255,255,0.28)', heading: '#fff', body: '#a1a1aa',
  muted: '#52525b', accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
};

const AVATAR_SEEDS = ['minjun', 'devone', 'coder', 'pixel', 'nova', 'orbit'];

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: 600,
  color: D.body, display: 'block', marginBottom: 6, letterSpacing: '0.2px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1px solid ${D.inputBorder}`,
  borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.heading,
  outline: 'none', boxSizing: 'border-box', background: D.input,
  fontFamily: 'inherit', transition: `border-color ${tokens.transitions.fast}`,
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target!.result as string); r.readAsDataURL(file); });

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onLoadSample, onCancel }) => {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [years, setYears] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [avatarSeed, setAvatarSeed] = useState<string | null>(AVATAR_SEEDS[0]);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [bannerUrl, setBannerUrl] = useState<string>('');
  const [github, setGithub] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setAvatarUrl(url);
    setAvatarSeed(null);
    e.target.value = '';
  };

  const handleBannerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataUrl(file);
    setBannerUrl(url);
    e.target.value = '';
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills(s => [...s, v]);
    setSkillInput('');
  };
  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));
  const canSubmit = name.trim().length > 0;

  const resolvedAvatar = avatarUrl || (avatarSeed
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4`
    : '');

  const handleSubmit = () => {
    if (!canSubmit) return;
    const socialLinks: SocialLink[] = [];
    if (github.trim()) socialLinks.push({ type: 'github', url: github.trim() });
    if (email.trim()) socialLinks.push({ type: 'email', url: `mailto:${email.trim()}` });
    if (website.trim()) socialLinks.push({ type: 'website', url: website.trim() });
    onComplete({
      ...createEmptyProfile(),
      name: name.trim(), headline: headline.trim(), role: role.trim(),
      location: location.trim(), yearsOfExp: Number(years) || 0,
      bio: bio.trim(), skills, avatar: resolvedAvatar,
      banner: bannerUrl || undefined, socialLinks,
    });
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.borderFocus);
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = D.inputBorder);

  return (
    <div style={{ background: D.bg, minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: D.accentDim, border: `1px solid rgba(0,112,243,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <SparklesIcon size={22} color={D.accent} />
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, color: D.heading, margin: '0 0 8px', letterSpacing: '-1px' }}>
            프로필 만들기
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0, lineHeight: 1.6 }}>
            기본 정보를 입력해 개발자 프로필을 시작하세요.
          </p>
        </div>

        <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '28px 24px' }}>

          {/* Banner upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>커버 배너</label>
            <div style={{
              height: 100, borderRadius: 10, border: `1px solid ${D.border}`,
              background: bannerUrl ? `url(${bannerUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)',
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
            }}
              onClick={() => bannerInputRef.current?.click()}
            >
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.85)', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>
                  {bannerUrl ? '배너 변경' : '+ 배너 업로드'}
                </span>
              </div>
            </div>
            <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleBannerFile} />
            {bannerUrl && (
              <button onClick={() => setBannerUrl('')} style={{ marginTop: 6, background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0 }}>
                배너 제거
              </button>
            )}
          </div>

          {/* Avatar */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>아바타</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              {/* Current avatar preview */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {resolvedAvatar ? (
                  <img src={resolvedAvatar} alt="avatar" style={{ width: 60, height: 60, borderRadius: '50%', border: `2px solid ${D.accent}`, display: 'block', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: `2px dashed ${D.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 22 }}>👤</span>
                  </div>
                )}
              </div>

              {/* Preset seeds */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1 }}>
                {AVATAR_SEEDS.map(seed => (
                  <button
                    key={seed}
                    onClick={() => { setAvatarSeed(seed); setAvatarUrl(''); }}
                    style={{
                      padding: 0, borderRadius: '50%', cursor: 'pointer', background: 'none',
                      border: `2.5px solid ${avatarSeed === seed && !avatarUrl ? D.accent : 'transparent'}`,
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`}
                      alt={seed}
                      style={{ width: 40, height: 40, borderRadius: '50%', display: 'block' }}
                    />
                  </button>
                ))}
                {/* Upload button */}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', border: `1px dashed ${D.inputBorder}`,
                    background: avatarUrl ? 'none' : D.input, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 0,
                    overflow: 'hidden',
                    outline: avatarUrl ? `2.5px solid ${D.accent}` : 'none',
                  }}
                  title="사진 업로드"
                >
                  <span style={{ fontSize: 16 }}>📁</span>
                </button>
              </div>
              <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
            </div>
            {avatarUrl && (
              <button onClick={() => { setAvatarUrl(''); setAvatarSeed(AVATAR_SEEDS[0]); }} style={{ marginTop: 8, background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0 }}>
                업로드 사진 제거
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>이름 *</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="예: 김민준" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>한 줄 소개</label>
              <input style={inputStyle} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="예: Full-Stack Developer · React & Node.js" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>직무</label>
                <input style={inputStyle} value={role} onChange={e => setRole(e.target.value)} placeholder="예: Frontend Engineer" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
              <div style={{ width: 110 }}>
                <label style={labelStyle}>경력(년)</label>
                <input style={inputStyle} value={years} onChange={e => setYears(e.target.value.replace(/[^0-9]/g, ''))} placeholder="5" inputMode="numeric" onFocus={focusStyle} onBlur={blurStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>위치</label>
              <input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} placeholder="예: 서울, 대한민국" onFocus={focusStyle} onBlur={blurStyle} />
            </div>
            <div>
              <label style={labelStyle}>소개글</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 80 }}
                value={bio} onChange={e => setBio(e.target.value)}
                placeholder="어떤 개발자인지, 무엇에 관심이 있는지 적어보세요."
                rows={3} onFocus={focusStyle} onBlur={blurStyle}
              />
            </div>

            {/* Skills */}
            <div>
              <label style={labelStyle}>스킬</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={skillInput} onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="예: TypeScript (Enter로 추가)"
                  onFocus={focusStyle} onBlur={blurStyle}
                />
                <button onClick={addSkill} style={{ flexShrink: 0, padding: '0 14px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  <PlusIcon size={16} color="#000" />
                </button>
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {skills.map(s => (
                    <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: D.tag, color: D.tagText, padding: '4px 6px 4px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
                      {s}
                      <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: D.tagText }}>
                        <CloseIcon size={12} color={D.tagText} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Social */}
            <div>
              <label style={labelStyle}>소셜 링크</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: <GithubIcon size={17} color={D.muted} />, val: github, set: setGithub, ph: 'https://github.com/username' },
                  { icon: <EmailIcon size={17} color={D.muted} />, val: email, set: setEmail, ph: 'you@example.dev' },
                  { icon: <WebsiteIcon size={17} color={D.muted} />, val: website, set: setWebsite, ph: 'https://yoursite.dev' },
                ].map(({ icon, val, set, ph }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 28, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
                    <input style={{ ...inputStyle, flex: 1 }} value={val} onChange={e => set(e.target.value)} placeholder={ph} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: '100%', marginTop: 24, padding: '13px', borderRadius: 9, border: 'none',
              background: canSubmit ? '#fff' : 'rgba(255,255,255,0.08)',
              color: canSubmit ? '#000' : D.muted,
              fontSize: tokens.fontSizes.md, fontWeight: 700,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            프로필 완성하기
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 18 }}>
          <button onClick={onLoadSample} style={{ background: 'none', border: 'none', color: '#5b9cf6', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>
            샘플 프로필로 채우기
          </button>
          <span style={{ color: D.border }}>·</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer' }}>
            나중에 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
