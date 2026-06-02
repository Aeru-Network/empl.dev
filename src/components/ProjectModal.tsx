import React, { useEffect } from 'react';
import { tokens } from '../tokens';
import type { Project } from '../data/defaultData';
import { CloseIcon, GithubIcon, ExternalLinkIcon, StarIcon } from './Icons';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', handler);
    };
  }, [project, onClose]);

  if (!project) return null;

  const lines = project.longDescription.split('\n');

  const renderContent = () => {
    return lines.map((line, i) => {
      if (line.startsWith('## ')) {
        return <h3 key={i} style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary, margin: '16px 0 6px' }}>{line.slice(3)}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={i} style={{ fontSize: tokens.fontSizes.lg, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: '0 0 10px' }}>{line.slice(2)}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, marginLeft: 16, marginBottom: 4 }}>{line.slice(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, margin: '4px 0', lineHeight: 1.7 }}>{line}</p>;
    });
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: tokens.zIndex.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.colors.surface,
          borderRadius: tokens.borderRadius.xl,
          boxShadow: tokens.shadows.modal,
          maxWidth: 600,
          width: '100%',
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: tokens.zIndex.modal,
        }}
      >
        {/* Header banner */}
        <div style={{
          height: 120,
          background: project.imageGradient,
          position: 'relative',
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(0,0,0,0.35)',
              border: 'none',
              borderRadius: tokens.borderRadius.full,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            <CloseIcon size={16} color="#fff" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <h2 style={{ fontSize: tokens.fontSizes.xl, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>
              {project.title}
            </h2>
            {project.stars != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                <StarIcon size={14} color="#f59e0b" />
                <span style={{ fontSize: tokens.fontSizes.sm, color: tokens.colors.textSecondary, fontWeight: tokens.fontWeights.medium }}>{project.stars}</span>
              </div>
            )}
          </div>

          {/* Tech stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 16 }}>
            {project.techStack.map(tech => (
              <span key={tech} style={{
                backgroundColor: tokens.colors.tag,
                color: tokens.colors.tagText,
                padding: '3px 9px',
                borderRadius: tokens.borderRadius.full,
                fontSize: tokens.fontSizes.xs,
                fontWeight: tokens.fontWeights.medium,
              }}>
                {tech}
              </span>
            ))}
          </div>

          {/* Long description */}
          <div style={{ marginBottom: 16 }}>
            {renderContent()}
          </div>
        </div>

        {/* Footer actions */}
        {(project.githubUrl || project.demoUrl) && (
          <div style={{
            borderTop: `1px solid ${tokens.colors.border}`,
            padding: '14px 24px',
            display: 'flex',
            gap: '10px',
            flexShrink: 0,
          }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  backgroundColor: tokens.colors.navy,
                  color: '#fff',
                  borderRadius: tokens.borderRadius.md,
                  textDecoration: 'none',
                  fontSize: tokens.fontSizes.sm,
                  fontWeight: tokens.fontWeights.medium,
                }}
              >
                <GithubIcon size={16} color="#fff" /> GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  backgroundColor: tokens.colors.primary,
                  color: '#fff',
                  borderRadius: tokens.borderRadius.md,
                  textDecoration: 'none',
                  fontSize: tokens.fontSizes.sm,
                  fontWeight: tokens.fontWeights.medium,
                }}
              >
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
