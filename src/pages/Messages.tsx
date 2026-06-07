import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../tokens';
import { SendIcon, ArrowLeftIcon, PencilIcon, TrashIcon, CloseIcon } from '../components/Icons';
import { exploreProfiles, type ExploreProfile } from '../data/defaultData';

const D = {
  bg: '#000', sidebar: '#0a0a0a', card: '#0f0f0f',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.16)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#0070f3', accentBubble: '#1a56db',
  myBubble: '#1a56db', myBubbleText: '#fff',
  theirBubble: '#1c1c1c', theirBubbleText: '#e4e4e7',
  active: 'rgba(255,255,255,0.05)',
  input: '#111',
};

interface Message {
  id: string;
  text: string;
  from: 'me' | 'them';
  time: string;
  deleted?: boolean;
  edited?: boolean;
}

/* ── Inline icon components ── */
const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="8" height="8" rx="1.5" />
    <path d="M1 9V2a1 1 0 011-1h7" />
  </svg>
);

const ActionBtn: React.FC<{
  title: string; onClick: () => void;
  active?: boolean; danger?: boolean; children: React.ReactNode;
}> = ({ title, onClick, active, danger, children }) => (
  <button
    title={title}
    onClick={e => { e.stopPropagation(); onClick(); }}
    style={{
      background: 'none', border: 'none', borderRadius: 6,
      width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: active ? '#22c55e' : danger ? '#f87171' : '#52525b',
      transition: 'color 0.1s, background 0.1s', flexShrink: 0,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
      if (!active) e.currentTarget.style.color = danger ? '#ef4444' : '#d4d4d8';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'none';
      e.currentTarget.style.color = active ? '#22c55e' : danger ? '#f87171' : '#52525b';
    }}
  >
    {children}
  </button>
);

interface Conversation {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
  lastReadMsgId: string | null;
}

