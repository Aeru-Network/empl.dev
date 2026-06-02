import React, { useState } from 'react';
import { tokens } from '../tokens';
import { sampleJobs } from '../data/defaultData';
import type { Job } from '../data/defaultData';
import { SearchIcon, MapPinIcon } from '../components/Icons';

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
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: tokens.colors.navyGrad, padding: '40px 20px 48px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>채용 공고</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px' }}>개발자 맞춤 포지션을 찾아보세요</p>
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
              placeholder="직함, 회사, 기술 스택 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: tokens.fontSizes.sm, color: tokens.colors.textPrimary, padding: '12px 0', background: 'transparent' }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* Type filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 24, flexWrap: 'wrap' }}>
          {TYPES.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              style={{
                border: `1.5px solid ${typeFilter === t ? tokens.colors.primary : tokens.colors.border}`,
                backgroundColor: typeFilter === t ? tokens.colors.primaryLight : tokens.colors.surface,
                color: typeFilter === t ? tokens.colors.primary : tokens.colors.textSecondary,
                borderRadius: tokens.borderRadius.full,
                padding: '5px 14px',
                fontSize: tokens.fontSizes.xs,
                fontWeight: tokens.fontWeights.medium,
                cursor: 'pointer',
                transition: `all ${tokens.transitions.fast}`,
              }}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted, marginBottom: 16 }}>
          {filtered.length}개의 채용 공고
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: tokens.colors.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.medium }}>검색 결과가 없습니다</div>
            <div style={{ fontSize: tokens.fontSizes.sm, marginTop: 6 }}>다른 검색어나 필터를 시도해보세요</div>
          </div>
        )}
      </div>
    </div>
  );
};

const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const [hovered, setHovered] = useState(false);

  const typeColors: Record<string, { bg: string; text: string }> = {
    'full-time': { bg: '#dcfce7', text: '#16a34a' },
    'remote': { bg: '#ede9fe', text: '#7c3aed' },
    'contract': { bg: '#fef3c7', text: '#b45309' },
    'part-time': { bg: '#f0f9ff', text: '#0369a1' },
  };
  const tc = typeColors[job.type] ?? { bg: tokens.colors.surfaceAlt, text: tokens.colors.textSecondary };
  const typeLabel = { 'full-time': '정규직', remote: '원격', contract: '계약직', 'part-time': '파트타임' }[job.type] ?? job.type;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.colors.surface,
        borderRadius: tokens.borderRadius.xl,
        padding: '20px 24px',
        border: `1.5px solid ${hovered ? tokens.colors.primary : tokens.colors.border}`,
        cursor: 'pointer',
        boxShadow: hovered ? tokens.shadows.md : tokens.shadows.card,
        transition: `all ${tokens.transitions.fast}`,
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <img src={job.logo} alt={job.company} style={{ width: 48, height: 48, borderRadius: tokens.borderRadius.lg, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <div>
              <div style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{job.title}</div>
              <div style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, marginTop: 2 }}>{job.company}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{job.salary}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{job.posted}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
              <MapPinIcon size={12} color={tokens.colors.textMuted} /> {job.location}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: tokens.fontWeights.semibold,
              backgroundColor: tc.bg,
              color: tc.text,
              padding: '2px 8px',
              borderRadius: tokens.borderRadius.full,
            }}>
              {typeLabel}
            </span>
            {job.featured && (
              <span style={{ fontSize: '10px', fontWeight: tokens.fontWeights.semibold, backgroundColor: '#fef9c3', color: '#854d0e', padding: '2px 8px', borderRadius: tokens.borderRadius.full }}>
                추천
              </span>
            )}
          </div>

          <p style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: '0 0 10px', lineHeight: 1.6 }}>
            {job.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {job.tags.map(t => (
              <span key={t} style={{ backgroundColor: tokens.colors.tag, color: tokens.colors.tagText, padding: '2px 8px', borderRadius: tokens.borderRadius.full, fontSize: '10px', fontWeight: tokens.fontWeights.medium }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
