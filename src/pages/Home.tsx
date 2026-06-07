import React, { useState, useEffect, useRef } from 'react';
import { tokens } from '../tokens';
import type { Page } from '../App';
import type { ProfileData } from '../data/defaultData';
import { MOBILE_NAV_H, DESKTOP_NAV_H } from '../components/Nav';
import { HeartIcon, EyeIcon, ClockIcon } from '../components/Icons';

interface HomeProps {
  profile: ProfileData | null;
  onNavigate: (page: Page) => void;
}

const D = {
  bg: '#000', card: '#0f0f0f', card2: '#0a0a0a',
  border: 'rgba(255,255,255,0.08)', borderHover: 'rgba(255,255,255,0.18)',
  heading: '#fff', body: '#a1a1aa', muted: '#52525b',
  accent: '#3D7BFF', accentDim: 'rgba(61,123,255,0.1)',
};

const GRAD = [
  'linear-gradient(135deg,#1a56db,#6366f1)',
  'linear-gradient(135deg,#0ea5e9,#22d3ee)',
  'linear-gradient(135deg,#7c3aed,#ec4899)',
  'linear-gradient(135deg,#059669,#10b981)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#8b5cf6,#06b6d4)',
  'linear-gradient(135deg,#ec4899,#f97316)',
  'linear-gradient(135deg,#14b8a6,#3b82f6)',
];

const DEVS = [
  { id:'d1', name:'김민준', role:'Frontend Engineer', company:'Kakao', skills:['React','TypeScript','Next.js'], grad:GRAD[0], followers:1842 },
  { id:'d2', name:'이서연', role:'Backend Developer', company:'Naver', skills:['Go','gRPC','PostgreSQL'], grad:GRAD[1], followers:967 },
  { id:'d3', name:'박지호', role:'ML Engineer', company:'Kakao Brain', skills:['Python','PyTorch','CUDA'], grad:GRAD[2], followers:2341 },
  { id:'d4', name:'최유진', role:'DevOps Engineer', company:'Toss', skills:['Kubernetes','Terraform','AWS'], grad:GRAD[3], followers:743 },
  { id:'d5', name:'정다은', role:'iOS Developer', company:'Coupang', skills:['Swift','SwiftUI','Combine'], grad:GRAD[4], followers:1205 },
  { id:'d6', name:'한승우', role:'Full-stack Dev', company:'Woowa Brothers', skills:['Vue','Spring','MySQL'], grad:GRAD[5], followers:589 },
];

const POSTS = [
  {
    id:'p1', title:'Rust로 배우는 메모리 안전성: 실전 예제 모음',
    author:'김민준', authorGrad:GRAD[0], date:'2시간 전',
    likes:47, views:1204, tags:['Rust','메모리','시스템'], readTime:8,
    excerpt:'소유권 시스템과 빌림 검사기를 중심으로 Rust의 메모리 안전성 보장 메커니즘을 실제 코드와 함께 살펴봅니다.',
  },
  {
    id:'p2', title:'React 19 서버 컴포넌트 완전 정복',
    author:'이서연', authorGrad:GRAD[1], date:'5시간 전',
    likes:89, views:3421, tags:['React','Next.js','SSR'], readTime:12,
    excerpt:'RSC의 동작 원리부터 실제 프로덕션 적용 사례까지 단계별로 정리했습니다. 마이그레이션 가이드 포함.',
  },
  {
    id:'p3', title:'Kubernetes 비용 최적화 실전 가이드',
    author:'최유진', authorGrad:GRAD[3], date:'1일 전',
    likes:134, views:5678, tags:['Kubernetes','DevOps','Cloud'], readTime:15,
    excerpt:'클러스터 비용을 30% 줄인 경험을 바탕으로 리소스 설정, 오토스케일링, Spot 인스턴스 활용법을 공유합니다.',
  },
  {
    id:'p4', title:'TypeScript 5.x 새 기능 총정리',
    author:'정다은', authorGrad:GRAD[4], date:'2일 전',
    likes:201, views:8934, tags:['TypeScript','개발도구'], readTime:10,
    excerpt:'Const type parameters, using 키워드, Verbatim Module Syntax 등 주요 변경사항을 코드 예제와 함께 정리했습니다.',
  },
];

const TAGS = [
  { name:'TypeScript', count:342 }, { name:'React', count:287 },
  { name:'Kubernetes', count:198 }, { name:'Go', count:176 },
  { name:'Rust', count:143 }, { name:'Next.js', count:128 },
  { name:'Python', count:115 }, { name:'GraphQL', count:94 },
];

