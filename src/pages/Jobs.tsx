import React, { useState } from 'react';
import { tokens } from '../tokens';
import { sampleJobs } from '../data/defaultData';
import type { Job } from '../data/defaultData';
import { SearchIcon, MapPinIcon } from '../components/Icons';

const D = {
  bg: '#000', card: '#0f0f0f', border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.18)', heading: '#fff', body: '#a1a1aa',
  muted: '#52525b', accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
};

const TYPES = ['전체', 'full-time', 'remote', 'contract'];
const TYPE_LABELS: Record<string, string> = { 'full-time': '정규직', remote: '원격', contract: '계약직', '전체': '전체' };

const Jobs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');

  const filtered = sampleJobs.filter(job => {
    const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()) || job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === '전체' || job.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: 'clamp(48px, 7vw, 80px) 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 260, background: 'radial-gradient(ellipse, rgba(0,112,243,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: D.heading, margin: '0 0 10px', letterSpacing: '-1.5px' }}>채용 공고</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 28px' }}>개발자 맞춤 포지션을 찾아보세요</p>
          <div style={{ display: 'flex', background: '#0f0f0f', borderRadius: 8, border: `1px solid ${D.border}`, overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={16} color={D.muted} />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="직함, 회사, 기술 스택 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: tokens.fontSizes.sm, color: D.heading, padding: '13px 0', background: 'transparent', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Type filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 28, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                border: `1px solid ${typeFilter === t ? 'rgba(0,112,243,0.5)' : D.border}`,
                background: typeFilter === t ? D.accentDim : 'transparent',
                color: typeFilter === t ? '#5b9cf6' : D.body,
                borderRadius: 999, padding: '5px 16px',
                fontSize: tokens.fontSizes.xs, fontWeight: 500, cursor: 'pointer',
                transition: `all ${tokens.transitions.fast}`,
              }}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, marginBottom: 18 }}>
          {filtered.length}개의 채용 공고
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(job => <JobCard key={job.id} job={job} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: D.muted }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 600, color: D.body }}>검색 결과가 없습니다</div>
            <div style={{ fontSize: tokens.fontSizes.sm, marginTop: 6 }}>다른 검색어나 필터를 시도해보세요</div>
          </div>
        )}
      </div>
    </div>
  );
};

const TYPE_BADGE: Record<string, { bg: string; text: string }> = {
  'full-time': { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  'remote':    { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
  'contract':  { bg: 'rgba(249,115,22,0.1)', text: '#fb923c' },
  'part-time': { bg: 'rgba(14,165,233,0.1)', text: '#38bdf8' },
};
const TYPE_LABEL: Record<string, string> = { 'full-time': '정규직', remote: '원격', contract: '계약직', 'part-time': '파트타임' };

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const [hovered, setHovered] = useState(false);
  const tc = TYPE_BADGE[job.type] ?? { bg: D.tag, text: D.body };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: D.card, borderRadius: 10, padding: '20px 22px',
        border: `1px solid ${hovered ? D.borderHover : D.border}`,
        cursor: 'pointer', transition: `border-color ${tokens.transitions.fast}`,
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <img src={job.logo} alt={job.company} style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0, border: `1px solid ${D.border}` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading }}>{job.title}</div>
              <div style={{ fontSize: tokens.fontSizes.sm, color: D.body, marginTop: 2 }}>{job.company}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{job.salary}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{job.posted}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
              <MapPinIcon size={11} color={D.muted} /> {job.location}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 600, background: tc.bg, color: tc.text, padding: '2px 8px', borderRadius: 999 }}>
              {TYPE_LABEL[job.type] ?? job.type}
            </span>
            {job.featured && (
              <span style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(234,179,8,0.12)', color: '#fbbf24', padding: '2px 8px', borderRadius: 999 }}>
                추천
              </span>
            )}
          </div>

          <p style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '0 0 10px', lineHeight: 1.65 }}>{job.description}</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {job.tags.map(t => (
              <span key={t} style={{ background: D.tag, color: D.tagText, padding: '2px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