const MESSAGES_KEY = 'empl.messages';

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [recipientQuery, setRecipientQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<ExploreProfile | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newFirstMsg, setNewFirstMsg] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendLock = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const active = conversations.find(c => c.id === activeId) ?? null;

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length]);

  useEffect(() => {
    if (showNewMsg) {
      setSelectedUser(null);
      setRecipientQuery('');
      setShowSuggestions(false);
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [showNewMsg]);

  const openConversation = (id: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setActiveId(id);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !activeId || sendLock.current) return;
    sendLock.current = true;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg: Message = { id: 'm' + Date.now(), text, from: 'me', time };
    const cid = activeId;
    setConversations(prev => prev.map(c =>
      c.id === cid
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, timestamp: '방금' }
        : c
    ));
    setInput('');
    sendLock.current = false;
  };

  const suggestions = recipientQuery.trim().length > 0
    ? exploreProfiles.filter(u =>
        u.name.includes(recipientQuery.trim()) ||
        u.headline.toLowerCase().includes(recipientQuery.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const closeNewMsg = () => {
    setShowNewMsg(false);
    setRecipientQuery('');
    setSelectedUser(null);
    setShowSuggestions(false);
    setNewFirstMsg('');
  };

  const selectUser = (user: ExploreProfile) => {
    setSelectedUser(user);
    setRecipientQuery('');
    setShowSuggestions(false);
  };

  const startNewConversation = () => {
    if (!selectedUser) return;
    const firstText = newFirstMsg.trim();
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    // If conversation with this user already exists, open it
    const existing = conversations.find(c => c.id === `conv-${selectedUser.id}`);
    if (existing) {
      if (firstText) {
        const newMsg: Message = { id: 'm' + Date.now(), text: firstText, from: 'me', time };
        setConversations(prev => prev.map(c =>
          c.id === existing.id
            ? { ...c, messages: [...c.messages, newMsg], lastMessage: firstText, timestamp: '방금', unread: 0 }
            : c
        ));
      }
      setActiveId(existing.id);
      closeNewMsg();
      return;
    }
    const cid = `conv-${selectedUser.id}`;
    const messages: Message[] = firstText
      ? [{ id: 'm' + Date.now(), text: firstText, from: 'me', time }]
      : [];
    const newConv: Conversation = {
      id: cid,
      name: selectedUser.name,
      headline: selectedUser.headline,
      avatar: selectedUser.avatar,
      lastMessage: firstText || '',
      timestamp: firstText ? '방금' : '',
      unread: 0,
      messages,
      lastReadMsgId: null,
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveId(cid);
    closeNewMsg();
  };

  const copyMsg = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1500);
  };

  const startEdit = (msg: Message) => {
    setEditingMsgId(msg.id);
    setEditText(msg.text);
    setHoveredMsg(null);
  };

  const saveEdit = (convId: string, msgId: string) => {
    const text = editText.trim();
    if (!text) return;
    setConversations(prev => prev.map(c =>
      c.id === convId
        ? { ...c, messages: c.messages.map(m => m.id === msgId ? { ...m, text, edited: true } : m) }
        : c
    ));
    setEditingMsgId(null);
    setEditText('');
  };

  const deleteMsg = (convId: string, msgId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== convId) return c;
      const msgs = c.messages.map(m => m.id === msgId ? { ...m, deleted: true } : m);
      const lastVisible = [...msgs].reverse().find(m => !m.deleted);
      return { ...c, messages: msgs, lastMessage: lastVisible?.text ?? '' };
    }));
    setHoveredMsg(null);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleNewMsgKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) startNewConversation();
    if (e.key === 'Escape') closeNewMsg();
    if (e.key === 'ArrowDown' && suggestions.length > 0) setShowSuggestions(true);
  };

  /* ── New Message Modal ── */
  const newMsgModal = showNewMsg && (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: 20,
      }}
      onClick={e => { if (e.target === e.currentTarget) closeNewMsg(); }}
    >
      <div style={{
        background: '#0f0f0f', border: `1px solid ${D.border}`,
        borderRadius: 16, padding: '24px', width: '100%', maxWidth: 400,
        animation: 'fadeUp 0.2s ease',
      }}>
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading }}>새 메시지</h3>
          <button onClick={closeNewMsg} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <CloseIcon size={16} color={D.muted} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Recipient search */}
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, color: D.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>받는 사람 *</label>
            {selectedUser ? (
              /* Selected user chip */
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 8,
                border: '1px solid rgba(0,112,243,0.4)', background: 'rgba(0,112,243,0.08)',
              }}>
                <img src={selectedUser.avatar} alt={selectedUser.name} style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{selectedUser.name}</div>
                  {selectedUser.headline && <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedUser.headline}</div>}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', flexShrink: 0 }}
                >
                  <CloseIcon size={13} color={D.muted} />
                </button>
              </div>
            ) : (
              /* Search input with dropdown */
              <div style={{ position: 'relative' }}>
                <input
                  ref={nameInputRef}
                  value={recipientQuery}
                  onChange={e => { setRecipientQuery(e.target.value); setShowSuggestions(true); }}
                  onKeyDown={handleNewMsgKey}
                  placeholder="이름으로 검색..."
                  style={{
                    width: '100%', background: D.input, border: `1px solid rgba(255,255,255,0.1)`,
                    borderRadius: 8, padding: '10px 12px', fontSize: tokens.fontSizes.sm,
                    color: D.heading, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(255,255,255,0.25)'; setShowSuggestions(true); }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; setTimeout(() => setShowSuggestions(false), 150); }}
                />
                {showSuggestions && recipientQuery.trim().length > 0 && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
                    background: '#161616', border: `1px solid ${D.border}`, borderRadius: 10,
                    zIndex: 20, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  }}>
                    {suggestions.length > 0 ? suggestions.map((u, i) => (
                      <button
                        key={u.id}
                        onMouseDown={() => selectUser(u)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                          padding: '10px 14px', background: 'none', border: 'none',
                          borderBottom: i < suggestions.length - 1 ? `1px solid ${D.border}` : 'none',
                          cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <img src={u.avatar} alt={u.name} style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading }}>{u.name}</div>
                          {u.headline && <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.headline}</div>}
                        </div>
                      </button>
                    )) : (
                      <div style={{ padding: '14px', fontSize: tokens.fontSizes.sm, color: D.muted, textAlign: 'center' }}>
                        검색 결과가 없습니다
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* First message */}
          <div>
            <label style={{ fontSize: tokens.fontSizes.xs, color: D.muted, fontWeight: 600, display: 'block', marginBottom: 6 }}>첫 메시지 (선택)</label>
            <textarea
              value={newFirstMsg}
              onChange={e => setNewFirstMsg(e.target.value)}
              onKeyDown={handleNewMsgKey}
              placeholder="안녕하세요!"
              rows={3}
              style={{
                width: '100%', background: D.input, border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 8, padding: '10px 12px', fontSize: tokens.fontSizes.sm,
                color: D.heading, fontFamily: 'inherit', outline: 'none', resize: 'none',
                boxSizing: 'border-box', lineHeight: 1.5,
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          <button
            onClick={startNewConversation}
            disabled={!selectedUser}
            style={{
              width: '100%', padding: '12px', borderRadius: 9, border: 'none',
              background: selectedUser ? D.accent : 'rgba(255,255,255,0.06)',
              color: selectedUser ? '#fff' : D.muted,
              fontSize: tokens.fontSizes.sm, fontWeight: 700, cursor: selectedUser ? 'pointer' : 'default',
              fontFamily: 'inherit', transition: 'all 0.15s',
            }}
          >
            대화 시작하기
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Sidebar ── */
  const sidebar = (
    <div style={{
      width: isMobile ? '100%' : 300, flexShrink: 0,
      borderRight: isMobile ? 'none' : `1px solid ${D.border}`,
      background: D.sidebar, display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ padding: '20px 20px 14px', borderBottom: `1px solid ${D.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: tokens.fontSizes.lg, fontWeight: 800, color: D.heading, margin: 0, letterSpacing: '-0.4px' }}>메시지</h2>
        <button
          onClick={() => setShowNewMsg(true)}
          title="새 메시지"
          style={{
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}`,
            borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        >
          <PencilIcon size={14} color={D.body} />
        </button>
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {conversations.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted, marginBottom: 14 }}>아직 대화가 없어요</div>
            <button
              onClick={() => setShowNewMsg(true)}
              style={{
                background: D.accent, color: '#fff', border: 'none',
                borderRadius: 8, padding: '9px 16px', fontSize: tokens.fontSizes.xs,
                fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              새 메시지 작성
            </button>
          </div>
        )}
        {conversations.map(conv => (
          <button
            key={conv.id}
            onClick={() => openConversation(conv.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
              padding: '13px 18px', border: 'none', cursor: 'pointer',
              background: activeId === conv.id ? D.active : 'transparent',
              borderBottom: `1px solid ${D.border}`,
              transition: `background ${tokens.transitions.fast}`,
            }}
            onMouseEnter={e => { if (activeId !== conv.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={e => { if (activeId !== conv.id) e.currentTarget.style.background = 'transparent'; }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img src={conv.avatar} alt={conv.name} style={{ width: 46, height: 46, borderRadius: '50%', display: 'block' }} />
              {conv.unread > 0 && (
                <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%', background: D.accent, border: '2px solid #0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff' }}>
                  {conv.unread}
                </div>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: tokens.fontSizes.sm, fontWeight: conv.unread > 0 ? 700 : 500, color: D.heading, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 130 }}>{conv.name}</span>
                <span style={{ fontSize: 10, color: D.muted, flexShrink: 0, marginLeft: 6 }}>{conv.timestamp}</span>
              </div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: conv.unread > 0 ? D.body : D.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.lastMessage || '대화를 시작해보세요'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── Thread ── */
  const thread = active ? (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      {/* Thread header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${D.border}`, background: D.sidebar, flexShrink: 0 }}>
        {isMobile && (
          <button onClick={() => setActiveId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
            <ArrowLeftIcon size={18} color={D.muted} />
          </button>
        )}
        <img src={active.avatar} alt={active.name} style={{ width: 38, height: 38, borderRadius: '50%' }} />
        <div>
          <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading }}>{active.name}</div>
          {active.headline && <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}>{active.headline}</div>}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {active.messages.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ textAlign: 'center', color: D.muted, fontSize: tokens.fontSizes.sm }}>
              {active.name}님께 첫 메시지를 보내보세요
            </div>
          </div>
        )}
        {active.messages.map((msg, idx) => {
          const isMe = msg.from === 'me';
          const prevFrom = idx > 0 ? active.messages[idx - 1].from : null;
          const showAvatar = !isMe && prevFrom !== 'them';
          const isHovered = hoveredMsg === msg.id;
          const isEditing = editingMsgId === msg.id;

          const actionBar = !msg.deleted && isHovered && !isEditing && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 1, alignSelf: 'center',
              background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.09)`,
              borderRadius: 999, padding: '2px 4px', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}>
              <ActionBtn title={copiedMsgId === msg.id ? '복사됨' : '복사'} onClick={() => copyMsg(msg.id, msg.text)} active={copiedMsgId === msg.id}>
                <CopyIcon />
              </ActionBtn>
              {isMe && (
                <>
                  <ActionBtn title="수정" onClick={() => startEdit(msg)}>
                    <PencilIcon size={13} color="currentColor" />
                  </ActionBtn>
                  <ActionBtn title="삭제" onClick={() => deleteMsg(active.id, msg.id)} danger>
                    <TrashIcon size={13} color="currentColor" />
                  </ActionBtn>
                </>
              )}
            </div>
          );

          return (
            <div
              key={msg.id}
              onMouseEnter={() => !isEditing && setHoveredMsg(msg.id)}
              onMouseLeave={() => setHoveredMsg(null)}
              style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}
            >
              {!isMe && (
                <div style={{ width: 32, flexShrink: 0 }}>
                  {showAvatar && <img src={active.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />}
                </div>
              )}

              {/* Action bar for their messages: appears to the RIGHT of the bubble */}
              {!isMe && actionBar}

              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 3 }}>
                {isEditing ? (
                  /* Inline edit mode */
                  <div style={{ width: '100%', minWidth: 220 }}>
                    <textarea
                      autoFocus
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(active.id, msg.id); }
                        if (e.key === 'Escape') { setEditingMsgId(null); setEditText(''); }
                      }}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        background: '#111', border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '14px 14px 4px 14px',
                        padding: '10px 14px', color: '#fff',
                        fontSize: tokens.fontSizes.sm, lineHeight: 1.55, fontFamily: 'inherit',
                        resize: 'none', outline: 'none', minHeight: 44,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 6, marginTop: 5, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => { setEditingMsgId(null); setEditText(''); }}
                        style={{ padding: '4px 11px', borderRadius: 6, border: `1px solid rgba(255,255,255,0.1)`, background: 'none', color: '#71717a', fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => saveEdit(active.id, msg.id)}
                        disabled={!editText.trim()}
                        style={{ padding: '4px 11px', borderRadius: 6, border: 'none', background: editText.trim() ? D.accent : 'rgba(0,112,243,0.2)', color: editText.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, fontFamily: 'inherit', cursor: editText.trim() ? 'pointer' : 'default' }}
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal bubble */
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.deleted ? 'transparent' : isMe ? D.myBubble : D.theirBubble,
                    color: msg.deleted ? D.muted : isMe ? D.myBubbleText : D.theirBubbleText,
                    border: msg.deleted ? `1px solid rgba(255,255,255,0.07)` : 'none',
                    fontSize: tokens.fontSizes.sm, lineHeight: 1.55,
                    fontStyle: msg.deleted ? 'italic' : 'normal',
                  }}>
                    {msg.deleted ? '삭제된 메시지입니다' : msg.text}
                  </div>
                )}
                <div style={{ fontSize: '10px', color: D.muted, paddingInline: 4, display: 'flex', gap: 5, alignItems: 'center' }}>
                  {isMe && active.lastReadMsgId === msg.id && !msg.deleted && (
                    <span style={{ color: D.accent, fontWeight: 600 }}>읽음</span>
                  )}
                  {!msg.deleted && msg.edited && !isEditing && (
                    <span>수정됨</span>
                  )}
                  {msg.time}
                </div>
              </div>

              {/* Action bar for my messages: appears to the LEFT of the bubble (row-reverse) */}
              {isMe && actionBar}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${D.border}`, display: 'flex', gap: 10, alignItems: 'flex-end', background: D.sidebar, flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="메시지 입력..."
          rows={1}
          style={{
            flex: 1, background: D.input, border: `1px solid rgba(255,255,255,0.1)`,
            borderRadius: 20, padding: '10px 16px', fontSize: tokens.fontSizes.sm,
            color: D.heading, fontFamily: 'inherit', resize: 'none', outline: 'none',
            lineHeight: 1.5, maxHeight: 120, overflowY: 'auto',
            transition: `border-color ${tokens.transitions.fast}`,
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none', flexShrink: 0,
            background: input.trim() ? D.accent : 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            transition: `background ${tokens.transitions.fast}`,
          }}
        >
          <SendIcon size={16} color={input.trim() ? '#fff' : D.muted} />
        </button>
      </div>
    </div>
  ) : (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 600, color: D.body }}>대화를 선택하거나 새 메시지를 작성하세요</div>
      <button
        onClick={() => setShowNewMsg(true)}
        style={{
          background: D.accent, color: '#fff', border: 'none',
          borderRadius: 9, padding: '11px 22px', fontSize: tokens.fontSizes.sm,
          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        새 메시지 작성
      </button>
    </div>
  );

  const NAV_H = 56;

  return (
    <>
      {newMsgModal}
      <div style={{ height: `calc(100vh - ${NAV_H}px)`, background: D.bg, display: 'flex', overflow: 'hidden' }}>
        {isMobile ? (
          activeId ? thread : sidebar
        ) : (
          <>
            {sidebar}
            {thread}
          </>
        )}
      </div>
    </>
  );
};

export default Messages;
