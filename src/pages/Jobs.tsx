import React, { useState } from 'react';
import { tokens } from '../tokens';
import { sampleJobs } from '../data/defaultData';
import type { Job } from '../data/defaultData';
import { SearchIcon, MapPinIcon, CloseIcon, BookmarkIcon, CheckIcon, ArrowRightIcon } from '../components/Icons';

const D = {
  bg: '#000', card: '#0f0f0f', panel: '#0D0D14',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.18)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
};

const TYPES = ['전체', 'full-time', 'remote', 'contract'];
const TYPE_LABELS: Record<string, string> = { 'full-time': '정규직', remote: '원격', contract: '계약직', '전체': '전체', 'part-time': '파트타임' };

const TYPE_BADGE: Record<string, { bg: string; text: string }> = {
  'full-time': { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  'remote':    { bg: 'rgba(139,92,246,0.1)', text: '#a78bfa' },
  'contract':  { bg: 'rgba(249,115,22,0.1)', text: '#fb923c' },
  'part-time': { bg: 'rgba(14,165,233,0.1)', text: '#38bdf8' },
};


const Jobs: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const filtered = sampleJobs.filter(job => {
    const matchSearch = !search || job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase()) || job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === '전체' || job.type === typeFilter;
    return matchSearch && matchType;
  });

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleApply = (jobId: string) => {
    if (appliedIds.has(jobId)) return;
    setApplyLoading(true);
    setTimeout(() => {
      setAppliedIds(prev => new Set([...prev, jobId]));
      setApplyLoading(false);
    }, 1200);
  };

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: '28px 20px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: D.heading, margin: '0 0 6px', letterSpacing: '-0.6px' }}>
            채용 공고
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0 }}>
            {sampleJobs.length > 0 ? `${sampleJobs.length}개의 채용 공고가 있어요` : '새로운 기회를 찾아보세요'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: selectedJob ? 1100 : 800, margin: '0 auto', padding: '24px 20px 60px', display: 'flex', gap: 20, transition: 'max-width 0.3s ease', alignItems: 'flex-start' }}>
        {/* List */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Search */}
          <div style={{ display: 'flex', background: '#0f0f0f', borderRadius: 8, border: `1px solid ${D.border}`, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ padding: '0 14px', display: 'flex', alignItems: 'center' }}>
              <SearchIcon size={16} color={D.muted} />
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="직함, 회사, 기술 스택 검색..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: tokens.fontSizes.sm, color: D.heading, padding: '12px 0', background: 'transparent', fontFamily: 'inherit' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', display: 'flex', alignItems: 'center' }}>
                <CloseIcon size={14} color={D.muted} />
              </button>
            )}
          </div>
          {/* Type filter */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: 20, flexWrap: 'wrap', background: '#0a0a0a', border: `1px solid ${D.border}`, borderRadius: 10, padding: 4, width: 'fit-content' }}>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                style={{
                  border: 'none',
                  background: typeFilter === t ? '#1a1a1a' : 'transparent',
                  color: typeFilter === t ? D.heading : D.muted,
                  borderRadius: 7, padding: '6px 14px',
                  fontSize: tokens.fontSizes.xs, fontWeight: typeFilter === t ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: `all ${tokens.transitions.fast}`,
                  outline: typeFilter === t ? `1px solid ${D.border}` : 'none',
                }}
              >
                {TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: tokens.fontSizes.sm, color: D.muted }}>{filtered.length}개의 채용 공고</span>
            {savedIds.size > 0 && (
              <span style={{ fontSize: tokens.fontSizes.xs, color: '#5b9cf6', fontWeight: 600 }}>
                저장된 공고 {savedIds.size}개
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map(job => (
              <JobCard
                key={job.id}
                job={job}
                selected={selectedJob?.id === job.id}
                saved={savedIds.has(job.id)}
                applied={appliedIds.has(job.id)}
                onSelect={() => setSelectedJob(selectedJob?.id === job.id ? null : job)}
                onToggleSave={e => toggleSave(job.id, e)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: D.muted }}>
              <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 600, color: D.body, marginBottom: 6 }}>검색 결과가 없습니다</div>
              <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted }}>다른 검색어나 필터를 시도해보세요</div>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedJob && (
          <JobDetail
            job={selectedJob}
            saved={savedIds.has(selectedJob.id)}
            applied={appliedIds.has(selectedJob.id)}
            applyLoading={applyLoading}
            onClose={() => setSelectedJob(null)}
            onToggleSave={() => toggleSave(selectedJob.id)}
            onApply={() => handleApply(selectedJob.id)}
          />
        )}
      </div>
    </div>
  );
};

