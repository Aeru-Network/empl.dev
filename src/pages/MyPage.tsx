import React from 'react';
import { tokens } from '../tokens';
import { defaultProfile } from '../data/defaultData';
import { HeartIcon, EyeIcon, StarIcon, UsersIcon } from '../components/Icons';

type Page = 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage' | 'postDetail' | 'settings';

interface MyPageProps {
  onNavigate: (page: Page) => void;
}

const StatCard: React.FC<{ value: string | number; label: string; icon: React.ReactNode; color: string }> = ({ value, label, icon, color }) => (
  <div style={{
    background: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    border: `1px solid ${tokens.colors.border}`,
    padding: '20px',
    boxShadow: tokens.shadows.card,
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  }}>
    <div style={{
      width: 44,
      height: 44,
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: color + '18',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  </div>
);

const MyPage: React.FC<MyPageProps> = ({ onNavigate }) => {
  const profile = defaultProfile;
  const totalLikes = profile.posts.reduce((a, p) => a + p.likes, 0);
  const totalViews = profile.posts.reduce((a, p) => a + p.views, 0);
  const totalStars = profile.projects.reduce((a, p) => a + (p.stars ?? 0), 0);

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh', padding: '32px 20px 60px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: tokens.colors.surface,
          borderRadius: tokens.borderRadius.xl,
          border: `1px solid ${tokens.colors.border}`,
          padding: '24px',
          marginBottom: 20,
          boxShadow: tokens.shadows.card,
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}>
          <img src={profile.avatar} alt={profile.name} style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.extrabold, color: tokens.colors.textPrimary, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
              안녕하세요, {profile.name}님! 👋
            </h1>
            <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: 0 }}>{profile.headline}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button
              onClick={() => onNavigate('profile')}
              style={{
                padding: '8px 16px',
                background: tokens.colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: tokens.borderRadius.md,
                fontSize: tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
              }}
            >
              프로필 보기
            </button>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          marginBottom: 24,
        }}>
          <StatCard value={profile.followers.toLocaleString()} label="팔로워" icon={<UsersIcon size={20} color={tokens.colors.primary} />} color={tokens.colors.primary} />
          <StatCard value={totalLikes.toLocaleString()} label="총 좋아요" icon={<HeartIcon size={20} color="#f43f5e" />} color="#f43f5e" />
          <StatCard value={totalViews.toLocaleString()} label="총 조회수" icon={<EyeIcon size={20} color={tokens.colors.accent} />} color={tokens.colors.accent} />
          <StatCard value={totalStars.toLocaleString()} label="GitHub Stars" icon={<StarIcon size={20} color="#f59e0b" />} color="#f59e0b" />
        </div>

        {/* Recent posts */}
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '22px 24px', marginBottom: 16, boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>최근 포스트</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {profile.posts.slice(0, 3).map(post => (
              <div key={post.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.borderLight}`,
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.medium, color: tokens.colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</div>
                  <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginTop: 3 }}>{post.date}</div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                    <HeartIcon size={12} /> {post.likes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
                    <EyeIcon size={12} /> {post.views.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent projects */}
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '22px 24px', boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>내 프로젝트</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {profile.projects.slice(0, 3).map(proj => (
              <div key={proj.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderRadius: tokens.borderRadius.lg,
                border: `1px solid ${tokens.colors.borderLight}`,
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: tokens.borderRadius.md, background: proj.imageGradient, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.medium, color: tokens.colors.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proj.title}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'nowrap', overflow: 'hidden' }}>
                      {proj.techStack.slice(0, 2).map(t => (
                        <span key={t} style={{ fontSize: '10px', backgroundColor: tokens.colors.tag, color: tokens.colors.tagText, padding: '1px 6px', borderRadius: tokens.borderRadius.full, whiteSpace: 'nowrap' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {proj.stars != null && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, flexShrink: 0 }}>
                    <StarIcon size={12} color="#f59e0b" /> {proj.stars}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
