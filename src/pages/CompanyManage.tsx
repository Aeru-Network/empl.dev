import React, { useState } from 'react';
import { tokens } from '../tokens';
import { createEmptyCompany, type Company, type CompanyOpening } from '../data/defaultData';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon } from '../components/Icons';

interface CompanyManageProps {
  company: Company | null; // null = create new
  onSave: (company: Company) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const LOGO_GRADIENTS = [
  'linear-gradient(135deg, #1a56db 0%, #6366f1 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
];

const SIZES = ['1-10명', '11-50명', '51-200명', '201-500명', '500명 이상'];

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold,
  color: tokens.colors.textSecondary, display: 'block', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1.5px solid ${tokens.colors.border}`,
  borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm,
  color: tokens.colors.textPrimary, outline: 'none', boxSizing: 'border-box',
  background: tokens.colors.surface, fontFamily: 'inherit',
};

const CompanyManage: React.FC<CompanyManageProps> = ({ company, onSave, onDelete, onCancel }) => {
  const base = company ?? createEmptyCompany();
  const isNew = company === null;

  const [name, setName] = useState(base.name);
  const [tagline, setTagline] = useState(base.tagline);
  const [industry, setIndustry] = useState(base.industry);
  const [size, setSize] = useState(base.size);
  const [location, setLocation] = useState(base.location);
  const [website, setWebsite] = useState(base.website);
  const [founded, setFounded] = useState(base.founded);
  const [about, setAbout] = useState(base.about);
  const [logoGradient, setLogoGradient] = useState(base.logoGradient);
  const [openings, setOpenings] = useState<CompanyOpening[]>(base.openings);

  const canSave = name.trim().length > 0;

  const addOpening = () => {
    setOpenings(prev => [...prev, { id: 'co-' + Date.now(), title: '', location: '', type: 'full-time', tags: [] }]);
  };
  const updateOpening = (id: string, patch: Partial<CompanyOpening>) => {
    setOpenings(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
  };
  const removeOpening = (id: string) => setOpenings(prev => prev.filter(o => o.id !== id));

  const handleSave = () => {
    if (!canSave) return;
    const cleaned = openings.filter(o => o.title.trim());
    onSave({
      ...base,
      name: name.trim(), tagline: tagline.trim(), industry: industry.trim(),
      size, location: location.trim(), website: website.trim(), founded: founded.trim(),
      about: about.trim(), logoGradient, openings: cleaned, isManaged: true,
    });
  };

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh', padding: '20px 20px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button
          onClick={onCancel}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: tokens.colors.textSecondary, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: '0 0 16px' }}
        >
          <ArrowLeftIcon size={16} color={tokens.colors.textSecondary} /> 취소
        </button>

        <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 20px', letterSpacing: '-0.5px' }}>
          {isNew ? '회사 페이지 만들기' : '회사 페이지 관리'}
        </h1>

        {/* Basic info */}
        <Card title="기본 정보">
          {/* Logo preview + picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: tokens.borderRadius.xl, background: logoGradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              color: '#fff', fontWeight: tokens.fontWeights.extrabold, fontSize: 28,
            }}>
              {name.trim()[0] ?? 'A'}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {LOGO_GRADIENTS.map(g => (
                <button
                  key={g}
                  onClick={() => setLogoGradient(g)}
                  style={{
                    width: 28, height: 28, borderRadius: tokens.borderRadius.md, background: g, cursor: 'pointer',
                    border: logoGradient === g ? `2.5px solid ${tokens.colors.primary}` : `2.5px solid transparent`,
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="회사명 *"><input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="예: Aeru" /></Field>
            <Field label="한 줄 소개"><input style={inputStyle} value={tagline} onChange={e => setTagline(e.target.value)} placeholder="예: 개발자를 위한 차세대 협업 플랫폼" /></Field>
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="산업"><input style={inputStyle} value={industry} onChange={e => setIndustry(e.target.value)} placeholder="예: 소프트웨어" /></Field>
              <div style={{ width: 150 }}>
                <label style={labelStyle}>규모</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={size} onChange={e => setSize(e.target.value)}>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Field label="위치"><input style={inputStyle} value={location} onChange={e => setLocation(e.target.value)} placeholder="예: 서울 강남구" /></Field>
              <div style={{ width: 110 }}>
                <Field label="설립연도"><input style={inputStyle} value={founded} onChange={e => setFounded(e.target.value.replace(/[^0-9]/g, ''))} placeholder="2021" inputMode="numeric" /></Field>
              </div>
            </div>
            <Field label="웹사이트"><input style={inputStyle} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://example.com" /></Field>
            <Field label="회사 소개">
              <textarea style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, minHeight: 90 }} value={about} onChange={e => setAbout(e.target.value)} rows={4} placeholder="회사를 소개해 주세요." />
            </Field>
          </div>
        </Card>

        {/* Openings */}
        <Card title="채용 공고">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {openings.map(o => (
              <div key={o.id} style={{ border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.borderRadius.lg, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textMuted }}>채용 포지션</span>
                  <button onClick={() => removeOpening(o.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.colors.error, display: 'flex', padding: 2 }}>
                    <TrashIcon size={14} color={tokens.colors.error} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input style={inputStyle} value={o.title} onChange={e => updateOpening(o.id, { title: e.target.value })} placeholder="직함 (예: Frontend Engineer)" />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={{ ...inputStyle, flex: 1 }} value={o.location} onChange={e => updateOpening(o.id, { location: e.target.value })} placeholder="위치 (예: 서울 · 원격)" />
                    <select style={{ ...inputStyle, width: 120, cursor: 'pointer' }} value={o.type} onChange={e => updateOpening(o.id, { type: e.target.value })}>
                      <option value="full-time">정규직</option>
                      <option value="contract">계약직</option>
                      <option value="remote">원격</option>
                      <option value="part-time">파트타임</option>
                    </select>
                  </div>
                  <input
                    style={inputStyle}
                    value={o.tags.join(', ')}
                    onChange={e => updateOpening(o.id, { tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                    placeholder="기술 스택 (쉼표로 구분: React, TypeScript)"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addOpening}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px',
                border: `1.5px dashed ${tokens.colors.border}`, borderRadius: tokens.borderRadius.md,
                background: 'none', color: tokens.colors.textSecondary, fontSize: tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.medium, cursor: 'pointer',
              }}
            >
              <PlusIcon size={15} color={tokens.colors.textSecondary} /> 채용 공고 추가
            </button>
          </div>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              flex: 1, padding: '12px', borderRadius: tokens.borderRadius.lg, border: 'none',
              background: canSave ? tokens.colors.primary : tokens.colors.border, color: '#fff',
              fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold,
              cursor: canSave ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            <CheckIcon size={17} color="#fff" /> {isNew ? '페이지 만들기' : '변경사항 저장'}
          </button>
          {!isNew && (
            <button
              onClick={() => onDelete(base.id)}
              style={{
                padding: '12px 18px', borderRadius: tokens.borderRadius.lg,
                border: `1.5px solid ${tokens.colors.error}`, background: 'none', color: tokens.colors.error,
                fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <TrashIcon size={15} color={tokens.colors.error} /> 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '22px 24px', boxShadow: tokens.shadows.card, marginBottom: 16 }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>{title}</h2>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ flex: 1 }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

export default CompanyManage;