const JOBS = [
  { id:'j1', company:'Toss', role:'Frontend Engineer', tags:['React','TypeScript'], location:'서울', grad:'linear-gradient(135deg,#1a56db,#3b82f6)' },
  { id:'j2', company:'Kakao', role:'Backend Developer', tags:['Go','MSA'], location:'판교', grad:'linear-gradient(135deg,#f59e0b,#f97316)' },
  { id:'j3', company:'Naver', role:'ML Engineer', tags:['PyTorch','Python'], location:'분당', grad:'linear-gradient(135deg,#059669,#10b981)' },
];

const Home: React.FC<HomeProps> = ({ profile, onNavigate }) => {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 6 ? '잘 주무셨나요' : hour < 12 ? '좋은 아침이에요' : hour < 18 ? '안녕하세요' : '오늘도 수고하셨어요';
  const firstName = profile?.name?.trim().split(' ')[0] || '개발자';

  const toggleFollow = (id: string) => setFollowed(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const toggleLike = (id: string) => setLikedPosts(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const botPad = isMobile ? MOBILE_NAV_H + 24 : 80;

  /* ── sub-sections ── */
  const DevCard = ({ dev }: { dev: typeof DEVS[0] }) => {
    const isFollowed = followed.has(dev.id);
    return (
      <div style={{
        background: D.card, border: `1px solid ${D.border}`, borderRadius: 14,
        padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12,
        flexShrink: 0, width: isMobile ? 200 : '100%',
        transition: `border-color 0.15s`,
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: dev.grad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: 16, flexShrink: 0,
          }}>
            {[...dev.name][0]}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 700, color: D.heading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dev.name}</div>
            <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dev.role}</div>
          </div>
        </div>
        <div style={{ fontSize: tokens.fontSizes.xs, color: D.body }}>{dev.company} · {dev.followers.toLocaleString()} 팔로워</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {dev.skills.slice(0, 3).map(s => (
            <span key={s} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${D.border}`, color: D.body, padding: '2px 8px', borderRadius: 999, fontSize: 10 }}>{s}</span>
          ))}
        </div>
        <button
          onClick={() => toggleFollow(dev.id)}
          style={{
            width: '100%', padding: '8px', borderRadius: 8,
            border: isFollowed ? `1px solid ${D.border}` : '1px solid rgba(255,255,255,0.25)',
            background: isFollowed ? 'transparent' : '#000',
            color: isFollowed ? D.body : '#fff',
            fontSize: tokens.fontSizes.xs, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.15s',
          }}
        >
          {isFollowed ? '팔로잉' : '+ 팔로우'}
        </button>
      </div>
    );
  };

  const PostCard = ({ post }: { post: typeof POSTS[0] }) => {
    const isLiked = likedPosts.has(post.id);
    return (
      <div style={{
        background: D.card, border: `1px solid ${D.border}`, borderRadius: 14, padding: '20px 20px 16px',
        cursor: 'pointer', transition: 'border-color 0.15s',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
      >
        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: post.authorGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
            {[...post.author][0]}
          </div>
          <div>
            <span style={{ fontSize: tokens.fontSizes.xs, fontWeight: 600, color: D.body }}>{post.author}</span>
            <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted }}> · {post.date}</span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, color: D.muted, fontSize: tokens.fontSizes.xs }}>
            <ClockIcon size={11} color={D.muted} /> {post.readTime}분
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: '0 0 8px', lineHeight: 1.35, letterSpacing: '-0.3px' }}>
          {post.title}
        </h3>

        {/* Excerpt */}
        <p style={{ fontSize: tokens.fontSizes.sm, color: D.body, margin: '0 0 14px', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {post.excerpt}
        </p>

        {/* Tags + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {post.tags.map(t => (
            <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${D.border}`, color: D.muted, padding: '2px 9px', borderRadius: 999, fontSize: 11 }}>
              {t}
            </span>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <button
              onClick={e => { e.stopPropagation(); toggleLike(post.id); }}
              style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? '#f87171' : D.muted, fontSize: tokens.fontSizes.xs, fontFamily: 'inherit', padding: 0, transition: 'color 0.15s' }}
            >
              <HeartIcon size={13} color={isLiked ? '#f87171' : D.muted} />
              {post.likes + (isLiked ? 1 : 0)}
            </button>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: D.muted, fontSize: tokens.fontSizes.xs }}>
              <EyeIcon size={13} color={D.muted} /> {post.views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <h2 style={{ fontSize: tokens.fontSizes.md, fontWeight: 700, color: D.heading, margin: 0, letterSpacing: '-0.3px' }}>{title}</h2>
      {action && <button onClick={onAction} style={{ background: 'none', border: 'none', color: D.accent, fontSize: tokens.fontSizes.xs, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{action}</button>}
    </div>
  );

  const TrendingTags = () => (
    <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 14, padding: '18px 18px 16px' }}>
      <SectionHeader title="인기 태그" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {TAGS.map(t => (
          <button
            key={t.name}
            onClick={() => onNavigate('explore')}
            style={{
              background: 'rgba(255,255,255,0.04)', border: `1px solid ${D.border}`,
              color: D.body, padding: '5px 11px', borderRadius: 999,
              fontSize: tokens.fontSizes.xs, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = D.borderHover; e.currentTarget.style.color = D.heading; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.color = D.body; }}
          >
            {t.name}
            <span style={{ color: D.muted, fontSize: 10 }}>{t.count}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const HotJobs = () => (
    <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 14, padding: '18px 18px 14px' }}>
      <SectionHeader title="채용 하이라이트" action="전체보기" onAction={() => onNavigate('jobs')} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {JOBS.map(j => (
          <button
            key={j.id}
            onClick={() => onNavigate('jobs')}
            style={{
              display: 'flex', alignItems: 'center', gap: 11,
              background: D.card2, border: `1px solid ${D.border}`, borderRadius: 10, padding: '12px 12px',
              cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = D.borderHover)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = D.border)}
          >
            <div style={{ width: 34, height: 34, borderRadius: 8, background: j.grad, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>
              {j.company[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.role}</div>
              <div style={{ fontSize: tokens.fontSizes.xs, color: D.muted, marginTop: 2 }}>{j.company} · {j.location}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
              {j.tags.slice(0, 1).map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${D.border}`, color: D.muted, padding: '2px 7px', borderRadius: 999, fontSize: 10 }}>{t}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const FollowSidebar = () => (
    <div style={{ background: D.card, border: `1px solid ${D.border}`, borderRadius: 14, padding: '18px 18px 14px' }}>
      <SectionHeader title="팔로우 추천" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {DEVS.slice(0, 5).map(dev => {
          const isFollowed = followed.has(dev.id);
          return (
            <div key={dev.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: dev.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                {[...dev.name][0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: tokens.fontSizes.sm, fontWeight: 600, color: D.heading, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dev.name}</div>
                <div style={{ fontSize: 11, color: D.muted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dev.role}</div>
              </div>
              <button
                onClick={() => toggleFollow(dev.id)}
                style={{
                  padding: '5px 12px', borderRadius: 7, flexShrink: 0,
                  border: isFollowed ? `1px solid ${D.border}` : '1px solid rgba(255,255,255,0.25)',
                  background: isFollowed ? 'transparent' : '#000',
                  color: isFollowed ? D.muted : '#fff',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                {isFollowed ? '팔로잉' : '팔로우'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ background: D.bg, minHeight: '100vh' }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: `28px 20px ${botPad}px`,
        display: isMobile ? 'block' : 'grid',
        gridTemplateColumns: '1fr 308px',
        gap: 24, alignItems: 'start',
      }}>

        {/* ── Main column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Greeting */}
          <div style={{ padding: '4px 0 8px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
              <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: D.heading, margin: 0, letterSpacing: '-0.4px' }}>
                {greeting}, {firstName}님
              </h1>
              <span style={{ fontSize: tokens.fontSizes.xs, color: D.muted, flexShrink: 0 }}>
                {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </span>
            </div>
            {profile?.headline && (
              <p style={{ fontSize: tokens.fontSizes.sm, color: D.muted, margin: 0 }}>
                {profile.headline}
              </p>
            )}
          </div>

          {/* ── Dev recommendations (horizontal scroll on mobile, grid on desktop) ── */}
          <div>
            <SectionHeader title="추천 개발자" action="탐색하기" onAction={() => onNavigate('explore')} />
            {isMobile ? (
              <div
                ref={scrollRef}
                style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}
              >
                {DEVS.map(dev => <DevCard key={dev.id} dev={dev} />)}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {DEVS.map(dev => <DevCard key={dev.id} dev={dev} />)}
              </div>
            )}
          </div>

          {/* ── Post feed ── */}
          <div>
            <SectionHeader title="커뮤니티 피드" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {POSTS.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          </div>

          {/* Mobile: trending + jobs below feed */}
          {isMobile && (
            <>
              <TrendingTags />
              <HotJobs />
            </>
          )}
        </div>

        {/* ── Sidebar (desktop only) ── */}
        {!isMobile && (
          <div style={{ position: 'sticky', top: DESKTOP_NAV_H + 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <FollowSidebar />
            <TrendingTags />
            <HotJobs />
          </div>
        )}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Home;
