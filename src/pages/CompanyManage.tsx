import React, { useState, useRef } from 'react';
import { tokens } from '../tokens';
import { createEmptyCompany, type Company, type CompanyOpening } from '../data/defaultData';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckIcon } from '../components/Icons';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target!.result as string); r.readAsDataURL(file); });

interface CompanyManageProps {
  company: Company | null;
  onSave: (company: Company) => void;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const D = {
  bg: '#000000',
  card: '#0f0f0f',
  input: '#111111',
  inputBorder: 'rgba(255,255,255,0.10)',
  inputBorderFocus: 'rgba(255,255,255,0.25)',
  border: 'rgba(255,255,255,0.08)',
  heading: '#ffffff',
  body: '#a1a1aa',
  muted: '#52525b',
  accent: '#0070f3',
  accentDim: 'rgba(0,112,243,0.12)',
  error: '#ef4444',
  errorDim: 'rgba(239,68,68,0.1)',
};

const LOGO_GRADIENTS = [
  'linear-gradient(135deg, #1a56db 0%, #6366f1 100%)',
  'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #334155 0%, #64748b 100%)',
];

const SIZES = ['1-10명', '11-50명', '51-200명', '201-500명', '500명 이상'];

const labelStyle: React.CSSProperties = {
  fontSize: tokens.fontSizes.xs, fontWeight: 600,
  color: D.body, display: 'block', marginBottom: 6, letterSpacing: '0.2px',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: `1px solid ${D.inputBorder}`,
  borderRadius: 8, fontSize: tokens.fontSizes.sm,
  color: D.heading, outline: 'none', boxSizing: 'border-box',
  background: D.input, fontFamily: 'inherit',
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
  const [logoImage, setLogoImage] = useState<string | undefined>(base.logoImage);
  const [coverImage, setCoverImage] = useState<string | undefined>(base.coverImage);
  const [openings, setOpenings] = useState<CompanyOpening[]>(base.openings);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoImage(await fileToDataUrl(file));
    e.target.value = '';
  };

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(await fileToDataUrl(file));
    e.target.value = '';
  };

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
      about: about.trim(), logoGradient, logoImage, coverImage, openings: cleaned, isManaged: true,
    });
  };

  return (
    <div style={{ background: D.bg, minHeight: '100vh', padding: '20px 20px 80px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button
          onClick={onCancel}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: D.body, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: '0 0 20px' }}
        >
          <ArrowLeftIcon size={16} color={D.body} /> 취소
        </button>

        <h1 style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, color: D.heading, margin: '0 0 28px', letterSpacing: '-1px' }}>
          {isNew ? '회사 페이지 만들기' : '회사 페이지 관리'}
        </h1>

        {/* Basic info */}
        <Card title="기본 정보">
          {/* Cover image */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ ...labelStyle }}>커버 배너</div>
            <div
              onClick={() => coverInputRef.current?.click()}
              style={{
                height: 88, borderRadius: 10, border: `1px solid ${D.border}`, cursor: 'pointer',
                background: coverImage ? `url(${coverImage}) center/cover no-repeat` : (base.coverGradient || 'linear-gradient(135deg,#0f172a,#1a56db)'),
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.9)', fontWeight: 600, background: 'rgba(0,0,0,0.4)', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)' }}>
                  {coverImage ? '배너 변경' : '+ 배너 업로드'}
                </span>
              </div>
            </div>
            <input ref={coverInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverFile} />
            {coverImage && <button type="button" onClick={() => setCoverImage(undefined)} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: '4px 0 0' }}>배너 제거</button>}
          </div>

          {/* Logo preview + picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {logoImage ? (
                <img src={logoImage} alt="logo" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{
                  width: 64, height: 64, borderRadius: 12, background: logoGradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 28,
                }}>
                  {name.trim()[0] ?? 'A'}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {LOGO_GRADIENTS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => { setLogoGradient(g); setLogoImage(undefined); }}
                    style={{
                      width: 30, height: 30, borderRadius: 8, background: g, cursor: 'pointer',
                      border: (!logoImage && logoGradient === g) ? '2.5px solid #fff' : '2.5px solid transparent',
                      outline: 'none',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button type="button" onClick={() => logoInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}`, color: D.body, borderRadius: 7, padding: '5px 12px', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>
                  이미지 업로드
                </button>
                {logoImage && <button type="button" onClick={() => setLogoImage(undefined)} style={{ background: 'none', border: 'none', color: D.muted, fontSize: tokens.fontSizes.xs, cursor: 'pointer', padding: 0 }}>제거</button>}
              </div>
            </div>
            <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoFile} />
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
              <div key={o.id} style={{ border: `1px solid ${D.border}`, borderRadius: 8, padding: 14, background: '#0a0a0a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>채용 포지션</span>
                  <button onClick={() => removeOpening(o.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.error, display: 'flex', padding: 2 }}>
                    <TrashIcon size={14} color={D.error} />
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
                border: `1px dashed ${D.border}`, borderRadius: 8,
                background: 'none', color: D.body, fontSize: tokens.fontSizes.sm,
                fontWeight: 500, cursor: 'pointer',
              }}
            >
              <PlusIcon size={14} color={D.body} /> 채용 공고 추가
            </button>
          </div>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              flex: 1, padding: '13px', borderRadius: 9, border: 'none',
              background: canSave ? '#fff' : D.card,
              color: canSave ? '#000' : D.muted,
              fontSize: tokens.fontSizes.md, fontWeight: 700,
              cursor: canSave ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
            }}
          >
            <CheckIcon size={17} color={canSave ? '#000' : D.muted} /> {isNew ? '페이지 만들기' : '변경사항 저장'}
          </button>
          {!isNew && (
            <button
              onClick={() => onDelete(base.id)}
              style={{
                padding: '13px 18px', borderRadius: 9,
                border: `1px solid rgba(239,68,68,0.3)`, background: D.errorDim, color: D.error,
                fontSize: tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <TrashIcon size={15} color={D.error} /> 삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '22px 24px', marginBottom: 16 }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: '0 0 18px', letterSpacing: '-0.3px' }}>{title}</h2>
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
