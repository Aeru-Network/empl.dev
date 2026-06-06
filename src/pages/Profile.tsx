import React, { useState, useEffect } from 'react';
import { tokens } from '../tokens';
import type { ProfileData, Project, Post } from '../data/defaultData';
import {
  GithubIcon, EmailIcon, TwitterIcon, WebsiteIcon,
  LocationIcon, BriefcaseIcon, StarIcon, HeartIcon, EyeIcon, ClockIcon,
  UserIcon, PencilIcon, SparklesIcon, PlusIcon, TrashIcon,
} from '../components/Icons';
import ProjectModal from '../components/ProjectModal';
import FollowListModal, { type FollowTab } from '../components/FollowListModal';

interface ProfileProps {
  profile: ProfileData | null;
  onPostClick: (postId: string) => void;
  onInitialize: () => void;
  onEdit: () => void;
  onUpdateProfile: (p: ProfileData) => void;
  onNewPost: () => void;
  onEditPost: (postId: string) => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', section: '#0a0a0a',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.18)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
};

type MobileTab = '소개' | '경력' | '프로젝트' | '포스트';
const MOBILE_TABS: MobileTab[] = ['소개', '경력', '프로젝트', '포스트'];

const Tag: React.FC<{ label: string }> = ({ label }) => (
  <span style={{ background: D.tag, color: D.tagText, padding: '3px 10px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
    {label}
  </span>
);

const SectionCard: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div style={{ background: D.card, borderRadius: 12, border: `1px solid ${D.border}`, padding: '22px 24px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 16px' }}>
      <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: 0 }}>{title}</h2>
      {action}
    </div>
    {children}
  </div>
);

const EmptyHint: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, padding: '14px', textAlign: 'center', border: `1px dashed ${D.border}`, borderRadius: 8 }}>
    {text}
  </div>
);

