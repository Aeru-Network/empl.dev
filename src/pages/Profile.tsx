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

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{
    background: tokens.colors.surface,
    borderRadius: tokens.borderRadius.xl,
    border: `1px solid ${tokens.colors.border}`,
    padding: '22px 24px',
    boxShadow: tokens.shadows.card,
  }}>
    <h2 style={{
      fontSize: tokens.fontSizes.md,
      fontWeight: tokens.fontWeights.bold,
      color: tokens.colors.textPrimary,
      margin: '0 0 16px',
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
  const [isMobile, setIsMobile] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const COVER_HEIGHT = isMobile ? 90 : 116;
  const AVATAR_SIZE = isMobile ? 72 : 92;
  const AVATAR_OFFSET = AVATAR_SIZE / 2;

  const visibleProjects = showAllProjects ? profile.projects : profile.projects.slice(0, 3);
  const visiblePosts = showAllPosts ? profile.posts : profile.posts.slice(0, 3);

  const socialIconMap: Record<string, React.ReactNode> = {
    github: <GithubIcon size={18} />,
    email: <EmailIcon size={18} />,
    twitter: <TwitterIcon size={18} />,
    website: <WebsiteIcon size={18} />,
  };

  return (
    <div style={{ background: tokens.colors.background, minHeight: '100vh' }}>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: isMobile ? '0 0 40px' : '24px 20px 60px' }}>

        {/* ─── Header Card ─── */}
        <div style={{
          background: tokens.colors.surface,
          borderRadius: isMobile ? 0 : tokens.borderRadius.xl,
          border: isMobile ? 'none' : `1px solid ${tokens.colors.border}`,
          boxShadow: isMobile ? 'none' : tokens.shadows.card,
          overflow: 'hidden',
          marginBottom: '16px',
        }}>
          {/* Cover */}
          <div style={{
            height: COVER_HEIGHT,
            background: tokens.colors.navyGrad,
            position: 'relative',
          }} />

          {/* Avatar row */}
          <div style={{ paddingLeft: isMobile ? 16 : 24, paddingRight: isMobile ? 16 : 24 }}>
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

            {/* Name / headline + buttons row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: 10,
              gap: 12,
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1 style={{
                  fontSize: isMobile ? tokens.fontSizes.xl : tokens.fontSizes.xxl,
                  fontWeight: tokens.fontWeights.extrabold,
                  color: tokens.colors.textPrimary,
                  margin: 0,
                  letterSpacing: '-0.5px',
                }}>
                  {profile.name}
                </h1>
                <p style={{
                  fontSize: tokens.fontSizes.sm,
                  color: tokens.colors.textSecondary,
                  margin: '4px 0 0',
                  lineHeight: 1.5,
                }}>
                  {profile.headline}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: isMobile ? 0 : 4 }}>
                <button
                  onClick={() => setFollowed(f => !f)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: tokens.borderRadius.md,
                    fontSize: tokens.fontSizes.sm,
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
                    padding: '7px 16px',
                    borderRadius: tokens.borderRadius.md,
                    fontSize: tokens.fontSizes.sm,
                    fontWeight: tokens.fontWeights.semibold,
                    cursor: 'pointer',
                    border: `1.5px solid ${tokens.colors.border}`,
                    backgroundColor: 'transparent',
                    color: tokens.colors.textSecondary,
                    transition: `background ${tokens.transitions.fast}`,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = tokens.colors.surfaceAlt)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  메시지
                </button>
              </div>
            </div>

            {/* Followers */}
            <div style={{ display: 'flex', gap: '16px', marginTop: 12 }}>
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
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: 10,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary }}>
                <LocationIcon size={14} color={tokens.colors.textMuted} />
                {profile.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary }}>
                <BriefcaseIcon size={14} color={tokens.colors.textMuted} />
                {profile.role} · {profile.yearsOfExp}년 경력
              </span>
            </div>

            {/* Social icon links */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 14, paddingBottom: 20 }}>
              {profile.socialLinks.map(link => (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.type}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: tokens.borderRadius.md,
                    border: `1.5px solid ${tokens.colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: tokens.colors.textSecondary,
                    textDecoration: 'none',
                    transition: `all ${tokens.transitions.fast}`,
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = tokens.colors.primary;
                    (e.currentTarget as HTMLAnchorElement).style.color = tokens.colors.primary;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = tokens.colors.border;
                    (e.currentTarget as HTMLAnchorElement).style.color = tokens.colors.textSecondary;
                  }}
                >
                  {socialIconMap[link.type]}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Sections wrapper ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: isMobile ? '0 12px' : '0' }}>

          {/* 소개 */}
          <SectionCard title="소개">
            <p style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, lineHeight: 1.75, margin: 0 }}>
              {profile.bio}
            </p>
          </SectionCard>

          {/* 스킬 */}
          <SectionCard title="스킬">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.skills.map(skill => (
                <Tag key={skill} label={skill} />
              ))}
            </div>
          </SectionCard>

          {/* 경력·학력 */}
          <SectionCard title="경력 · 학력">
            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: 7,
                top: 8,
                bottom: 8,
                width: 2,
                backgroundColor: tokens.colors.border,
                borderRadius: 1,
              }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {profile.experience.map(exp => (
                  <div key={exp.id} style={{ display: 'flex', gap: '16px', paddingLeft: 4 }}>
                    {/* Dot */}
                    <div style={{ flexShrink: 0, marginTop: 5 }}>
                      <div style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: exp.type === 'work' ? tokens.colors.primary : tokens.colors.accent,
                        border: `2.5px solid ${tokens.colors.surface}`,
                        boxShadow: `0 0 0 2px ${exp.type === 'work' ? tokens.colors.primary : tokens.colors.accent}`,
                        zIndex: 1,
                        position: 'relative',
                      }} />
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{exp.title}</div>
                          <div style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, marginTop: 2 }}>{exp.organization}</div>
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
          </SectionCard>

          {/* 프로젝트 */}
          <SectionCard title="프로젝트">
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
              {visibleProjects.map(project => (
                <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
              ))}
            </div>
            {profile.projects.length > 3 && (
              <button
                onClick={() => setShowAllProjects(v => !v)}
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
                  transition: `background ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = tokens.colors.surfaceAlt)}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {showAllProjects ? '접기' : `더보기 (${profile.projects.length - 3}개)`}
              </button>
            )}
          </SectionCard>

          {/* 포스트 */}
          <SectionCard title="포스트">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {visiblePosts.map(post => (
                <PostCard key={post.id} post={post} onClick={() => onPostClick(post.id)} />
              ))}
            </div>
            {profile.posts.length > 3 && (
              <button
                onClick={() => setShowAllPosts(v => !v)}
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
                  transition: `background ${tokens.transitions.fast}`,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = tokens.colors.surfaceAlt)}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {showAllPosts ? '접기' : `더보기 (${profile.posts.length - 3}개)`}
              </button>
            )}
          </SectionCard>

        </div>
      </div>
    </div>
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
      {/* Mini banner */}
      <div style={{
        height: 56,
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
            <span style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, padding: '2px 0' }}>+{project.techStack.length - 3}</span>
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
        padding: '14px',
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
      <p style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, margin: '0 0 10px', lineHeight: 1.55 }}>
        {post.excerpt}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: 10 }}>
        {post.tags.map(tag => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
          <HeartIcon size={12} color={tokens.colors.textMuted} /> {post.likes}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
          <EyeIcon size={12} color={tokens.colors.textMuted} /> {post.views.toLocaleString()}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted }}>
          <ClockIcon size={12} color={tokens.colors.textMuted} /> {post.readingTime}분
        </span>
        <span style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, marginLeft: 'auto' }}>{post.date}</span>
      </div>
    </div>
  );
};

export default Profile;
