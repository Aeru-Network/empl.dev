import React, { useState } from 'react';
import { tokens } from '../tokens';
import { type ProfileData } from '../data/defaultData';
import { HeartIcon, EyeIcon, ClockIcon, ArrowLeftIcon } from '../components/Icons';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface PostDetailProps {
  postId: string;
  profile: ProfileData | null;
  onBack: () => void;
}

const D = {
  bg: '#000', border: 'rgba(255,255,255,0.08)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', tag: 'rgba(255,255,255,0.07)', tagText: '#a1a1aa',
};

const PostDetail: React.FC<PostDetailProps> = ({ postId, profile, onBack }) => {
  const post = profile?.posts.find(p => p.id === postId) ?? null;
  const [liked, setLiked] = useState(false);

  if (!profile || !post) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: D.muted }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: D.body, marginBottom: 8 }}>포스트를 찾을 수 없습니다</div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#5b9cf6', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', fontWeight: 600 }}>← 돌아가기</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px 100px' }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none',
            color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: 0, marginBottom: 36,
            transition: `color ${tokens.transitions.fast}`,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = D.body)}
          onMouseLeave={e => (e.currentTarget.style.color = D.muted)}
        >
          <ArrowLeftIcon size={15} color="currentColor" /> 뒤로가기
        </button>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
          {post.tags.map(tag => (
            <span key={tag} style={{ background: D.tag, color: D.tagText, padding: '4px 11px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(26px, 4.5vw, 44px)', fontWeight: 800, color: D.heading,
          margin: '0 0 22px', lineHeight: 1.2, letterSpacing: '-1px',
        }}>
          {post.title}
        </h1>

        {/* Author + meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          paddingBottom: 24, marginBottom: 36, borderBottom: `1px solid ${D.border}`,
        }}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
              {profile.name?.[0] ?? '?'}
            </div>
          )}
          <div>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{profile.name}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{post.date}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
            <MetaChip icon={<ClockIcon size={13} color={D.muted} />} label={`${post.readingTime}분 읽기`} />
            <MetaChip icon={<EyeIcon size={13} color={D.muted} />} label={post.views.toLocaleString()} />
            <MetaChip icon={<HeartIcon size={13} color={D.muted} />} label={String(post.likes + (liked ? 1 : 0))} />
          </div>
        </div>

        {/* Content */}
        <MarkdownRenderer content={post.content} />

        {/* Footer */}
        <div style={{
          marginTop: 52, paddingTop: 28, borderTop: `1px solid ${D.border}`,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setLiked(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${liked ? 'rgba(239,68,68,0.4)' : D.border}`,
              background: liked ? 'rgba(239,68,68,0.08)' : 'transparent',
              color: liked ? '#f87171' : D.body,
              fontSize: tokens.fontSizes.sm, fontWeight: 600,
              transition: `all ${tokens.transitions.fast}`,
            }}
          >
            <HeartIcon size={15} color={liked ? '#f87171' : D.body} />
            {post.likes + (liked ? 1 : 0)} 좋아요
          </button>

          <div style={{ flex: 1 }} />

          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${D.border}`, background: 'transparent',
              color: D.muted, fontSize: tokens.fontSizes.sm, fontWeight: 500,
              transition: `all ${tokens.transitions.fast}`,
            }}
          >
            <ArrowLeftIcon size={14} color={D.muted} /> 목록으로
          </button>
        </div>

        {/* Author card */}
        <div style={{ marginTop: 40, padding: '22px 24px', borderRadius: 12, border: `1px solid ${D.border}`, background: '#0a0a0a', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 700, flexShrink: 0 }}>
              {profile.name?.[0] ?? '?'}
            </div>
          )}
          <div>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading, marginBottom: 4 }}>{profile.name}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, lineHeight: 1.6 }}>{profile.headline}</div>
            {profile.bio && <p style={{ fontSize: tokens.fontSizes.xs, color: D.muted, margin: '8px 0 0', lineHeight: 1.65 }}>{profile.bio.slice(0, 100)}{profile.bio.length > 100 ? '...' : ''}</p>}
          </div>
        </div>

      </div>
    </div>
  );
};

const MetaChip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: '#52525b' }}>
    {icon} {label}
  </span>
);

export default PostDetail;
