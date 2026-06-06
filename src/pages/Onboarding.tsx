import React, { useState } from 'react';
import { tokens } from '../tokens';
import { createEmptyProfile, type ProfileData, type SocialLink } from '../data/defaultData';
import { SparklesIcon, PlusIcon, CloseIcon, GithubIcon, EmailIcon, WebsiteIcon } from '../components/Icons';

interface OnboardingProps {
  onComplete: (profile: ProfileData) => void;
  onLoadSample: () => void;
  onCancel: () => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold,
  color: tokens.colors.textSecondary, display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1.5px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm,
  color: tokens.colors.textPrimary, outline: 'none', boxSizing: 'border-box',
  background: tokens.colors.surface, fontFamily: 'inherit',
  transition: `border-color ${tokens.transitions.fast}`,
};

const focusBlur = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = tokens.colors.primary),
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.target.style.borderColor = tokens.colors.border),
};

const AVATAR_SEEDS = ['minjun', 'devone', 'coder', 'pixel', 'nova', 'orbit'];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onLoadSample, onCancel }) => {
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [years, setYears] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(AVATAR_SEEDS[0]);
  const [github, setGithub] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) setSkills(s => [...s, v]);
    setSkillInput('');
  };

  const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const socialLinks: SocialLink[] = [];
    if (github.trim()) socialLinks.push({ type: 'github', url: github.trim() });
    if (email.trim()) socialLinks.push({ type: 'email', url: `mailto:${email.trim()}` });
    if (website.trim()) socialLinks.push({ type: 'website', url: website.trim() });

    const profile: ProfileData = {
      ...createEmptyProfile(),
      name: name.trim(),
      headline: headline.trim(),
      role: role.trim(),
      location: location.trim(),
      yearsOfExp: Number(years) || 0,
      bio: bio.trim(),
      skills,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}&backgroundColor=b6e3f4`,
      socialLinks,
    };
    onComplete(profile);
  };

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh', padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: tokens.borderRadius.lg, background: tokens.colors.primaryLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
          }}>
            <SparklesIcon size={24} color={tokens.colors.primary} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            프로필 만들기
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: 0 }}>
            기본 정보를 입력해 개발자 프로필을 시작하세요. 나중에 언제든 수정할 수 있어요.
          </p>
        </div>

        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '24px', boxShadow: tokens.shadows.card }}>
          {/* Avatar pick */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>아바타 선택</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {AVATAR_SEEDS.map(seed => (
                <button
                  key={seed}
                  onClick={() => setAvatarSeed(seed)}
                  style={{
                    padding: 0, borderRadius: '50%', cursor: 'pointer', background: 'none',
                    border: `2.5px solid ${avatarSeed === seed ? tokens.colors.primary : 'transparent'}`,
                    lineHeight: 0,
                  }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4`}
                    alt={seed}
                    style={{ width: 44, height: 44, borderRadius: '50%', display: 'block' }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>이름 *</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="예: 김민준" {...focusBlur} />
            </div>
            <div>
              <label style={labelStyle}>한 줄 소개</label>
              <input style={inputStyle} value={headline} onChange={e => setHeadline(e.target.value)} placeholder="예: Full-Stack Developer · React & Node.js" {...focusBlur} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>직무</label>
                <input style={inputStyle} value={role} onChange={e => setRole(e.target.value)} placeholder="예: Frontend Engineer" {...focusBlur} />
              </div>
              <div style={{ width: 110 }}>
                <label style={labelStyle}>경력(년)</label>
                <input style={inputStyle} value={years} onChange={e => setYears(e.target.value.replace(/[^0-9]/g, ''))} placeholder="예: 5" inputMode="numeric" {...focusBlur} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>위치</label>
              <input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} placeholder="예: 서울, 대한민국" {...focusBlur} />
            </div>
            <div>
              <label style={labelStyle}>소개글</label>
              <textarea
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 80 }}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="어떤 개발자인지, 무엇에 관심이 있는지 적어보세요."
                rows={3}
                {...focusBlur}
              />
            </div>

            {/* Skills */}
            <div>
              <label style={labelStyle}>스킬</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="예: TypeScript (Enter로 추가)"
                  {...focusBlur}
                />
                <button
                  onClick={addSkill}
                  style={{
                    flexShrink: 0, padding: '0 14px', borderRadius: tokens.borderRadius.md, border: 'none',
                    background: tokens.colors.primary, color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <PlusIcon size={16} color="#fff" />
                </button>
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {skills.map(s => (
                    <span key={s} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      backgroundColor: tokens.colors.tag, color: tokens.colors.tagText,
                      padding: '4px 6px 4px 10px', borderRadius: tokens.borderRadius.full,
                      fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.medium,
                    }}>
                      {s}
                      <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0, color: tokens.colors.tagText }}>
                        <CloseIcon size={12} color={tokens.colors.tagText} />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 30, display: 'flex', justifyContent: 'center' }}><GithubIcon size={18} color={tokens.colors.textMuted} /></span>
                  <input style={{ ...inputStyle, flex: 1 }} value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/username" {...focusBlur} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 30, display: 'flex', justifyContent: 'center' }}><EmailIcon size={18} color={tokens.colors.textMuted} /></span>
                  <input style={{ ...inputStyle, flex: 1 }} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.dev" {...focusBlur} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 30, display: 'flex', justifyContent: 'center' }}><WebsiteIcon size={18} color={tokens.colors.textMuted} /></span>
                  <input style={{ ...inputStyle, flex: 1 }} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yoursite.dev" {...focusBlur} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              width: '100%', marginTop: 24, padding: '12px', borderRadius: tokens.borderRadius.lg, border: 'none',
              background: canSubmit ? tokens.colors.primary : tokens.colors.border,
              color: '#fff', fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            프로필 완성하기
          </button>
        </div>

        {/* Footer helpers */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 18 }}>
          <button onClick={onLoadSample} style={{ background: 'none', border: 'none', color: tokens.colors.primary, fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer' }}>
            샘플 프로필로 채우기
          </button>
          <span style={{ color: tokens.colors.border }}>·</span>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: tokens.colors.textMuted, fontSize: tokens.fontSizes.xs, cursor: 'pointer' }}>
            나중에 하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
