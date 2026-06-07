import React from 'react';
import { tokens } from '../tokens';
import type { Company } from '../data/defaultData';
import { PlusIcon, PencilIcon, BuildingIcon, LocationIcon, UsersIcon } from '../components/Icons';

interface CompaniesProps {
  companies: Company[];
  onOpen: (id: string) => void;
  onCreate: () => void;
  onManage: (id: string) => void;
}

const D = {
  bg: '#000000',
  card: '#0f0f0f',
  cardHover: '#161616',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.18)',
  heading: '#ffffff',
  body: '#a1a1aa',
  muted: '#52525b',
  accent: '#0070f3',
  accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)',
  tagText: '#a1a1aa',
};

const CompanyLogo: React.FC<{ company: Company; size: number }> = ({ company, size }) => (
  company.logoImage ? (
    <img src={company.logoImage} alt={company.name} style={{ width: size, height: size, borderRadius: 10, objectFit: 'cover', display: 'block', flexShrink: 0 }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: 10, background: company.logoGradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      color: '#fff', fontWeight: 800, fontSize: size * 0.4,
    }}>
      {company.name.trim()[0] ?? '?'}
    </div>
  )
);

const Companies: React.FC<CompaniesProps> = ({ companies, onOpen, onCreate, onManage }) => {
  const managed = companies.filter(c => c.isManaged);
  const all = companies;

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${D.border}`, padding: '28px 20px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: D.heading, margin: '0 0 6px', letterSpacing: '-0.6px' }}>
            회사
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: 0 }}>
              기업을 탐색하고 채용 소식을 확인하세요
            </p>
            <button
              onClick={onCreate}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, flexShrink: 0,
                border: `1px solid ${D.border}`, background: D.card, color: D.heading,
                fontSize: tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer',
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
            >
              <PlusIcon size={14} color={D.heading} />
              새 회사 만들기
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* My managed pages */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: 0, letterSpacing: '-0.3px' }}>
            내가 관리하는 페이지
          </h2>
        </div>

        {managed.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, marginBottom: 48 }}>
            {managed.map(c => (
              <div key={c.id} style={{
                background: D.card, borderRadius: 10,
                border: `1px solid ${D.border}`, padding: 18,
                display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <CompanyLogo company={c} size={46} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{c.name}</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 3 }}>{c.followers.toLocaleString()} 팔로워</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onOpen(c.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: 7, border: `1px solid ${D.border}`, background: 'none', fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, cursor: 'pointer' }}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => onManage(c.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: 7, border: `1px solid ${D.border}`, background: D.accentDim, color: '#5b9cf6', fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                  >
                    <PencilIcon size={12} color="#5b9cf6" /> 관리
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: D.card, borderRadius: 10, border: `1px dashed ${D.border}`,
            padding: '40px 20px', textAlign: 'center', marginBottom: 48,
          }}>
            <BuildingIcon size={26} color={D.muted} />
            <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '10px 0 16px' }}>
              아직 관리하는 회사 페이지가 없어요.
            </p>
            <button
              onClick={onCreate}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: 'pointer' }}
            >
              <PlusIcon size={14} color="#000" /> 회사 페이지 만들기
            </button>
          </div>
        )}

        {/* All companies */}
        <h2 style={{ fontSize: tokens.fontSizes.lg, fontWeight: 700, color: D.heading, margin: '0 0 18px', letterSpacing: '-0.3px' }}>
          기업 둘러보기
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {all.map(c => (
            <div
              key={c.id}
              onClick={() => onOpen(c.id)}
              style={{
                background: D.card, borderRadius: 10,
                border: `1px solid ${D.border}`, padding: '18px 20px', cursor: 'pointer',
                display: 'flex', gap: 16, alignItems: 'center',
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
            >
              <CompanyLogo company={c} size={50} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading }}>{c.name}</span>
                  {c.isManaged && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#5b9cf6', background: D.accentDim, padding: '2px 7px', borderRadius: 999, border: `1px solid rgba(0,112,243,0.2)` }}>관리자</span>
                  )}
                </div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, marginBottom: 10 }}>{c.tagline}</div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
                    <BuildingIcon size={11} color={D.muted} /> {c.industry}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
                    <LocationIcon size={11} color={D.muted} /> {c.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: D.muted }}>
                    <UsersIcon size={11} color={D.muted} /> {c.size}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading }}>{c.openings.length}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}>채용중</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
