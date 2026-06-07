import React, { useState } from 'react';
import { tokens } from '../tokens';
import { type ProfileData } from '../data/defaultData';
import { HeartIcon, EyeIcon, ClockIcon, ArrowLeftIcon, SendIcon, PencilIcon, TrashIcon } from '../components/Icons';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

interface PostDetailProps {
  postId: string;
  profile: ProfileData | null;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface Reply {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  liked: boolean;
  likes: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  liked: boolean;
  likes: number;
  replies: Reply[];
}

const D = {
  bg: '#000', card: '#0a0a0a', border: 'rgba(255,255,255,0.08)',
  borderFocus: 'rgba(255,255,255,0.22)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', accentDim: 'rgba(0,112,243,0.12)',
  tag: 'rgba(255,255,255,0.07)', tagText: '#a1a1aa',
  input: '#0f0f0f',
};

const PostDetail: React.FC<PostDetailProps> = ({ postId, profile, onBack, onEdit, onDelete }) => {
  const post = profile?.posts.find(p => p.id === postId) ?? null;
  const [liked, setLiked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const sendLock = React.useRef(false);

  if (!profile || !post) {
    return (
      <div style={{ background: D.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: D.muted }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: D.body, marginBottom: 8 }}>포스트를 찾을 수 없습니다</div>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#5b9cf6', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit', fontWeight: 600 }}>← 돌아가기</button>
        </div>
      </div>
    );
  }

  const submitComment = () => {
    const text = commentText.trim();
    if (!text || sendLock.current) return;
    sendLock.current = true;
    const now = new Date();
    setComments(prev => [
      ...prev,
      {
        id: 'c' + Date.now(),
        author: profile.name || '나',
        avatar: profile.avatar || '',
        text,
        date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
        liked: false,
        likes: 0,
        replies: [],
      },
    ]);
    setCommentText('');
    sendLock.current = false;
  };

  const submitReply = (commentId: string) => {
    const text = replyText.trim();
    if (!text) return;
    const now = new Date();
    const newReply: Reply = {
      id: 'r' + Date.now(),
      author: profile.name || '나',
      avatar: profile.avatar || '',
      text,
      date: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`,
      liked: false,
      likes: 0,
    };
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
    ));
    setReplyText('');
    setReplyingTo(null);
  };

  const toggleCommentLike = (id: string) => {
    setComments(prev => prev.map(c =>
      c.id === id ? { ...c, liked: !c.liked, likes: c.likes + (c.liked ? -1 : 1) } : c
    ));
  };

  const toggleReplyLike = (commentId: string, replyId: string) => {
    setComments(prev => prev.map(c =>
      c.id === commentId
        ? { ...c, replies: c.replies.map(r => r.id === replyId ? { ...r, liked: !r.liked, likes: r.likes + (r.liked ? -1 : 1) } : r) }
        : c
    ));
  };

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      {showDeleteModal && onDelete && (
        <ConfirmDeleteModal
          title="포스트 삭제"
          description="삭제된 포스트는 복구할 수 없습니다. 정말 삭제하시겠어요?"
          onConfirm={() => { setShowDeleteModal(false); onDelete(); }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px 100px' }}>

        {/* Back + actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none',
              color: D.muted, fontSize: tokens.fontSizes.sm, cursor: 'pointer', padding: 0,
              transition: `color ${tokens.transitions.fast}`, fontFamily: 'inherit',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = D.body)}
            onMouseLeave={e => (e.currentTarget.style.color = D.muted)}
          >
            <ArrowLeftIcon size={15} color="currentColor" /> 뒤로가기
          </button>
          {(onEdit || onDelete) && (
            <div style={{ display: 'flex', gap: 8 }}>
              {onEdit && (
                <button
                  onClick={onEdit}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 13px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                    border: `1px solid ${D.border}`, background: 'transparent',
                    color: D.body, fontSize: tokens.fontSizes.xs, fontWeight: 500,
                    transition: `all ${tokens.transitions.fast}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = D.heading; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = D.body; }}
                >
                  <PencilIcon size={13} color="currentColor" /> 수정
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '7px 13px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                    border: '1px solid rgba(239,68,68,0.25)', background: 'transparent',
                    color: '#f87171', fontSize: tokens.fontSizes.xs, fontWeight: 500,
                    transition: `all ${tokens.transitions.fast}`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <TrashIcon size={13} color="currentColor" /> 삭제
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(26px, 4.5vw, 44px)', fontWeight: 800, color: D.heading,
          margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-1px',
        }}>
          {post.title}
        </h1>

        {/* Author + meta */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          paddingBottom: 20, marginBottom: 18,
        }}>
          <AuthorAvatar profile={profile} size={40} fontSize={16} />
          <div>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{profile.name}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{post.date}</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, alignItems: 'center' }}>
            <MetaChip icon={<ClockIcon size={13} color={D.muted} />} label={`${post.readingTime}분 읽기`} />
            <MetaChip icon={<EyeIcon size={13} color={D.muted} />} label={post.views.toLocaleString()} />
            <MetaChip icon={<HeartIcon size={13} color={D.muted} />} label={String(post.likes + (liked ? 1 : 0))} />
          </div>
        </div>

        {/* Tags — under author */}
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 36, paddingBottom: 36, borderBottom: `1px solid ${D.border}` }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ background: D.tag, color: D.tagText, padding: '4px 11px', borderRadius: 999, fontSize: tokens.fontSizes.xs, fontWeight: 500, border: `1px solid ${D.border}` }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <MarkdownRenderer content={post.content} />

        {/* Footer actions */}
        <div style={{
          marginTop: 52, paddingTop: 28, borderTop: `1px solid ${D.border}`,
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <button
            onClick={() => setLiked(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${liked ? 'rgba(239,68,68,0.4)' : D.border}`,
              background: liked ? 'rgba(239,68,68,0.08)' : 'transparent',
              color: liked ? '#f87171' : D.body,
              fontSize: tokens.fontSizes.sm, fontWeight: 600,
              transition: `all ${tokens.transitions.fast}`,
            }}
          >
            <HeartIcon size={15} color={liked ? '#f87171' : D.body} />
            {post.likes + (liked ? 1 : 0)} 좋아요
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
              border: `1px solid ${D.border}`, background: 'transparent',
              color: D.muted, fontSize: tokens.fontSizes.sm, fontWeight: 500,
              transition: `all ${tokens.transitions.fast}`,
            }}
          >
            <ArrowLeftIcon size={14} color={D.muted} /> 목록으로
          </button>
        </div>

        {/* Author card */}
        <div style={{ marginTop: 40, padding: '22px 24px', borderRadius: 12, border: `1px solid ${D.border}`, background: D.card, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <AuthorAvatar profile={profile} size={52} fontSize={20} />
          <div>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading, marginBottom: 4 }}>{profile.name}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.body, lineHeight: 1.6 }}>{profile.headline}</div>
            {profile.bio && (
              <p style={{ fontSize: tokens.fontSizes.xs, color: D.muted, margin: '8px 0 0', lineHeight: 1.65 }}>
                {profile.bio.slice(0, 100)}{profile.bio.length > 100 ? '...' : ''}
              </p>
            )}
          </div>
        </div>

        {/* ── Comments ── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: 0 }}>댓글</h2>
            {comments.length > 0 && (
              <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}`, borderRadius: 999, padding: '2px 8px' }}>
                {comments.length}
              </span>
            )}
          </div>

          {/* Comment input */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 32 }}>
            <AuthorAvatar profile={profile} size={36} fontSize={14} />
            <div style={{ flex: 1 }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) { e.preventDefault(); submitComment(); } }}
                placeholder="댓글을 작성하세요... (Ctrl+Enter로 게시)"
                rows={3}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: D.input, border: `1px solid ${D.border}`,
                  borderRadius: 10, padding: '12px 14px',
                  fontSize: tokens.fontSizes.sm, color: D.heading,
                  fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                  lineHeight: 1.6, transition: `border-color ${tokens.transitions.fast}`,
                }}
                onFocus={e => (e.target.style.borderColor = D.borderFocus)}
                onBlur={e => (e.target.style.borderColor = D.border)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 8, fontFamily: 'inherit',
                    border: 'none', cursor: commentText.trim() ? 'pointer' : 'not-allowed',
                    background: commentText.trim() ? D.accent : 'rgba(255,255,255,0.06)',
                    color: commentText.trim() ? '#fff' : D.muted,
                    fontSize: tokens.fontSizes.sm, fontWeight: 600,
                    transition: `all ${tokens.transitions.fast}`,
                  }}
                >
                  <SendIcon size={13} color={commentText.trim() ? '#fff' : D.muted} />
                  게시
                </button>
              </div>
            </div>
          </div>

          {/* Comment list */}
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', borderTop: `1px solid ${D.border}` }}>
              <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted }}>아직 댓글이 없어요. 첫 댓글을 남겨보세요!</div>
            </div>
          ) : (
            <div style={{ borderTop: `1px solid ${D.border}` }}>
              {comments.map((c, idx) => (
                <div key={c.id} style={{
                  padding: '20px 0',
                  borderBottom: idx < comments.length - 1 ? `1px solid ${D.border}` : 'none',
                }}>
                  {/* Comment row */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <CommentAvatar author={c.author} avatar={c.avatar} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{c.author}</span>
                        <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}>{c.date}</span>
                      </div>
                      <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 10px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{c.text}</p>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <button type="button" onClick={() => toggleCommentLike(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: c.liked ? '#f87171' : D.muted, fontSize: tokens.fontSizes.xs, fontWeight: 500, fontFamily: 'inherit', padding: 0 }}>
                          <HeartIcon size={12} color={c.liked ? '#f87171' : D.muted} />
                          {c.likes > 0 ? c.likes : '좋아요'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setReplyingTo(replyingTo === c.id ? null : c.id); setReplyText(''); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: replyingTo === c.id ? D.heading : D.muted, fontSize: tokens.fontSizes.xs, fontWeight: 500, fontFamily: 'inherit', padding: 0 }}
                        >
                          답글 달기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {(c.replies.length > 0 || replyingTo === c.id) && (
                    <div style={{ marginLeft: 48, marginTop: 14, borderLeft: `2px solid rgba(255,255,255,0.06)`, paddingLeft: 16 }}>
                      {c.replies.map(r => (
                        <div key={r.id} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                          <CommentAvatar author={r.author} avatar={r.avatar} size={28} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.heading }}>{r.author}</span>
                              <span style={{ fontSize: 11, color: D.muted }}>{r.date}</span>
                            </div>
                            <p style={{ fontSize: tokens.fontSizes.xs, color: D.body, margin: '0 0 6px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{r.text}</p>
                            <button type="button" onClick={() => toggleReplyLike(c.id, r.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: r.liked ? '#f87171' : D.muted, fontSize: 11, fontWeight: 500, fontFamily: 'inherit', padding: 0 }}>
                              <HeartIcon size={11} color={r.liked ? '#f87171' : D.muted} />
                              {r.likes > 0 ? r.likes : '좋아요'}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Reply input */}
                      {replyingTo === c.id && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: c.replies.length > 0 ? 10 : 0 }}>
                          <CommentAvatar author={profile.name || '나'} avatar={profile.avatar || ''} size={28} />
                          <div style={{ flex: 1 }}>
                            <textarea
                              autoFocus
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) { e.preventDefault(); submitReply(c.id); } if (e.key === 'Escape') { setReplyingTo(null); setReplyText(''); } }}
                              placeholder="답글을 작성하세요... (Ctrl+Enter로 게시)"
                              rows={2}
                              style={{ width: '100%', boxSizing: 'border-box', background: D.input, border: `1px solid ${D.border}`, borderRadius: 8, padding: '9px 12px', fontSize: tokens.fontSizes.xs, color: D.heading, fontFamily: 'inherit', resize: 'none', outline: 'none', lineHeight: 1.6 }}
                              onFocus={e => (e.target.style.borderColor = D.borderFocus)}
                              onBlur={e => (e.target.style.borderColor = D.border)}
                            />
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', marginTop: 6 }}>
                              <button onClick={() => { setReplyingTo(null); setReplyText(''); }} style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${D.border}`, background: 'none', color: D.muted, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}>취소</button>
                              <button onClick={() => submitReply(c.id)} disabled={!replyText.trim()} style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: replyText.trim() ? D.accent : 'rgba(255,255,255,0.06)', color: replyText.trim() ? '#fff' : D.muted, fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: replyText.trim() ? 'pointer' : 'default' }}>게시</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const AuthorAvatar: React.FC<{ profile: ProfileData; size: number; fontSize: number }> = ({ profile, size, fontSize }) => {
  if (profile.avatar) {
    return <img src={profile.avatar} alt={profile.name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize, fontWeight: 700, flexShrink: 0 }}>
      {profile.name?.[0] ?? '?'}
    </div>
  );
};

const CommentAvatar: React.FC<{ author: string; avatar: string; size?: number }> = ({ author, avatar, size = 36 }) => {
  if (avatar) {
    return <img src={avatar} alt={author} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: size * 0.39, fontWeight: 700, flexShrink: 0 }}>
      {author?.[0] ?? '?'}
    </div>
  );
};

const MetaChip: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: tokens.fontSizes.xs, color: '#52525b' }}>
    {icon} {label}
  </span>
);

export default PostDetail;
