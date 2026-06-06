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

const D = {
  overlay: 'rgba(0,0,0,0.75)', card: '#111', border: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.05)', heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', activeTab: '#fff', activeBorder: '#fff',
};

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
    borderBottom: tab === key ? `2.5px solid ${D.activeBorder}` : `2.5px solid transparent`,
    fontSize: tokens.fontSizes.sm, fontWeight: tab === key ? 700 : 400,
    color: tab === key ? D.activeTab : D.muted, cursor: 'pointer',
    transition: `all ${tokens.transitions.fast}`,
  });

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: D.overlay, zIndex: tokens.zIndex.overlay, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(6px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: D.card, borderRadius: 14, border: `1px solid ${D.border}`, boxShadow: '0 24px 80px rgba(0,0,0,0.8)', maxWidth: 420, width: '100%', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', zIndex: tokens.zIndex.modal }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0' }}>
          <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: 0 }}>네트워크</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <CloseIcon size={18} color={D.muted} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${D.border}`, margin: '6px 0 0' }}>
          <button style={tabBtn('followers')} onClick={() => setTab('followers')}>팔로워 {followers.length}</button>
          <button style={tabBtn('following')} onClick={() => setTab('following')}>팔로잉 {following.length}</button>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
          {list.map(user => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 18px' }}>
              <img src={user.avatar} alt={user.name} style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{user.name}</div>
                <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.headline}</div>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: 8,
                  fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${user.isFollowing ? D.border : 'transparent'}`,
                  background: user.isFollowing ? 'rgba(255,255,255,0.05)' : '#fff',
                  color: user.isFollowing ? D.body : '#000',
                  transition: `all ${tokens.transitions.fast}`,
                }}
              >
                {user.isFollowing ? '팔로잉' : '팔로우'}
              </button>
            </div>
          ))}
          {list.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: D.muted, fontSize: tokens.fontSizes.sm }}>
              아직 {tab === 'followers' ? '팔로워가' : '팔로잉이'} 없습니다
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
