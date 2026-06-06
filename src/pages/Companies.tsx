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

const CompanyLogo: React.FC<{ company: Company; size: number }> = ({ company, size }) => (
  <div style={{
    width: size, height: size, borderRadius: tokens.borderRadius.lg, background: company.logoGradient,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    color: '#fff', fontWeight: tokens.fontWeights.extrabold, fontSize: size * 0.4,
  }}>
    {company.name.trim()[0] ?? '?'}
  </div>
);

const Companies: React.FC<CompaniesProps> = ({ companies, onOpen, onCreate, onManage }) => {
  const managed = companies.filter(c => c.isManaged);
  const all = companies;

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: tokens.colors.navyGrad, padding: '40px 20px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            회사
          </h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
            기업 페이지를 탐색하고, 내 회사 페이지를 직접 관리하세요
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 60px' }}>
        {/* My managed pages */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: tokens.fontSizes.lg, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>
            내가 관리하는 페이지
          </h2>
          <button
            onClick={onCreate}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: tokens.borderRadius.md,
              border: 'none', background: tokens.colors.primary, color: '#fff',
              fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer',
            }}
          >
            <PlusIcon size={15} color="#fff" />
            새 페이지
          </button>
        </div>

        {managed.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 40 }}>
            {managed.map(c => (
              <div key={c.id} style={{
                background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl,
                border: `1px solid ${tokens.colors.border}`, padding: 18, boxShadow: tokens.shadows.card,
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <CompanyLogo company={c} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{c.name}</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 2 }}>{c.followers.toLocaleString()} 팔로워</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => onOpen(c.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: tokens.borderRadius.md, border: `1.5px solid ${tokens.colors.border}`, background: 'none', fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textSecondary, cursor: 'pointer' }}
                  >
                    보기
                  </button>
                  <button
                    onClick={() => onManage(c.id)}
                    style={{ flex: 1, padding: '8px', borderRadius: tokens.borderRadius.md, border: 'none', background: tokens.colors.primaryLight, color: tokens.colors.primary, fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                  >
                    <PencilIcon size={12} color={tokens.colors.primary} /> 관리
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px dashed ${tokens.colors.border}`,
            padding: '32px 20px', textAlign: 'center', marginBottom: 40,
          }}>
            <BuildingIcon size={28} color={tokens.colors.textMuted} />
            <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: '10px 0 14px' }}>
              아직 관리하는 회사 페이지가 없어요.
            </p>
            <button
              onClick={onCreate}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: tokens.borderRadius.md, border: 'none', background: tokens.colors.primary, color: '#fff', fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer' }}
            >
              <PlusIcon size={15} color="#fff" /> 회사 페이지 만들기
            </button>
          </div>
        )}

        {/* All companies */}
        <h2 style={{ fontSize: tokens.fontSizes.lg, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>
          기업 둘러보기
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {all.map(c => (
            <div
              key={c.id}
              onClick={() => onOpen(c.id)}
              style={{
                background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl,
                border: `1.5px solid ${tokens.colors.border}`, padding: '18px 20px', cursor: 'pointer',
                display: 'flex', gap: 16, alignItems: 'center', boxShadow: tokens.shadows.card,
                transition: `border-color ${tokens.transitions.fast}`,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = tokens.colors.primary)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = tokens.colors.border)}
            >
              <CompanyLogo company={c} size={52} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary }}>{c.name}</span>
                  {c.isManaged && (
                    <span style={{ fontSize: '10px', fontWeight: tokens.fontWeights.semibold, color: tokens.colors.primary, background: tokens.colors.primaryLight, padding: '2px 7px', borderRadius: tokens.borderRadius.full }}>관리자</span>
                  )}
                </div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary, margin: '3px 0 8px' }}>{c.tagline}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                    <BuildingIcon size={12} color={tokens.colors.textMuted} /> {c.industry}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                    <LocationIcon size={12} color={tokens.colors.textMuted} /> {c.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                    <UsersIcon size={12} color={tokens.colors.textMuted} /> {c.size}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.primary }}>{c.openings.length}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>채용중</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;
