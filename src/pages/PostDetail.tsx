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

const PostDetail: React.FC<PostDetailProps> = ({ postId, profile: profileProp, onBack }) => {
  const profile = profileProp && profileProp.posts.length > 0 ? profileProp : defaultProfile;
  const post = profile.posts.find(p => p.id === postId) ?? profile.posts[0] ?? defaultProfile.posts[0];

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 80px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colors.textSecondary,
            fontSize: tokens.fontSizes.sm,
            cursor: 'pointer',
            padding: '0 0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          ← 뒤로
        </button>

        <div style={{
          background: tokens.colors.surface,
          borderRadius: tokens.borderRadius.xl,
          border: `1px solid ${tokens.colors.border}`,
          overflow: 'hidden',
          boxShadow: tokens.shadows.card,
        }}>
          {/* Post header */}
          <div style={{
            background: tokens.colors.navyGrad,
            padding: '32px 32px 28px',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 14 }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.9)',
                  padding: '3px 10px',
                  borderRadius: tokens.borderRadius.full,
                  fontSize: tokens.fontSizes.xs,
                  fontWeight: tokens.fontWeights.medium,
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 style={{
              fontSize: 'clamp(18px, 3vw, 26px)',
              fontWeight: tokens.fontWeights.extrabold,
              color: '#fff',
              margin: '0 0 16px',
              lineHeight: 1.3,
              letterSpacing: '-0.3px',
            }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.65)' }}>
                <HeartIcon size={13} color="rgba(255,255,255,0.65)" /> {post.likes}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.65)' }}>
                <EyeIcon size={13} color="rgba(255,255,255,0.65)" /> {post.views.toLocaleString()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.65)' }}>
                <ClockIcon size={13} color="rgba(255,255,255,0.65)" /> {post.readingTime}분 읽기
              </span>
              <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.65)' }}>{post.date}</span>
            </div>
          </div>

          {/* Author bar */}
          <div style={{
            padding: '16px 32px',
            borderBottom: `1px solid ${tokens.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <img src={profile.avatar} alt={profile.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
            <div>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{profile.name}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, display: 'flex', alignItems: 'center', gap: 4 }}>
                <LocationIcon size={11} color={tokens.colors.textMuted} />
                {profile.location}
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '28px 32px' }}>
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Footer */}
          <div style={{
            borderTop: `1px solid ${tokens.colors.border}`,
            padding: '16px 32px',
            display: 'flex',
            gap: 10,
          }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 16px',
              background: 'none',
              border: `1.5px solid ${tokens.colors.border}`,
              borderRadius: tokens.borderRadius.md,
              fontSize: tokens.fontSizes.sm,
              color: tokens.colors.textSecondary,
              cursor: 'pointer',
            }}>
              <HeartIcon size={15} color={tokens.colors.textSecondary} />
              {post.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
