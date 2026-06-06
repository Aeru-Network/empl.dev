import React, { useState } from 'react';
import { tokens } from '../tokens';
import type { Company } from '../data/defaultData';
import {
  ArrowLeftIcon, PencilIcon, BuildingIcon, LocationIcon, UsersIcon,
  WebsiteIcon, MapPinIcon, BriefcaseIcon,
} from '../components/Icons';

interface CompanyViewProps {
  company: Company | null;
  onBack: () => void;
  onManage: (id: string) => void;
  onUpdate: (company: Company) => void;
}

const CompanyView: React.FC<CompanyViewProps> = ({ company, onBack, onManage, onUpdate }) => {
  const [following, setFollowing] = useState(false);

  if (!company) {
    return (
      <div style={{ background: tokens.colors.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: tokens.fontSizes.md, color: tokens.colors.textSecondary, marginBottom: 14 }}>회사를 찾을 수 없습니다.</p>
          <button onClick={onBack} style={{ padding: '9px 18px', borderRadius: tokens.borderRadius.md, border: 'none', background: tokens.colors.primary, color: '#fff', fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer' }}>
            회사 목록으로
          </button>
        </div>
      </div>
    );
  }

  const c = company;

  const toggleFollow = () => {
    setFollowing(f => !f);
    onUpdate({ ...c, followers: c.followers + (following ? -1 : 1) });
  };

  const metaRow = (icon: React.ReactNode, text: string) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary }}>
      {icon}{text}
    </span>
  );

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 20px 60px' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: tokens.colors.textSecondary, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: '0 0 16px' }}
        >
          <ArrowLeftIcon size={16} color={tokens.colors.textSecondary} /> 회사 목록
        </button>

        {/* Header card */}
        <div style={{
          background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl,
          border: `1px solid ${tokens.colors.border}`, boxShadow: tokens.shadows.card,
          overflow: 'hidden', marginBottom: 16,
        }}>
          <div style={{ height: 120, background: c.coverGradient, position: 'relative', zIndex: 0 }} />
          <div style={{ padding: '0 24px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              {/* Logo */}
              <div style={{
                marginTop: -36, position: 'relative', zIndex: 2,
                width: 80, height: 80, borderRadius: tokens.borderRadius.xl, background: c.logoGradient,
                border: `3px solid ${tokens.colors.surface}`, boxShadow: tokens.shadows.md,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: tokens.fontWeights.extrabold, fontSize: 34,
              }}>
                {c.name.trim()[0]}
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <button
                  onClick={toggleFollow}
                  style={{
                    padding: '8px 18px', borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm,
                    fontWeight: tokens.fontWeights.semibold, cursor: 'pointer',
                    border: following ? `1.5px solid ${tokens.colors.border}` : 'none',
                    background: following ? 'transparent' : tokens.colors.primary,
                    color: following ? tokens.colors.textSecondary : '#fff',
                  }}
                >
                  {following ? '팔로잉' : '+ 팔로우'}
                </button>
                {c.isManaged && (
                  <button
                    onClick={() => onManage(c.id)}
                    style={{
                      padding: '8px 16px', borderRadius: tokens.borderRadius.md, fontSize: tokens.fontSizes.sm,
                      fontWeight: tokens.fontWeights.semibold, cursor: 'pointer',
                      border: `1.5px solid ${tokens.colors.primary}`, background: 'transparent', color: tokens.colors.primary,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <PencilIcon size={14} color={tokens.colors.primary} /> 페이지 관리
                  </button>
                )}
              </div>
            </div>

            <h1 style={{ fontSize: tokens.fontSizes.xxl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '10px 0 4px', letterSpacing: '-0.5px' }}>
              {c.name}
            </h1>
            <p style={{ fontSize: tokens.fontSizes.md, color: tokens.colors.textSecondary, margin: '0 0 12px' }}>{c.tagline}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 8 }}>
              {metaRow(<BuildingIcon size={14} color={tokens.colors.textMuted} />, c.industry)}
              {metaRow(<UsersIcon size={14} color={tokens.colors.textMuted} />, c.size)}
              {metaRow(<LocationIcon size={14} color={tokens.colors.textMuted} />, c.location)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
              {c.website && (
                <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.sm, color: tokens.colors.primary, textDecoration: 'none', fontWeight: tokens.fontWeights.medium }}>
                  <WebsiteIcon size={14} color={tokens.colors.primary} /> 웹사이트
                </a>
              )}
              <span style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted }}>
                <strong style={{ color: tokens.colors.primary }}>{c.followers.toLocaleString()}</strong> 팔로워 · 설립 {c.founded}
              </span>
            </div>
          </div>
        </div>

        {/* About */}
        <Section title="회사 소개">
          {c.about ? (
            c.about.split('\n').map((line, i) =>
              line.trim() === ''
                ? <div key={i} style={{ height: 8 }} />
                : <p key={i} style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, lineHeight: 1.75, margin: '0 0 4px' }}>{line}</p>,
            )
          ) : (
            <Empty text="회사 소개가 아직 없어요." />
          )}
        </Section>

        {/* Openings */}
        <Section title={`채용중 (${c.openings.length})`}>
          {c.openings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {c.openings.map(o => (
                <div key={o.id} style={{
                  border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.borderRadius.lg,
                  padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{o.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: '3px 0 8px' }}>
                      <MapPinIcon size={12} color={tokens.colors.textMuted} /> {o.location}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {o.tags.map(t => (
                        <span key={t} style={{ backgroundColor: tokens.colors.tag, color: tokens.colors.tagText, padding: '2px 8px', borderRadius: tokens.borderRadius.full, fontSize: '10px', fontWeight: tokens.fontWeights.medium }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <button style={{ flexShrink: 0, padding: '7px 16px', borderRadius: tokens.borderRadius.md, border: `1.5px solid ${tokens.colors.border}`, background: 'none', fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textSecondary, cursor: 'pointer' }}>
                    지원하기
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="현재 채용중인 포지션이 없어요." />
          )}
        </Section>

        {/* Members */}
        <Section title={`구성원 (${c.members.length})`}>
          {c.members.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {c.members.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.borderRadius.lg, padding: '10px 12px' }}>
                  <img src={m.avatar} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{m.name}</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BriefcaseIcon size={11} color={tokens.colors.textMuted} /> {m.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty text="등록된 구성원이 없어요." />
          )}
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '22px 24px', boxShadow: tokens.shadows.card, marginBottom: 14 }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 14px' }}>{title}</h2>
    {children}
  </div>
);

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textMuted, padding: '14px', textAlign: 'center', border: `1px dashed ${tokens.colors.border}`, borderRadius: tokens.borderRadius.lg, background: tokens.colors.surfaceAlt }}>
    {text}
  </div>
);

export default CompanyView;
