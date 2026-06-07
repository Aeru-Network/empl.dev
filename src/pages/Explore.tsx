import React, { useState } from 'react';
import { tokens } from '../tokens';
import { exploreProfiles } from '../data/defaultData';
import { SearchIcon, MapPinIcon, UsersIcon, StarIcon, FilterIcon } from '../components/Icons';

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
const SORT_OPTIONS = [
  { value: 'followers', label: '팔로워 순' },
  { value: 'name', label: '이름 순' },
  { value: 'skills', label: '스킬 많은 순' },
];

const Explore: React.FC<ExploreProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState('followers');
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const toggleSkill = (skill: string) => {
    setActiveSkills(prev => {
      const next = new Set(prev);
      next.has(skill) ? next.delete(skill) : next.add(skill);
      return next;
    });
  };

  const toggleFollow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFollowedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  let filtered = exploreProfiles.filter(p => {
    const matchesSearch = !search || p.name.includes(search) || p.headline.toLowerCase().includes(search.toLowerCase()) || p.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesSkill = activeSkills.size === 0 || [...activeSkills].every(s => p.skills.includes(s));
    return matchesSearch && matchesSkill;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'followers') return b.followers - a.followers;
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'skills') return b.skills.length - a.skills.length;
    return 0;
  });

  const clearFilters = () => { setActiveSkills(new Set()); setSearch(''); };
  const hasFilters = activeSkills.size > 0 || search;

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: '28px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: D.heading, margin: '0 0 6px', letterSpacing: '-0.6px' }}>
            개발자 탐색
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0 }}>
            {exploreProfiles.length}명의 개발자와 연결하세요
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Search + filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          <div style={{ flex: 1, display: 'flex', background: '#0f0f0f', borderRadius: 8, border: `1px solid ${D.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={16} color={D.muted} />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="이름, 기술 스택, 직무 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: tokens.fontSizes.sm, color: D.heading, padding: '12px 0', background: 'transparent', fontFamily: 'inherit' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', color: D.muted, fontSize: 16, fontFamily: 'inherit' }}>×</button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '0 14px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${showFilters || activeSkills.size > 0 ? 'rgba(0,112,243,0.4)' : D.border}`,
              background: showFilters || activeSkills.size > 0 ? D.accentDim : '#0f0f0f',
              color: showFilters || activeSkills.size > 0 ? '#5b9cf6' : D.muted,
              fontSize: tokens.fontSizes.xs, fontWeight: 600, fontFamily: 'inherit',
              transition: `all ${tokens.transitions.fast}`,
            }}
          >
            <FilterIcon size={13} color={showFilters || activeSkills.size > 0 ? '#5b9cf6' : D.muted} />
            필터 {activeSkills.size > 0 && `(${activeSkills.size})`}
          </button>
        </div>
        {/* Filters panel */}
        {showFilters && (
          <div style={{ background: '#0a0a0a', borderRadius: 10, border: `1px solid ${D.border}`, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ fontSize: tokens.fontSizes.xs, fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>기술 스택 필터</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {ALL_SKILLS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    border: `1px solid ${activeSkills.has(skill) ? 'rgba(0,112,243,0.5)' : D.border}`,
                    background: activeSkills.has(skill) ? D.accentDim : 'transparent',
                    color: activeSkills.has(skill) ? '#5b9cf6' : D.body,
                    borderRadius: 999, padding: '5px 14px',
                    fontSize: tokens.fontSizes.xs, fontWeight: 500, cursor: 'pointer',
                    transition: `all ${tokens.transitions.fast}`,
                    fontFamily: 'inherit',
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: tokens.fontSizes.sm, color: D.muted }}>{filtered.length}명의 개발자</span>
            {hasFilters && (
              <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#5b9cf6', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                필터 초기화
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '6px', background: '#0a0a0a', border: `1px solid ${D.border}`, borderRadius: 10, padding: 4 }}>
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                style={{
                  border: 'none',
                  background: sort === opt.value ? '#1a1a1a' : 'transparent',
                  color: sort === opt.value ? D.heading : D.muted,
                  borderRadius: 7, padding: '6px 14px',
                  fontSize: tokens.fontSizes.xs, fontWeight: sort === opt.value ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: `all ${tokens.transitions.fast}`,
                  outline: sort === opt.value ? `1px solid ${D.border}` : 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
          {filtered.map(p => (
            <DevCard
              key={p.id}
              profile={p}
              followed={followedIds.has(p.id)}
              onView={() => onNavigate('profile')}
              onToggleFollow={e => toggleFollow(p.id, e)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 600, color: D.body, marginBottom: 6 }}>검색 결과가 없습니다</div>
            <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, marginBottom: 16 }}>다른 키워드나 스킬 필터를 시도해보세요</div>
            <button onClick={clearFilters} style={{ background: '#1a1a1a', color: D.body, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 20px', fontSize: tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              필터 초기화
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const DevCard: React.FC<{
  profile: { id: string; name: string; headline: string; avatar: string; location: string; skills: string[]; followers: number };
  followed: boolean;
  onView: () => void;
  onToggleFollow: (e: React.MouseEvent) => void;
}> = ({ profile: p, followed, onView, onToggleFollow }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: D.card, borderRadius: 12, border: `1px solid ${hovered ? D.borderHover : D.border}`,
        padding: '20px', cursor: 'pointer', transition: `all ${tokens.transitions.fast}`,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      {/* Top row: avatar + follow */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
          <img src={p.avatar} alt={p.name} style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, border: `1px solid ${D.border}` }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, marginTop: 3, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.headline}</div>
          </div>
        </div>
        <button
          onClick={onToggleFollow}
          style={{
            flexShrink: 0, marginLeft: 8,
            padding: '5px 12px', borderRadius: 999, fontFamily: 'inherit',
            border: `1px solid ${followed ? 'rgba(0,112,243,0.4)' : D.border}`,
            background: followed ? D.accentDim : 'transparent',
            color: followed ? '#5b9cf6' : D.muted,
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            transition: `all ${tokens.transitions.fast}`,
          }}
        >
          {followed ? '팔로잉' : '팔로우'}
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
          <MapPinIcon size={11} color={D.muted} /> {p.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
          <UsersIcon size={11} color={D.muted} /> {(p.followers + (followed ? 1 : 0)).toLocaleString()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
          <StarIcon size={11} color={D.muted} /> {p.skills.length} 스킬
        </span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {p.skills.slice(0, 5).map(s => (
          <span key={s} style={{ background: D.tag, color: D.tagText, padding: '3px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{s}</span>
        ))}
        {p.skills.length > 5 && (
          <span style={{ background: D.tag, color: D.muted, padding: '3px 8px', borderRadius: 999, fontSize: '10px', border: `1px solid ${D.border}` }}>+{p.skills.length - 5}</span>
        )}
      </div>
    </div>
  );
};

export default Explore;
