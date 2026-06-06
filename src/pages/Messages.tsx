import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../tokens';
import { SendIcon, ArrowLeftIcon } from '../components/Icons';

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
}

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

const SAMPLE: Conversation[] = [
  {
    id: 'c1',
    name: '이서연',
    headline: 'iOS Engineer · Swift & SwiftUI',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seoyeon&backgroundColor=ffd5dc',
    lastMessage: '코드 리뷰 부탁드려도 될까요?',
    timestamp: '방금',
    unread: 2,
    lastReadMsgId: 'm3',
    messages: [
      { id: 'm1', text: '안녕하세요! 김민준님 오픈소스 프로젝트 잘 보고 있어요 🙌', from: 'them', time: '14:31' },
      { id: 'm2', text: '혹시 DevFlow CLI PR 리뷰 부탁드려도 될까요?', from: 'them', time: '14:32' },
      { id: 'm3', text: '아 물론이죠! PR 링크 공유해 주세요.', from: 'me', time: '14:45' },
      { id: 'm4', text: '감사합니다 ☺️ 코드 리뷰 부탁드려도 될까요?', from: 'them', time: '15:02' },
    ],
  },
  {
    id: 'c2',
    name: '박도현',
    headline: 'ML Engineer · LLM & Computer Vision',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dohyun&backgroundColor=c0aede',
    lastMessage: 'LangChain 관련해서 여쭤봐도 될까요?',
    timestamp: '1시간 전',
    unread: 0,
    lastReadMsgId: 'm2',
    messages: [
      { id: 'm1', text: 'QueryPilot 정말 인상적이에요! PostgreSQL 인덱스 최적화 부분 특히요.', from: 'them', time: '10:12' },
      { id: 'm2', text: '감사합니다! 어떤 부분이 제일 도움이 됐나요?', from: 'me', time: '10:18' },
      { id: 'm3', text: 'EXPLAIN ANALYZE 시각화 부분이요. LangChain 관련해서 여쭤봐도 될까요?', from: 'them', time: '10:23' },
    ],
  },
  {
    id: 'c3',
    name: 'Toss HR',
    headline: '인사팀 · 개발자 채용 담당',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Toss&backgroundColor=0064ff',
    lastMessage: '포지션 관련 문의드립니다.',
    timestamp: '어제',
    unread: 1,
    lastReadMsgId: null,
    messages: [
      { id: 'm1', text: '안녕하세요, 김민준님! Toss 채용팀입니다.', from: 'them', time: '어제 16:30' },
      { id: 'm2', text: 'Senior Frontend Engineer 포지션 관련 문의드립니다. 관심 있으신가요?', from: 'them', time: '어제 16:31' },
    ],
  },
  {
    id: 'c4',
    name: '한재원',
    headline: 'Backend Engineer · Go & Distributed Systems',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jaewon&backgroundColor=a8e6cf',
    lastMessage: '다음 달에 오픈소스 컨퍼런스 가시나요?',
    timestamp: '3일 전',
    unread: 0,
    lastReadMsgId: 'm2',
    messages: [
      { id: 'm1', text: 'RealtimeSync OT 구현 보니까 대박이네요. 어떻게 그걸 혼자 구현하셨어요?', from: 'them', time: '3일 전' },
      { id: 'm2', text: '2주 정도 논문 읽으면서 구현했어요 ㅎㅎ', from: 'me', time: '3일 전' },
      { id: 'm3', text: '다음 달에 오픈소스 컨퍼런스 가시나요?', from: 'them', time: '3일 전' },
    ],
  },
];

const Messages: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(SAMPLE);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sendLock = useRef(false);

  const active = conversations.find(c => c.id === activeId) ?? null;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length]);

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
    setTimeout(() => {
      setConversations(prev => prev.map(c =>
        c.id === cid ? { ...c, lastReadMsgId: newMsg.id } : c
      ));
    }, 1500);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* ── Sidebar ── */
  const sidebar = (
    <div style={{
      width: isMobile ? '100%' : 300, flexShrink: 0,
      borderRight: isMobile ? 'none' : `1px solid ${D.border}`,
      background: D.sidebar, display: 'flex', flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ padding: '20px 20px 14px', borderBottom: `1px solid ${D.border}` }}>
        <h2 style={{ fontSize: tokens.fontSizes.lg, fontWeight: 800, color: D.heading, margin: 0, letterSpacing: '-0.4px' }}>메시지</h2>
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
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
                {conv.lastMessage}
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
          <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}>{active.headline}</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {active.messages.map((msg, idx) => {
          const isMe = msg.from === 'me';
          const prevFrom = idx > 0 ? active.messages[idx - 1].from : null;
          const showAvatar = !isMe && prevFrom !== 'them';
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
              {!isMe && (
                <div style={{ width: 32, flexShrink: 0 }}>
                  {showAvatar && <img src={active.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />}
                </div>
              )}
              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', gap: 3 }}>
                <div style={{
                  padding: '10px 14px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: isMe ? D.myBubble : D.theirBubble,
                  color: isMe ? D.myBubbleText : D.theirBubbleText,
                  fontSize: tokens.fontSizes.sm, lineHeight: 1.55,
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: '10px', color: D.muted, paddingInline: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isMe && active.lastReadMsgId === msg.id && (
                    <span style={{ color: D.accent, fontWeight: 600 }}>읽음</span>
                  )}
                  {msg.time}
                </div>
              </div>
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
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
        <div style={{ fontSize: tokens.fontSizes.md, fontWeight: 600, color: D.heading, marginBottom: 8 }}>메시지를 선택하세요</div>
        <div style={{ fontSize: tokens.fontSizes.sm, color: D.muted }}>왼쪽에서 대화를 선택하면 메시지를 볼 수 있어요.</div>
      </div>
    </div>
  );

  const NAV_H = 56;

  return (
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
  );
};

export default Messages;