const JobCard: React.FC<{
  job: Job;
  selected: boolean;
  saved: boolean;
  applied: boolean;
  onSelect: () => void;
  onToggleSave: (e: React.MouseEvent) => void;
}> = ({ job, selected, saved, applied, onSelect, onToggleSave }) => {
  const [hovered, setHovered] = useState(false);
  const tc = TYPE_BADGE[job.type] ?? { bg: D.tag, text: D.body };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: selected ? 'rgba(0,112,243,0.04)' : D.card, borderRadius: 10, padding: '18px 20px',
        border: `1px solid ${selected ? 'rgba(0,112,243,0.35)' : hovered ? D.borderHover : D.border}`,
        cursor: 'pointer', transition: `all ${tokens.transitions.fast}`,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <img src={job.logo} alt={job.company} style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, border: `1px solid ${D.border}`, objectFit: 'cover' }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <div>
              <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading }}>{job.title}</div>
              <div style={{ fontSize: tokens.fontSizes.sm, color: D.body, marginTop: 1 }}>{job.company}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <button
                onClick={onToggleSave}
                style={{
                  background: saved ? 'rgba(0,112,243,0.1)' : 'none',
                  border: `1px solid ${saved ? 'rgba(0,112,243,0.3)' : D.border}`,
                  borderRadius: 7, padding: '5px 7px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', transition: `all ${tokens.transitions.fast}`,
                }}
              >
                <BookmarkIcon size={13} color={saved ? '#5b9cf6' : D.muted} filled={saved} />
              </button>
              {applied && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 999, padding: '3px 8px' }}>
                  <CheckIcon size={10} color="#10b981" /> 지원 완료
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
              <MapPinIcon size={11} color={D.muted} /> {job.location}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, background: tc.bg, color: tc.text, padding: '2px 8px', borderRadius: 999 }}>
              {TYPE_LABELS[job.type] ?? job.type}
            </span>
            {job.featured && (
              <span style={{ fontSize: 10, fontWeight: 600, background: 'rgba(234,179,8,0.12)', color: '#fbbf24', padding: '2px 8px', borderRadius: 999 }}>추천</span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{job.salary}</span>
          </div>
          <p style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '0 0 10px', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
            {job.tags.slice(0, 5).map(t => (
              <span key={t} style={{ background: D.tag, color: D.tagText, padding: '2px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{t}</span>
            ))}
            {job.tags.length > 5 && <span style={{ fontSize: 10, color: D.muted }}>+{job.tags.length - 5}</span>}
            <span style={{ marginLeft: 'auto', fontSize: 10, color: D.muted }}>{job.posted}</span>
          </div>
        </div>
      </div>
      {selected && (
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
          <ArrowRightIcon size={14} color={D.accent} />
        </div>
      )}
    </div>
  );
};

const JobDetail: React.FC<{
  job: Job;
  saved: boolean;
  applied: boolean;
  applyLoading: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  onApply: () => void;
}> = ({ job, saved, applied, applyLoading, onClose, onToggleSave, onApply }) => {
  const tc = TYPE_BADGE[job.type] ?? { bg: D.tag, text: D.body };

  return (
    <div style={{
      width: 400, flexShrink: 0, background: D.panel,
      border: `1px solid ${D.border}`, borderRadius: 14,
      position: 'sticky', top: 76, maxHeight: 'calc(100vh - 100px)',
      overflowY: 'auto', animation: 'slideIn 0.2s ease',
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${D.border}`, position: 'sticky', top: 0, background: D.panel, zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <img src={job.logo} alt={job.company} style={{ width: 52, height: 52, borderRadius: 12, border: `1px solid ${D.border}`, objectFit: 'cover' }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', color: D.muted }}>
            <CloseIcon size={16} color={D.muted} />
          </button>
        </div>
        <h2 style={{ fontSize: tokens.fontSizes.lg, fontWeight: 800, color: D.heading, margin: '0 0 4px', letterSpacing: '-0.4px', lineHeight: 1.3 }}>{job.title}</h2>
        <div style={{ fontSize: tokens.fontSizes.sm, color: D.body, marginBottom: 10 }}>{job.company}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: D.muted }}>
            <MapPinIcon size={11} color={D.muted} /> {job.location}
          </span>
          <span style={{ fontSize: 10, fontWeight: 600, background: tc.bg, color: tc.text, padding: '2px 8px', borderRadius: 999 }}>
            {TYPE_LABELS[job.type]}
          </span>
          {job.featured && <span style={{ fontSize: 10, fontWeight: 600, background: 'rgba(234,179,8,0.12)', color: '#fbbf24', padding: '2px 8px', borderRadius: 999 }}>추천</span>}
        </div>
      </div>

      {/* Salary + actions */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${D.border}` }}>
        <div style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, marginBottom: 14, letterSpacing: '-0.5px' }}>{job.salary}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={onApply}
            disabled={applied || applyLoading}
            style={{
              flex: 1, padding: '11px', borderRadius: 9, border: 'none',
              background: applied ? 'rgba(16,185,129,0.12)' : applyLoading ? 'rgba(0,112,243,0.6)' : '#0070f3',
              color: applied ? '#10b981' : '#fff',
              fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: applied ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: `all ${tokens.transitions.fast}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            {applied ? (
              <><CheckIcon size={14} color="#10b981" /> 지원 완료</>
            ) : applyLoading ? (
              <><ApplySpinner /> 지원 중...</>
            ) : (
              '지원하기'
            )}
          </button>
          <button
            onClick={onToggleSave}
            style={{
              padding: '11px 14px', borderRadius: 9, fontFamily: 'inherit',
              border: `1px solid ${saved ? 'rgba(0,112,243,0.4)' : D.border}`,
              background: saved ? D.accentDim : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
              color: saved ? '#5b9cf6' : D.body, fontSize: tokens.fontSizes.sm, fontWeight: 600,
              transition: `all ${tokens.transitions.fast}`,
            }}
          >
            <BookmarkIcon size={14} color={saved ? '#5b9cf6' : D.body} filled={saved} />
            {saved ? '저장됨' : '저장'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <DetailSection title="포지션 소개">
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0, lineHeight: 1.7 }}>{job.description}</p>
        </DetailSection>

        {job.tags.length > 0 && (
          <DetailSection title="기술 스택">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {job.tags.map(t => (
                <span key={t} style={{ background: D.tag, color: D.tagText, padding: '4px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>{t}</span>
              ))}
            </div>
          </DetailSection>
        )}

        <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, paddingTop: 4 }}>
          등록일: {job.posted}
        </div>
      </div>
    </div>
  );
};

const DetailSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 style={{ fontSize: tokens.fontSizes.xs, fontWeight: 700, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 10px' }}>{title}</h3>
    {children}
  </div>
);

const ApplySpinner: React.FC = () => (
  <span style={{
    width: 13, height: 13, borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', display: 'inline-block',
    animation: 'applySpin 0.7s linear infinite',
  }}>
    <style>{`@keyframes applySpin { to { transform: rotate(360deg); } }`}</style>
  </span>
);

export default Jobs;
