import React, { useEffect } from 'react';
import { tokens } from '../tokens';
import type { Project } from '../data/defaultData';
import { CloseIcon, GithubIcon, ExternalLinkIcon, StarIcon } from './Icons';
import MarkdownRenderer from './MarkdownRenderer';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const D = {
  overlay: 'rgba(0,0,0,0.75)', card: '#111', border: 'rgba(255,255,255,0.08)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  tag: 'rgba(255,255,255,0.06)', tagText: '#a1a1aa',
};

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', handler); };
  }, [project, onClose]);

  if (!project) return null;

  const bannerStyle: React.CSSProperties = project.imageUrl
    ? { height: 160, background: `url(${project.imageUrl}) center/cover no-repeat`, position: 'relative', flexShrink: 0 }
    : { height: 120, background: project.imageGradient, position: 'relative', flexShrink: 0 };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: D.overlay, zIndex: tokens.zIndex.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, boxShadow: '0 24px 80px rgba(0,0,0,0.8)', maxWidth: 600, width: '100%', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: tokens.zIndex.modal }}>
        {/* Header banner */}
        <div style={bannerStyle}>
          <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: 999, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <CloseIcon size={16} color="#fff" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontSize: tokens.fontSizes.xl, fontWeight: 700, color: D.heading, margin: 0 }}>{project.title}</h2>
            {project.stars != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <StarIcon size={14} color="#fbbf24" />
                <span style={{ fontSize: tokens.fontSizes.sm, color: D.body, fontWeight: 500 }}>{project.stars}</span>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 16 }}>
            {project.techStack.map(tech => (
              <span key={tech} style={{ background: D.tag, color: D.tagText, padding: '3px 9px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>{tech}</span>
            ))}
          </div>
          {project.longDescription && (
            <div style={{ marginBottom: 16 }}>
              <MarkdownRenderer content={project.longDescription} />
            </div>
          )}
        </div>

        {/* Footer */}
        {(project.githubUrl || project.demoUrl) && (
          <div style={{ borderTop: `1px solid ${D.border}`, padding: '14px 24px', display: 'flex', gap: '10px', flexShrink: 0 }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', background: '#fff', color: '#000', borderRadius: 8, textDecoration: 'none', fontSize: tokens.fontSizes.sm, fontWeight: 700 }}>
                <GithubIcon size={16} color="#000" /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', background: '#0070f3', color: '#fff', borderRadius: 8, textDecoration: 'none', fontSize: tokens.fontSizes.sm, fontWeight: 700 }}>
                <ExternalLinkIcon size={14} color="#fff" /> 데모 보기
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;