const Profile: React.FC<ProfileProps> = ({ profile, onPostClick, onInitialize, onEdit, onUpdateProfile, onNewPost, onEditPost }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [activeTab, setActiveTab] = useState<MobileTab | null>(null);
  const [followModal, setFollowModal] = useState<FollowTab | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const isEmpty = !profile || !profile.name.trim();
  if (isEmpty) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '80px 20px' }}>
        <div style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, maxWidth: 440, width: '100%', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: D.accentDim, border: `1px solid rgba(0,112,243,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <UserIcon size={26} color={D.accent} />
          </div>
          <h1 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 800, color: D.heading, margin: '0 0 10px', letterSpacing: '-0.4px' }}>프로필을 설정해 주세요</h1>
          <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 24px', lineHeight: 1.65 }}>
            아직 프로필이 비어 있어요. 이름, 기술 스택, 경력을 입력하고<br />나만의 개발자 프로필을 완성해 보세요.
          </p>
          <button onClick={onInitialize} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#fff', color: '#000', border: 'none', borderRadius: 9, fontSize: tokens.fontSizes.md, fontWeight: 700, cursor: 'pointer' }}>
            <SparklesIcon size={17} color="#000" /> 프로필 시작하기
          </button>
        </div>
      </div>
    );
  }

  const p = profile;
  const COVER_HEIGHT = isMobile ? 100 : 120;
  const AVATAR_SIZE = isMobile ? 76 : 92;
  const AVATAR_OFFSET = AVATAR_SIZE / 2;

  const visibleProjects = showAllProjects ? p.projects : p.projects.slice(0, 3);
  const visiblePosts = showAllPosts ? p.posts : p.posts.slice(0, 3);

  const socialIconMap: Record<string, React.ReactNode> = {
    github: <GithubIcon size={17} />, email: <EmailIcon size={17} />,
    twitter: <TwitterIcon size={17} />, website: <WebsiteIcon size={17} />,
    linkedin: <WebsiteIcon size={17} />,
  };

  const coverBg = p.banner
    ? `url(${p.banner}) center/cover no-repeat`
    : 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1a56db 100%)';

  /* Header card */
  const headerCard = (
    <div style={{
      background: D.card,
      borderRadius: isMobile ? 0 : 12,
      border: isMobile ? 'none' : `1px solid ${D.border}`,
      overflow: 'hidden', marginBottom: isMobile ? 0 : 14,
    }}>
      <div style={{ height: COVER_HEIGHT, background: coverBg, position: 'relative', zIndex: 0 }} />
      <div style={{ padding: isMobile ? '0 16px 20px' : '0 24px 20px' }}>
        <div style={{ marginTop: -AVATAR_OFFSET, position: 'relative', zIndex: 2, width: AVATAR_SIZE }}>
          {p.avatar ? (
            <img src={p.avatar} alt={p.name} style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%', border: `3px solid ${D.card}`, objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: '50%', border: `3px solid ${D.card}`, background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: AVATAR_SIZE * 0.4, fontWeight: 700 }}>
              {p.name.trim()[0]}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 10, gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 800, color: D.heading, margin: 0, letterSpacing: '-0.8px' }}>{p.name}</h1>
            {p.headline && <p style={{ fontSize: isMobile ? tokens.fontSizes.xs : tokens.fontSizes.sm, color: D.body, margin: '4px 0 0', lineHeight: 1.4 }}>{p.headline}</p>}
          </div>
          <div style={{ display: 'flex', gap: '7px', flexShrink: 0, marginTop: 2 }}>
            <button
              onClick={onEdit}
              style={{
                padding: isMobile ? '6px 11px' : '7px 14px', borderRadius: 8,
                fontSize: isMobile ? tokens.fontSizes.xs : tokens.fontSizes.sm, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${D.border}`, background: 'transparent', color: D.body,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <PencilIcon size={13} color={D.body} /> 편집
            </button>
          </div>
        </div>

        {/* Followers */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <button onClick={() => setFollowModal('followers')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: tokens.fontSizes.sm }}>
            <strong style={{ color: D.heading, fontWeight: 700 }}>{p.followers.toLocaleString()}</strong>
            <span style={{ color: D.muted, marginLeft: 4 }}>팔로워</span>
          </button>
          <button onClick={() => setFollowModal('following')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: tokens.fontSizes.sm }}>
            <strong style={{ color: D.heading, fontWeight: 700 }}>{p.following.toLocaleString()}</strong>
            <span style={{ color: D.muted, marginLeft: 4 }}>팔로잉</span>
          </button>
        </div>

        {(p.location || p.role) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: 10 }}>
            {p.location && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: D.body }}>
                <LocationIcon size={12} color={D.muted} /> {p.location}
              </span>
            )}
            {p.role && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: tokens.fontSizes.xs, color: D.body }}>
                <BriefcaseIcon size={12} color={D.muted} /> {p.role}{p.yearsOfExp ? ` · ${p.yearsOfExp}년 경력` : ''}
              </span>
            )}
          </div>
        )}

        {p.socialLinks.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: 14 }}>
            {p.socialLinks.map(link => (
              <a key={link.type} href={link.url} target="_blank" rel="noopener noreferrer" title={link.type}
                style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${D.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: D.body, textDecoration: 'none', background: 'transparent' }}
              >
                {socialIconMap[link.type]}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  /* Sections */
  const introContent = p.bio
    ? <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, lineHeight: 1.8, margin: 0 }}>{p.bio}</p>
    : <EmptyHint text="소개가 아직 없어요. 편집에서 추가해 보세요." />;

  const skillsContent = p.skills.length > 0
    ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{p.skills.map(s => <Tag key={s} label={s} />)}</div>
    : <EmptyHint text="등록된 스킬이 없어요." />;

  const careerContent = p.experience.length > 0
    ? <TimelineContent profile={p} />
    : <EmptyHint text="경력·학력이 아직 없어요." />;

  const projectsContent = p.projects.length > 0 ? (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
        {visibleProjects.map(proj => <ProjectCard key={proj.id} project={proj} onClick={() => setSelectedProject(proj)} />)}
      </div>
      <MoreButton show={p.projects.length > 3} expanded={showAllProjects} count={p.projects.length - 3} onToggle={() => setShowAllProjects(v => !v)} />
    </>
  ) : <EmptyHint text="등록된 프로젝트가 없어요." />;

  const deletePost = (postId: string) => {
    onUpdateProfile({ ...p, posts: p.posts.filter(post => post.id !== postId) });
  };

  const postsContent = p.posts.length > 0 ? (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {visiblePosts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post.id)}
            onEdit={() => onEditPost(post.id)}
            onDelete={() => deletePost(post.id)}
          />
        ))}
      </div>
      <MoreButton show={p.posts.length > 3} expanded={showAllPosts} count={p.posts.length - 3} onToggle={() => setShowAllPosts(v => !v)} />
    </>
  ) : <EmptyHint text="작성한 포스트가 없어요." />;

  const desktopSections = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <SectionCard title="소개">{introContent}</SectionCard>
      <SectionCard title="스킬">{skillsContent}</SectionCard>
      <SectionCard title="경력 · 학력">{careerContent}</SectionCard>
      <SectionCard title="프로젝트">{projectsContent}</SectionCard>
      <SectionCard title="포스트" action={
        <button onClick={onNewPost} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 7, border: `1px solid ${D.border}`, background: 'transparent', color: D.body, fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer' }}>
          <PlusIcon size={12} color={D.body} /> 글쓰기
        </button>
      }>{postsContent}</SectionCard>
    </div>
  );

  const mobileCard = (title: string, body: React.ReactNode) => (
    <div style={{ background: D.card, borderRadius: 10, border: `1px solid ${D.border}`, padding: '16px' }}>
      <h2 style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading, margin: '0 0 12px' }}>{title}</h2>
      {body}
    </div>
  );

  const mobileTabContent: Record<MobileTab, React.ReactNode> = {
    '소개': <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{mobileCard('소개', introContent)}{mobileCard('스킬', skillsContent)}</div>,
    '경력': mobileCard('경력 · 학력', careerContent),
    '프로젝트': mobileCard('프로젝트', projectsContent),
    '포스트': mobileCard('포스트', postsContent),
  };

  const mobileTabBar = (
    <div style={{ position: 'sticky', top: 56, zIndex: 50, background: D.card, borderBottom: `1px solid ${D.border}`, display: 'flex' }}>
      {MOBILE_TABS.map(tab => (
        <button key={tab} onClick={() => setActiveTab(prev => (prev === tab ? null : tab))} style={{
          flex: 1, padding: '13px 0', background: 'none', border: 'none',
          borderBottom: activeTab === tab ? `2.5px solid #fff` : '2.5px solid transparent',
          fontSize: '12px', fontWeight: activeTab === tab ? 700 : 400,
          color: activeTab === tab ? D.heading : D.muted,
          cursor: 'pointer', transition: `all ${tokens.transitions.fast}`,
        }}>{tab}</button>
      ))}
    </div>
  );

  const modals = (
    <>
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      <FollowListModal open={followModal !== null} initialTab={followModal ?? 'followers'} onClose={() => setFollowModal(null)} />
    </>
  );

  if (isMobile) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', paddingBottom: 40 }}>
        {modals}
        {headerCard}
        {mobileTabBar}
        {activeTab && <div style={{ padding: '12px 10px' }}>{mobileTabContent[activeTab]}</div>}
        {!activeTab && (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 }}>
              {MOBILE_TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 14px', borderRadius: 999, border: `1px solid ${D.border}`, background: D.card, fontSize: '11px', fontWeight: 600, color: D.body, cursor: 'pointer' }}>{tab}</button>
              ))}
            </div>
            <p style={{ fontSize: tokens.fontSizes.xs, color: D.muted, margin: 0 }}>탭을 선택해 프로필을 살펴보세요</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {modals}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
        {headerCard}
        {desktopSections}
      </div>
    </div>
  );
};

