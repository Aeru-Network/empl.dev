import React, { useState, useEffect } from 'react';
import { tokens } from '../tokens';
import { defaultProfile } from '../data/defaultData';
import type { Project, Post } from '../data/defaultData';
import {
  GithubIcon, EmailIcon, TwitterIcon, WebsiteIcon,
  LocationIcon, BriefcaseIcon, StarIcon, HeartIcon, EyeIcon, ClockIcon,
} from '../components/Icons';
import ProjectModal from '../components/ProjectModal';

interface ProfileProps {
  onPostClick: (postId: string) => void;
}

type MobileTab = '소개' | '경력' | '프로젝트' | '포스트';
const MOBILE_TABS: MobileTab[] = ['소개', '경력', '프로젝트', '포스트'];

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span style={{
    backgroundColor: tokens.colors.tag,
    color: tokens.colors.tagText,
    padding: '3px 10px',
    borderRadius: tokens.borderRadius.full,
    fontSize: tokens.fontSizes.xs,
    fontWeight: tokens.fontWeights.medium,
  }}>
    {label}
  </span>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; noPad?: boolean }> = ({ title, children, noPad }) => (
  <div style={{
    background: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    border: `1px solid ${tokens.colors.border}`,
    padding: noPad ? '22px 0' : '22px 24px',
    boxShadow: tokens.shadows.card,
  }}>
    <h2 style={{
      fontSize: tokens.fontSizes.md,
      fontWeight: tokens.fontWeights.bold,
      color: tokens.colors.textPrimary,
      margin: noPad ? '0 24px 16px' : '0 0 16px',
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const Profile: React.FC<ProfileProps> = ({ onPostClick }) => {
  const profile = defaultProfile;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<MobileTab | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const COVER_HEIGHT = isMobile ? 100 : 116;
  const AVATAR_SIZE = isMobile ? 76 : 92;
  const AVATAR_OFFSET = AVATAR_SIZE / 2;

  const visibleProjects = showAllProjects ? profile.projects : profile.projects.slice(0, 3);
  const visiblePosts = showAllPosts ? profile.posts : profile.posts.slice(0, 3);

  const socialIconMap: Record<string, React.ReactNode> = {
    github: <GithubIcon size={18} />,
    email: <EmailIcon size={18} />,
    twitter: <TwitterIcon size={18} />,
    website: <WebsiteIcon size={18} />,
  };

  /* ─── Header card (shared) ─── */
  const headerCard = (
    <div style={{
      background: tokens.colors.surface,
      borderRadius: isMobile ? 0 : tokens.borderRadius.xl,
      border: isMobile ? 'none' : `1px solid ${tokens.colors.border}`,
      boxShadow: isMobile ? 'none' : tokens.shadows.card,
      overflow: 'hidden',
      marginBottom: isMobile ? 0 : 16,
    }}>
      {/* Cover */}
      <div style={{ height: COVER_HEIGHT, background: tokens.colors.navyGrad, position: 'relative' }} />

      {/* Body */}
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 20px' }}>
        {/* Avatar */}
        <div style={{ marginTop: -AVATAR_OFFSET }}>
          <img
            src={profile.avatar}
            alt={profile.name}
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: '50%',
              border: `3px solid ${tokens.colors.surface}`,
              background: '#dbeafe',
              display: 'block',
              boxShadow: tokens.shadows.md,
            }}
          />
        </div>

        {/* Name + buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginTop: 10,
          gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: isMobile ? '20px' : tokens.fontSizes.xxl,
              fontWeight: tokens.fontWeights.extrabold,
              color: tokens.colors.textPrimary,
              margin: 0,
              letterSpacing: '-0.5px',
            }}>
              {profile.name}
            </h1>
            <p style={{
              fontSize: isMobile ? tokens.fontSizes.xs : tokens.fontSizes.sm,
              color: tokens.colors.textSecondary,
              margin: '4px 0 0',
              lineHeight: 1.4,
            }}>
              {profile.headline}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '7px', flexShrink: 0, marginTop: 2 }}>
            <button
              onClick={() => setFollowed(f => !f)}
              style={{
                padding: isMobile ? '6px 13px' : '7px 16px',
                borderRadius: tokens.borderRadius.md,
                fontSize: isMobile ? tokens.fontSizes.xs : tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
                border: followed ? 'none' : `1.5px solid ${tokens.colors.primary}`,
                backgroundColor: followed ? tokens.colors.primary : 'transparent',
                color: followed ? '#fff' : tokens.colors.primary,
                transition: `all ${tokens.transitions.fast}`,
                whiteSpace: 'nowrap',
              }}
            >
              {followed ? '팔로잉' : '팔로우'}
            </button>
            <button
              style={{
                padding: isMobile ? '6px 13px' : '7px 16px',
                borderRadius: tokens.borderRadius.md,
                fontSize: isMobile ? tokens.fontSizes.xs : tokens.fontSizes.sm,
                fontWeight: tokens.fontWeights.semibold,
                cursor: 'pointer',
                border: `1.5px solid ${tokens.colors.border}`,
                backgroundColor: 'transparent',
                color: tokens.colors.textSecondary,
                whiteSpace: 'nowrap',
              }}
            >
              메시지
            </button>
          </div>
        </div>

        {/* Followers */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <span style={{ fontSize: tokens.fontSizes.sm }}>
            <strong style={{ color: tokens.colors.primary, fontWeight: tokens.fontWeights.bold }}>
              {profile.followers.toLocaleString()}
            </strong>
            <span style={{ color: tokens.colors.textMuted, marginLeft: 4 }}>팔로워</span>
          </span>
          <span style={{ fontSize: tokens.fontSizes.sm }}>
            <strong style={{ color: tokens.colors.primary, fontWeight: tokens.fontWeights.bold }}>
              {profile.following.toLocaleString()}
            </strong>
            <span style={{ color: tokens.colors.textMuted, marginLeft: 4 }}>팔로잉</span>
          </span>
        </div>

        {/* Location + role */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary }}>
            <LocationIcon size={13} color={tokens.colors.textMuted} />
            {profile.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary }}>
            <BriefcaseIcon size={13} color={tokens.colors.textMuted} />
            {profile.role} · {profile.yearsOfExp}년 경력
          </span>
        </div>

        {/* Social links */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 14 }}>
          {profile.socialLinks.map(link => (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.type}
              style={{
                width: 34,
                height: 34,
                borderRadius: tokens.borderRadius.md,
                border: `1.5px solid ${tokens.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: tokens.colors.textSecondary,
                textDecoration: 'none',
                backgroundColor: 'transparent',
              }}
            >
              {socialIconMap[link.type]}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─── Desktop sections (all visible) ─── */
  const desktopSections = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <SectionCard title="소개">
        <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, lineHeight: 1.75, margin: 0 }}>
          {profile.bio}
        </p>
      </SectionCard>

      <SectionCard title="스킬">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {profile.skills.map(skill => <Tag key={skill} label={skill} />)}
        </div>
      </SectionCard>

      <SectionCard title="경력 · 학력">
        <TimelineContent profile={profile} />
      </SectionCard>

      <SectionCard title="프로젝트">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {visibleProjects.map(p => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
          ))}
        </div>
        <MoreButton
          show={profile.projects.length > 3}
          expanded={showAllProjects}
          count={profile.projects.length - 3}
          onToggle={() => setShowAllProjects(v => !v)}
        />
      </SectionCard>

      <SectionCard title="포스트">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visiblePosts.map(p => (
            <PostCard key={p.id} post={p} onClick={() => onPostClick(p.id)} />
          ))}
        </div>
        <MoreButton
          show={profile.posts.length > 3}
          expanded={showAllPosts}
          count={profile.posts.length - 3}
          onToggle={() => setShowAllPosts(v => !v)}
        />
      </SectionCard>
    </div>
  );

  /* ─── Mobile tab content ─── */
  const mobileTabContent: Record<MobileTab, React.ReactNode> = {
    '소개': (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '18px 16px', boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 10px' }}>소개</h2>
          <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, lineHeight: 1.75, margin: 0 }}>
            {profile.bio}
          </p>
        </div>
        <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '18px 16px', boxShadow: tokens.shadows.card }}>
          <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 12px' }}>스킬</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
            {profile.skills.map(skill => <Tag key={skill} label={skill} />)}
          </div>
        </div>
      </div>
    ),
    '경력': (
      <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '18px 16px', boxShadow: tokens.shadows.card }}>
        <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 16px' }}>경력 · 학력</h2>
        <TimelineContent profile={profile} />
      </div>
    ),
    '프로젝트': (
      <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '18px 16px', boxShadow: tokens.shadows.card }}>
        <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 14px' }}>프로젝트</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {visibleProjects.map(p => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelectedProject(p)} />
          ))}
        </div>
        <MoreButton
          show={profile.projects.length > 3}
          expanded={showAllProjects}
          count={profile.projects.length - 3}
          onToggle={() => setShowAllProjects(v => !v)}
        />
      </div>
    ),
    '포스트': (
      <div style={{ background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl, border: `1px solid ${tokens.colors.border}`, padding: '18px 16px', boxShadow: tokens.shadows.card }}>
        <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 14px' }}>포스트</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {visiblePosts.map(p => (
            <PostCard key={p.id} post={p} onClick={() => onPostClick(p.id)} />
          ))}
        </div>
        <MoreButton
          show={profile.posts.length > 3}
          expanded={showAllPosts}
          count={profile.posts.length - 3}
          onToggle={() => setShowAllPosts(v => !v)}
        />
      </div>
    ),
  };

  /* ─── Mobile tab bar ─── */
  const mobileTabBar = (
    <div style={{
      position: 'sticky',
      top: 56,
      zIndex: 50,
      background: tokens.colors.surface,
      borderBottom: `1px solid ${tokens.colors.border}`,
      display: 'flex',
    }}>
      {MOBILE_TABS.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(prev => prev === tab ? null : tab)}
          style={{
            flex: 1,
            padding: '13px 0',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === tab
              ? `2.5px solid ${tokens.colors.primary}`
              : '2.5px solid transparent',
            fontSize: '12px',
            fontWeight: activeTab === tab ? tokens.fontWeights.bold : tokens.fontWeights.medium,
            color: activeTab === tab ? tokens.colors.primary : tokens.colors.textMuted,
            cursor: 'pointer',
            transition: `all ${tokens.transitions.fast}`,
            letterSpacing: '-0.2px',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  /* ─── Render ─── */
  if (isMobile) {
    return (
      <div style={{ background: tokens.colors.background, minHeight: '100vh', paddingBottom: 40 }}>
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

        {/* Header card — always visible */}
        {headerCard}

        {/* Sticky tab bar */}
        {mobileTabBar}

        {/* Tab content — only shown when a tab is active */}
        {activeTab && (
          <div style={{ padding: '14px 12px' }}>
            {mobileTabContent[activeTab]}
          </div>
        )}

        {/* Empty state when no tab selected */}
        {!activeTab && (
          <div style={{
            padding: '32px 24px',
            textAlign: 'center',
          }}>
            <div style={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{
                display: 'flex',
                gap: '8px',
              }}>
                {MOBILE_TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: tokens.borderRadius.full,
                      border: `1.5px solid ${tokens.colors.border}`,
                      background: tokens.colors.surface,
                      fontSize: '11px',
                      fontWeight: tokens.fontWeights.semibold,
                      color: tokens.colors.textSecondary,
                      cursor: 'pointer',
                      boxShadow: tokens.shadows.xs,
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: 0 }}>
                탭을 선택해 프로필을 살펴보세요
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── Desktop layout ─── */
  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
        {headerCard}
        {desktopSections}
      </div>
    </div>
  );
};

/* ─── Sub-components ─── */

const TimelineContent: React.FC<{ profile: typeof defaultProfile }> = ({ profile }) => (
  <div style={{ position: 'relative' }}>
    <div style={{
      position: 'absolute',
      left: 4,
      top: 8,
      bottom: 8,
      width: 2,
      backgroundColor: tokens.colors.border,
      borderRadius: 1,
    }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {profile.experience.map(exp => (
        <div key={exp.id} style={{ display: 'flex', gap: '16px', paddingLeft: 4 }}>
          <div style={{ flexShrink: 0, marginTop: 5 }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: exp.type === 'work' ? tokens.colors.primary : tokens.colors.accent,
              position: 'relative',
              zIndex: 1,
              marginTop: 3,
            }} />
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{exp.title}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textSecondary, marginTop: 2 }}>{exp.organization}</div>
              </div>
              <span style={{
                fontSize: tokens.fontSizes.xs,
                color: tokens.colors.textMuted,
                backgroundColor: tokens.colors.surfaceAlt,
                padding: '2px 8px',
                borderRadius: tokens.borderRadius.full,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                {exp.period}
              </span>
            </div>
            <p style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: '6px 0 0', lineHeight: 1.6 }}>
              {exp.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MoreButton: React.FC<{
  show: boolean; expanded: boolean; count: number; onToggle: () => void;
}> = ({ show, expanded, count, onToggle }) => {
  if (!show) return null;
  return (
    <button
      onClick={onToggle}
      style={{
        marginTop: 14,
        width: '100%',
        padding: '9px',
        background: 'none',
        border: `1.5px solid ${tokens.colors.border}`,
        borderRadius: tokens.borderRadius.md,
        fontSize: tokens.fontSizes.sm,
        fontWeight: tokens.fontWeights.medium,
        color: tokens.colors.textSecondary,
        cursor: 'pointer',
      }}
    >
      {expanded ? '접기' : `더보기 (${count}개)`}
    </button>
  );
};

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: tokens.borderRadius.lg,
        border: `1.5px solid ${hovered ? tokens.colors.primary : tokens.colors.border}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: `all ${tokens.transitions.fast}`,
        boxShadow: hovered ? tokens.shadows.md : 'none',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      <div style={{
        height: 52,
        background: project.imageGradient,
        display: 'flex',
        alignItems: 'flex-end',
        padding: '0 12px 8px',
      }}>
        {project.stars != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarIcon size={12} color="#fbbf24" />
            <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.9)', fontWeight: tokens.fontWeights.medium }}>{project.stars}</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary, marginBottom: 4 }}>
          {project.title}
        </div>
        <p style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: '0 0 10px', lineHeight: 1.55 }}>
          {project.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {project.techStack.slice(0, 3).map(t => (
            <span key={t} style={{
              backgroundColor: tokens.colors.surfaceAlt,
              color: tokens.colors.textMuted,
              padding: '2px 7px',
              borderRadius: tokens.borderRadius.sm,
              fontSize: tokens.fontSizes.xs,
            }}>{t}</span>
          ))}
          {project.techStack.length > 3 && (
            <span style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, padding: '2px 0' }}>
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post; onClick: () => void }> = ({ post, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '13px',
        borderRadius: tokens.borderRadius.lg,
        border: `1.5px solid ${hovered ? tokens.colors.primary : tokens.colors.border}`,
        cursor: 'pointer',
        transition: `all ${tokens.transitions.fast}`,
        background: hovered ? tokens.colors.primaryLight : tokens.colors.surface,
      }}
    >
      <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary, marginBottom: 5, lineHeight: 1.4 }}>
        {post.title}
      </div>
      <p style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: '0 0 9px', lineHeight: 1.55 }}>
        {post.excerpt}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: 9 }}>
        {post.tags.map(tag => <Tag key={tag} label={tag} />)}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
          <HeartIcon size={12} color={tokens.colors.textMuted} /> {post.likes}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
          <EyeIcon size={12} color={tokens.colors.textMuted} /> {post.views.toLocaleString()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
          <ClockIcon size={12} color={tokens.colors.textMuted} /> {post.readingTime}분
        </span>
        <span style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginLeft: 'auto' }}>{post.date}</span>
      </div>
    </div>
  );
};

export default Profile;
