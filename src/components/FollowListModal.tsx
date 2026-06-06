import React, { useEffect, useState } from 'react';
import { tokens } from '../tokens';
import { CloseIcon } from './Icons';
import { sampleFollowers, sampleFollowing, type FollowUser } from '../data/defaultData';

export type FollowTab = 'followers' | 'following';

interface FollowListModalProps {
  open: boolean;
  initialTab: FollowTab;
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ open, initialTab, onClose }) => {
  const [tab, setTab] = useState<FollowTab>(initialTab);
  const [followers, setFollowers] = useState<FollowUser[]>(sampleFollowers);
  const [following, setFollowing] = useState<FollowUser[]>(sampleFollowing);

  useEffect(() => { if (open) setTab(initialTab); }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', handler); };
  }, [open, onClose]);

  if (!open) return null;

  const list = tab === 'followers' ? followers : following;
  const setList = tab === 'followers' ? setFollowers : setFollowing;

  const toggleFollow = (id: string) => {
    setList(prev => prev.map(u => (u.id === id ? { ...u, isFollowing: !u.isFollowing } : u)));
  };

  const tabBtn = (key: FollowTab): React.CSSProperties => ({
    flex: 1, padding: '13px 0', background: 'none', border: 'none',
    borderBottom: tab === key ? `2.5px solid ${tokens.colors.primary}` : `2.5px solid transparent`,
    fontSize: tokens.fontSizes.sm,
    fontWeight: tab === key ? tokens.fontWeights.bold : tokens.fontWeights.medium,
    color: tab === key ? tokens.colors.primary : tokens.colors.textMuted,
    cursor: 'pointer', transition: `all ${tokens.transitions.fast}`,
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: tokens.zIndex.overlay, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '20px', backdropFilter: 'blur(3px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: tokens.colors.surface, borderRadius: tokens.borderRadius.xl,
          boxShadow: tokens.shadows.modal, maxWidth: 420, width: '100%',
          maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          zIndex: tokens.zIndex.modal,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0' }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: tokens.fontWeights.bold, color: tokens.colors.textPrimary, margin: 0 }}>
            네트워크
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: tokens.colors.textMuted, padding: 4, display: 'flex' }}
          >
            <CloseIcon size={18} color={tokens.colors.textMuted} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${tokens.colors.border}`, margin: '6px 0 0' }}>
          <button style={tabBtn('followers')} onClick={() => setTab('followers')}>
            팔로워 {followers.length}
          </button>
          <button style={tabBtn('following')} onClick={() => setTab('following')}>
            팔로잉 {following.length}
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
          {list.map(user => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: tokens.fontWeights.semibold, color: tokens.colors.textPrimary }}>{user.name}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: tokens.colors.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.headline}</div>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: tokens.borderRadius.md,
                  fontSize: tokens.fontSizes.xs, fontWeight: tokens.fontWeights.semibold, cursor: 'pointer',
                  border: user.isFollowing ? `1.5px solid ${tokens.colors.border}` : 'none',
                  backgroundColor: user.isFollowing ? 'transparent' : tokens.colors.primary,
                  color: user.isFollowing ? tokens.colors.textSecondary : '#fff',
                  transition: `all ${tokens.transitions.fast}`,
                }}
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
          ))}
          {list.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: tokens.colors.textMuted, fontSize: tokens.fontSizes.sm }}>
              아직 {tab === 'followers' ? '팔로워가' : '팔로잉이'} 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
