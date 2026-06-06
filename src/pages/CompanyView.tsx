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

const D = {
  bg: '#000000',
  card: '#0f0f0f',
  section: '#0a0a0a',
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

const CompanyView: React.FC<CompanyViewProps> = ({ company, onBack, onManage, onUpdate }) => {
  const [following, setFollowing] = useState(false);

  if (!company) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: tokens.fontSizes.md, color: D.body, marginBottom: 16 }}>회사를 찾을 수 없습니다.</p>
          <button onClick={onBack} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#fff', color: '#000', fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: 'pointer' }}>
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
    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.sm, color: D.body }}>
      {icon}{text}
    </span>
  );

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '20px 20px 80px' }}>
        <button
          onClick={onBack}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: D.body, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: '0 0 20px' }}
        >
          <ArrowLeftIcon size={16} color={D.body} /> 회사 목록
        </button>

        {/* Header card */}
        <div style={{
          background: D.card, borderRadius: 12,
          border: `1px solid ${D.border}`,
          overflow: 'hidden', marginBottom: 14,
        }}>
          {/* Cover */}
          <div style={{ height: 120, background: c.coverImage ? `url(${c.coverImage}) center/cover no-repeat` : c.coverGradient, position: 'relative', zIndex: 0, opacity: 0.7 }} />
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              {/* Logo */}
              {c.logoImage ? (
                <img src={c.logoImage} alt={c.name} style={{ marginTop: -36, position: 'relative', zIndex: 2, width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: `3px solid ${D.card}`, display: 'block' }} />
              ) : (
                <div style={{
                  marginTop: -36, position: 'relative', zIndex: 2,
                  width: 80, height: 80, borderRadius: 12, background: c.logoGradient,
                  border: `3px solid ${D.card}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 34,
                }}>
                  {c.name.trim()[0]}
                </div>
              )}
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                <button
                  onClick={toggleFollow}
                  style={{
                    padding: '8px 18px', borderRadius: 8, fontSize: tokens.fontSizes.sm,
                    fontWeight: 600, cursor: 'pointer',
                    border: `1px solid ${following ? D.border : 'transparent'}`,
                    background: following ? 'rgba(255,255,255,0.05)' : '#fff',
                    color: following ? D.body : '#000',
                    transition: `all ${tokens.transitions.fast}`,
                  }}
                >
                  {following ? '팔로잉' : '+ 팔로우'}
                </button>
                {c.isManaged && (
                  <button
                    onClick={() => onManage(c.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 8, fontSize: tokens.fontSizes.sm,
                      fontWeight: 600, cursor: 'pointer',
                      border: `1px solid ${D.border}`, background: 'none', color: D.body,
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}
                  >
                    <PencilIcon size={14} color={D.body} /> 페이지 관리
                  </button>
                )}
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(20px, 4vw, 32px)', fontWeight: 800, color: D.heading, margin: '12px 0 4px', letterSpacing: '-1px' }}>
              {c.name}
            </h1>
            <p style={{ fontSize: tokens.fontSizes.md, color: D.body, margin: '0 0 14px' }}>{c.tagline}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 10 }}>
              {metaRow(<BuildingIcon size={13} color={D.muted} />, c.industry)}
              {metaRow(<UsersIcon size={13} color={D.muted} />, c.size)}
              {metaRow(<LocationIcon size={13} color={D.muted} />, c.location)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              {c.website && (
                <a href={c.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.sm, color: '#5b9cf6', textDecoration: 'none', fontWeight: 500 }}>
                  <WebsiteIcon size={13} color="#5b9cf6" /> 웹사이트
                </a>
              )}
              <span style={{ fontSize: tokens.fontSizes.sm, color: D.muted }}>
                <strong style={{ color: D.body }}>{c.followers.toLocaleString()}</strong> 팔로워 · 설립 {c.founded}
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
                : <p key={i} style={{ fontSize: tokens.fontSizes.sm, color: D.body, lineHeight: 1.8, margin: '0 0 4px' }}>{line}</p>,
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
                  border: `1px solid ${D.border}`, borderRadius: 8,
                  padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                  background: D.section,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{o.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: D.muted, margin: '4px 0 10px' }}>
                      <MapPinIcon size={12} color={D.muted} /> {o.location}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {o.tags.map(t => (
                        <span key={t} style={{ background: D.tag, color: D.tagText, padding: '2px 8px', borderRadius: 999, fontSize: '10px', fontWeight: 500, border: `1px solid ${D.border}` }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <button style={{ flexShrink: 0, padding: '7px 16px', borderRadius: 7, border: `1px solid ${D.border}`, background: 'none', fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body, cursor: 'pointer' }}>
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
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${D.border}`, borderRadius: 8, padding: '10px 12px', background: D.section }}>
                  <img src={m.avatar} alt={m.name} style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{m.name}</div>
                    <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <BriefcaseIcon size={10} color={D.muted} /> {m.role}
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
  <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '22px 24px', marginBottom: 12 }}>
    <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: '0 0 14px', letterSpacing: '-0.3px' }}>{title}</h2>
    {children}
  </div>
);

const Empty: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, padding: '16px', textAlign: 'center', border: `1px dashed rgba(255,255,255,0.06)`, borderRadius: 8 }}>
    {text}
  </div>
);

export default CompanyView;
