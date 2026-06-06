import React from 'react';
import { tokens } from '../tokens';
import { defaultProfile, type ProfileData } from '../data/defaultData';
import { HeartIcon, EyeIcon, ClockIcon, LocationIcon } from '../components/Icons';
import MarkdownRenderer from '../components/MarkdownRenderer';

interface PostDetailProps {
  postId: string;
  profile: ProfileData | null;
  onBack: () => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', border: 'rgba(255,255,255,0.08)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
};

const PostDetail: React.FC<PostDetailProps> = ({ postId, profile: profileProp, onBack }) => {
  const profile = profileProp && profileProp.posts.length > 0 ? profileProp : defaultProfile;
  const post = profile.posts.find(p => p.id === postId) ?? profile.posts[0] ?? defaultProfile.posts[0];

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 80px' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: D.body, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: '0 0 24px', display: 'flex', alignItems: 'center', gap: 4 }}>
          ← 뒤로
        </button>

        <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, overflow: 'hidden' }}>
          {/* Post header */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)', padding: '32px 32px 28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 14 }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', padding: '3px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
            <h1 style={{ fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.3, letterSpacing: '-0.3px' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.6)' }}>
                <HeartIcon size={12} color="rgba(255,255,255,0.6)" /> {post.likes}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.6)' }}>
                <EyeIcon size={12} color="rgba(255,255,255,0.6)" /> {post.views.toLocaleString()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.6)' }}>
                <ClockIcon size={12} color="rgba(255,255,255,0.6)" /> {post.readingTime}분 읽기
              </span>
              <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.6)' }}>{post.date}</span>
            </div>
          </div>

          {/* Author bar */}
          <div style={{ padding: '14px 32px', borderBottom: `1px solid ${D.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={profile.avatar} alt={profile.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{profile.name}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, display: 'flex', alignItems: 'center', gap: 4 }}>
                <LocationIcon size={10} color={D.muted} /> {profile.location}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '28px 32px' }}>
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Footer */}
          <div style={{ borderTop: `1px solid ${D.border}`, padding: '16px 32px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'none', border: `1px solid ${D.border}`, borderRadius: 8, fontSize: tokens.fontSizes.sm, color: D.body, cursor: 'pointer' }}>
              <HeartIcon size={14} color={D.body} /> {post.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
