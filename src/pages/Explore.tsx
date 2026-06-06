import React, { useState } from 'react';
import { tokens } from '../tokens';
import { exploreProfiles } from '../data/defaultData';
import { SearchIcon, MapPinIcon, UsersIcon } from '../components/Icons';

type Page = 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage' | 'postDetail' | 'settings';

interface ExploreProps {
  onNavigate: (page: Page) => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.18)', heading: '#fff', body: '#a1a1aa',
  muted: '#52525b', accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa', input: '#111',
  inputBorder: 'rgba(255,255,255,0.10)',
};

const ALL_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'Rust', 'Swift', 'Kotlin', 'AWS', 'Docker', 'Kubernetes', 'ML/AI'];

const Explore: React.FC<ExploreProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const filtered = exploreProfiles.filter(p => {
    const matchesSearch = !search || p.name.includes(search) || p.headline.toLowerCase().includes(search.toLowerCase()) || p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSkill = !activeSkill || p.skills.includes(activeSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: 'clamp(48px, 7vw, 80px) 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 260, background: 'radial-gradient(ellipse, rgba(0,112,243,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: D.heading, margin: '0 0 10px', letterSpacing: '-1.5px' }}>
            개발자 탐색
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 28px' }}>
            기술 스택으로 개발자를 찾아보세요
          </p>
          <div style={{ display: 'flex', background: D.card, borderRadius: 8, border: `1px solid ${D.border}`, overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={16} color={D.muted} />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="이름, 기술 스택 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: tokens.fontSizes.sm, color: D.heading, padding: '13px 0', background: 'transparent', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Skill filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 28 }}>
          {ALL_SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
              style={{
                border: `1px solid ${activeSkill === skill ? 'rgba(0,112,243,0.5)' : D.border}`,
                background: activeSkill === skill ? D.accentDim : 'transparent',
                color: activeSkill === skill ? '#5b9cf6' : D.body,
                borderRadius: 999, padding: '5px 14px',
                fontSize: tokens.fontSizes.xs, fontWeight: 500, cursor: 'pointer',
                transition: `all ${tokens.transitions.fast}`,
              }}
            >
              {skill}
            </button>
          ))}
        </div>

        <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, marginBottom: 18 }}>
          {filtered.length}명의 개발자
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => onNavigate('profile')}
              style={{ background: D.card, borderRadius: 10, border: `1px solid ${D.border}`, padding: '20px', cursor: 'pointer', transition: `border-color ${tokens.transitions.fast}` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                <img src={p.avatar} alt={p.name} style={{ width: 50, height: 50, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{p.name}</div>
                  <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, marginTop: 3, lineHeight: 1.4 }}>{p.headline}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
                  <MapPinIcon size={11} color={D.muted} /> {p.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
                  <UsersIcon size={11} color={D.muted} /> {p.followers.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {p.skills.map(s => (
                  <span key={s} style={{ background: D.tag, color: D.tagText, padding: '2px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: D.muted }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 600, color: D.body }}>검색 결과가 없습니다</div>
            <div style={{ fontSize: tokens.fontSizes.sm, marginTop: 6 }}>다른 키워드나 스킬 필터를 시도해보세요</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