/* Sub-components */

const TimelineContent: React.FC<{ profile: ProfileData }> = ({ profile }) => (
  <div style={{ position: 'relative' }}>
    <div style={{ position: 'absolute', left: 4, top: 8, bottom: 8, width: 2, background: D.border, borderRadius: 1 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {profile.experience.map(exp => (
        <div key={exp.id} style={{ display: 'flex', gap: '16px', paddingLeft: 4 }}>
          <div style={{ flexShrink: 0, marginTop: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: exp.type === 'work' ? '#0070f3' : '#a78bfa', position: 'relative', zIndex: 1 }} />
          </div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{exp.title}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, marginTop: 2 }}>{exp.organization}</div>
              </div>
              <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, background: 'rgba(255,255,255,0.04)', padding: '2px 8px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0, border: `1px solid ${D.border}` }}>
                {exp.period}
              </span>
            </div>
            <p style={{ fontSize: tokens.fontSizes.xs, color: D.muted, margin: '6px 0 0', lineHeight: 1.65 }}>{exp.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MoreButton: React.FC<{ show: boolean; expanded: boolean; count: number; onToggle: () => void }> = ({ show, expanded, count, onToggle }) => {
  if (!show) return null;
  return (
    <button onClick={onToggle} style={{ marginTop: 12, width: '100%', padding: '9px', background: 'none', border: `1px solid ${D.border}`, borderRadius: 8, fontSize: tokens.fontSizes.sm, fontWeight: 500, color: D.body, cursor: 'pointer' }}>
      {expanded ? '접기' : `더보기 (${count}개)`}
    </button>
  );
};

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ borderRadius: 8, border: `1px solid ${hovered ? D.borderHover : D.border}`, overflow: 'hidden', cursor: 'pointer', transition: `all ${tokens.transitions.fast}`, transform: hovered ? 'translateY(-1px)' : 'none', background: D.section }}>
      <div style={{ height: 52, background: project.imageGradient, display: 'flex', alignItems: 'flex-end', padding: '0 12px 8px' }}>
        {project.stars != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StarIcon size={12} color="#fbbf24" />
            <span style={{ fontSize: tokens.fontSizes.xs, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>{project.stars}</span>
          </div>
        )}
      </div>
      <div style={{ padding: '12px' }}>
        <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading, marginBottom: 4 }}>{project.title}</div>
        <p style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '0 0 10px', lineHeight: 1.55 }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {project.techStack.slice(0, 3).map(t => (
            <span key={t} style={{ background: D.tag, color: D.tagText, padding: '2px 7px', borderRadius: 6, fontSize: tokens.fontSizes.xs, border: `1px solid ${D.border}` }}>{t}</span>
          ))}
          {project.techStack.length > 3 && <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, padding: '2px 0' }}>+{project.techStack.length - 3}</span>}
        </div>
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: Post; onClick: () => void; onEdit?: () => void; onDelete?: () => void }> = ({ post, onClick, onEdit, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ padding: '13px', borderRadius: 8, border: `1px solid ${hovered ? D.borderHover : D.border}`, transition: `all ${tokens.transitions.fast}`, background: hovered ? 'rgba(255,255,255,0.03)' : D.section }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 5 }}>
        <div onClick={onClick} style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading, lineHeight: 1.4, cursor: 'pointer', flex: 1 }}>{post.title}</div>
        {hovered && (onEdit || onDelete) && (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            {onEdit && (
              <button onClick={e => { e.stopPropagation(); onEdit(); }} style={{ background: 'none', border: `1px solid ${D.border}`, borderRadius: 6, padding: '3px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <PencilIcon size={11} color={D.muted} />
              </button>
            )}
            {onDelete && (
              <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: 'none', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 6, padding: '3px 7px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <TrashIcon size={11} color="#ef4444" />
              </button>
            )}
          </div>
        )}
      </div>
      <p onClick={onClick} style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '0 0 9px', lineHeight: 1.55, cursor: 'pointer' }}>{post.excerpt}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: 9 }}>
        {post.tags.map(tag => <Tag key={tag} label={tag} />)}
      </div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: D.muted }}><HeartIcon size={11} color={D.muted} /> {post.likes}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: D.muted }}><EyeIcon size={11} color={D.muted} /> {post.views.toLocaleString()}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: tokens.fontSizes.xs, color: D.muted }}><ClockIcon size={11} color={D.muted} /> {post.readingTime}분</span>
        <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginLeft: 'auto' }}>{post.date}</span>
      </div>
    </div>
  );
};

export default Profile;
