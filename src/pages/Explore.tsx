import React, { useState } from 'react';
import { tokens } from '../tokens';
import { exploreProfiles } from '../data/defaultData';
import { SearchIcon, MapPinIcon, UsersIcon } from '../components/Icons';

type Page = 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage' | 'postDetail' | 'settings';

interface ExploreProps {
  onNavigate: (page: Page) => void;
}

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
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: tokens.colors.navyGrad, padding: '40px 20px 48px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            개발자 탐색
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px' }}>
            기술 스택으로 개발자를 찾아보세요
          </p>
          <div style={{
            display: 'flex',
            backgroundColor: '#fff',
            borderRadius: tokens.borderRadius.full,
            overflow: 'hidden',
            boxShadow: tokens.shadows.lg,
            maxWidth: 440,
            margin: '0 auto',
          }}>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={17} color={tokens.colors.textMuted} />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="이름, 기술 스택 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: tokens.fontSizes.sm, color: tokens.colors.textPrimary, padding: '12px 0', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* Skill filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 28 }}>
          {ALL_SKILLS.map(skill => (
            <button
              key={skill}
              onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
              style={{
                border: `1.5px solid ${activeSkill === skill ? tokens.colors.primary : tokens.colors.border}`,
                backgroundColor: activeSkill === skill ? tokens.colors.primaryLight : tokens.colors.surface,
                color: activeSkill === skill ? tokens.colors.primary : tokens.colors.textSecondary,
                borderRadius: tokens.borderRadius.full,
                padding: '5px 14px',
                fontSize: tokens.fontSizes.xs,
                fontWeight: tokens.fontWeights.medium,
                cursor: 'pointer',
                transition: `all ${tokens.transitions.fast}`,
              }}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted, marginBottom: 16 }}>
          {filtered.length}명의 개발자
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {filtered.map(p => (
            <div
              key={p.id}
              onClick={() => onNavigate('profile')}
              style={{
                background: tokens.colors.surface,
                borderRadius: tokens.borderRadius.xl,
                border: `1px solid ${tokens.colors.border}`,
                padding: '20px',
                cursor: 'pointer',
                boxShadow: tokens.shadows.card,
                transition: `all ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = tokens.shadows.md;
                e.currentTarget.style.borderColor = tokens.colors.primary;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = tokens.shadows.card;
                e.currentTarget.style.borderColor = tokens.colors.border;
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                <img src={p.avatar} alt={p.name} style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{p.name}</div>
                  <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary, marginTop: 3, lineHeight: 1.4 }}>{p.headline}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                  <MapPinIcon size={12} color={tokens.colors.textMuted} />
                  {p.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                  <UsersIcon size={12} color={tokens.colors.textMuted} />
                  {p.followers.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {p.skills.map(s => (
                  <span key={s} style={{
                    backgroundColor: tokens.colors.tag,
                    color: tokens.colors.tagText,
                    padding: '2px 8px',
                    borderRadius: tokens.borderRadius.full,
                    fontSize: '10px',
                    fontWeight: tokens.fontWeights.medium,
                  }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: tokens.colors.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.medium }}>검색 결과가 없습니다</div>
            <div style={{ fontSize: tokens.fontSizes.sm, marginTop: 6 }}>다른 키워드나 스킬 필터를 시도해보세요</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
