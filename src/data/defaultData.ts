export interface SocialLink {
  type: 'github' | 'email' | 'twitter' | 'linkedin' | 'website';
  url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  stars?: number;
  imageGradient: string;
}

export interface Experience {
  id: string;
  type: 'work' | 'education';
  title: string;
  organization: string;
  period: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  likes: number;
  views: number;
  readingTime: number;
}

export interface ProfileData {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatar: string;
  location: string;
  role: string;
  yearsOfExp: number;
  followers: number;
  following: number;
  skills: string[];
  socialLinks: SocialLink[];
  experience: Experience[];
  projects: Project[];
  posts: Post[];
}

export interface Job {
  id: string;
  company: string;
  logo: string;
  title: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary: string;
  tags: string[];
  description: string;
  posted: string;
  featured?: boolean;
}

export interface ExploreProfile {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  location: string;
  skills: string[];
  followers: number;
}

export const defaultProfile: ProfileData = {
  id: 'user-1',
  name: '김민준',
  headline: 'Full-Stack Developer · React & Node.js 전문',
  bio: '5년차 풀스택 개발자입니다. 오픈소스에 열정을 가지고 있으며, 사용자 경험을 중심에 둔 제품을 만드는 것을 좋아합니다. 현재는 개발자 생산성 툴링과 AI 통합에 집중하고 있습니다.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minjun&backgroundColor=b6e3f4',
  location: '서울, 대한민국',
  role: 'Full-Stack Developer',
  yearsOfExp: 5,
  followers: 1240,
  following: 310,
  skills: ['TypeScript', 'React', 'Node.js', 'Next.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'GraphQL', 'Rust'],
  socialLinks: [
    { type: 'github', url: 'https://github.com' },
    { type: 'email', url: 'mailto:minjun@example.dev' },
    { type: 'twitter', url: 'https://twitter.com' },
    { type: 'website', url: 'https://example.dev' },
  ],
  experience: [
    {
      id: 'exp-1',
      type: 'work',
      title: 'Senior Frontend Engineer',
      organization: 'Toss (비바리퍼블리카)',
      period: '2022.03 – 현재',
      description: 'React/TypeScript 기반 금융 앱 개발. 성능 최적화로 LCP 40% 개선, 디자인 시스템 구축 및 유지보수.',
    },
    {
      id: 'exp-2',
      type: 'work',
      title: 'Full-Stack Developer',
      organization: 'Kakao Corp.',
      period: '2020.01 – 2022.02',
      description: 'Node.js / React 기반 내부 툴 개발. MSA 전환 프로젝트 참여, API 설계 및 DB 최적화.',
    },
    {
      id: 'exp-3',
      type: 'education',
      title: '컴퓨터공학과 학사',
      organization: '연세대학교',
      period: '2015.03 – 2019.08',
      description: '자료구조, 알고리즘, 운영체제, 컴퓨터 네트워크 전공. 졸업논문: 분산 캐시 시스템 설계.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'DevFlow CLI',
      description: '개발 워크플로우를 자동화하는 CLI 툴. git hooks, CI/CD 템플릿 생성 등 지원.',
      longDescription: 'DevFlow CLI는 개발자의 반복적인 작업을 자동화하여 생산성을 높이는 오픈소스 커맨드라인 툴입니다.\n\n## 주요 기능\n- Git hooks 자동 설정 (pre-commit, pre-push lint/test)\n- CI/CD 파이프라인 템플릿 생성 (GitHub Actions, CircleCI)\n- 프로젝트 보일러플레이트 스캐폴딩\n- 팀 컨벤션 공유 및 동기화\n\n## 기술 스택\nRust로 작성된 네이티브 바이너리로 빠른 실행 속도를 자랑하며, npm/brew를 통해 배포됩니다.\n\n500+ GitHub Stars, 120+ Contributors',
      techStack: ['Rust', 'CLI', 'GitHub Actions', 'npm'],
      githubUrl: 'https://github.com',
      stars: 547,
      imageGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    },
    {
      id: 'proj-2',
      title: 'QueryPilot',
      description: 'AI 기반 SQL 쿼리 최적화 도구. 슬로우 쿼리를 분석하고 인덱스 추천까지.',
      longDescription: 'QueryPilot은 PostgreSQL/MySQL 슬로우 쿼리를 자동 분석하여 최적화 제안을 제공하는 웹 앱입니다.\n\n## 핵심 기능\n- EXPLAIN ANALYZE 결과 시각화\n- AI 기반 인덱스 추천\n- 쿼리 히스토리 및 버전 관리\n- 팀 공유 및 댓글 기능\n\n자사 서비스에 적용 후 평균 쿼리 응답 시간 65% 단축.',
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'OpenAI API', 'Prisma'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.dev',
      stars: 231,
      imageGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'proj-3',
      title: 'RealtimeSync',
      description: '실시간 협업 문서 편집기. Operational Transform 알고리즘 직접 구현.',
      longDescription: 'Google Docs와 유사한 실시간 협업 편집기를 Operational Transform 알고리즘을 직접 구현하여 만든 프로젝트입니다.\n\n## 구현 내용\n- OT 알고리즘 구현 (insert/delete operations)\n- WebSocket 기반 실시간 동기화\n- 커서 위치 공유 및 사용자 presence\n- 오프라인 지원 및 재연결 처리',
      techStack: ['React', 'Node.js', 'WebSocket', 'Redis', 'TypeScript'],
      githubUrl: 'https://github.com',
      stars: 189,
      imageGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    },
    {
      id: 'proj-4',
      title: 'Pocketbase Dashboard',
      description: 'Pocketbase용 오픈소스 관리자 대시보드 UI. 컬렉션 관리, 실시간 로그 뷰어.',
      longDescription: 'Pocketbase의 기본 관리자 UI를 대체하는 더 강력한 대시보드입니다.\n\n## 기능\n- 컬렉션 CRUD 인터페이스\n- 실시간 로그 스트리밍\n- 사용자 관리 및 권한 설정\n- 다크 모드 지원',
      techStack: ['SvelteKit', 'TypeScript', 'Pocketbase', 'TailwindCSS'],
      githubUrl: 'https://github.com',
      stars: 92,
      imageGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  ],
  posts: [
    {
      id: 'post-1',
      title: 'Rust로 CLI 툴 만들기 — 처음부터 npm 배포까지',
      excerpt: 'Node.js에서 Rust로 CLI를 다시 작성했을 때 얻은 것들: 10배 빠른 실행 속도, 단일 바이너리, 그리고 배운 점들을 공유합니다.',
      content: `# Rust로 CLI 툴 만들기

Node.js로 처음 만들었던 DevFlow CLI를 Rust로 재작성하면서 배운 것들을 공유합니다.

## 왜 Rust인가?

CLI 툴에서 가장 중요한 것은 **시작 시간(startup time)**입니다. Node.js는 V8 엔진을 띄우는 데만 100-300ms가 걸리지만, Rust 바이너리는 거의 즉시 실행됩니다.

## 핵심 크레이트

\`\`\`toml
[dependencies]
clap = { version = "4", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
anyhow = "1"
colored = "2"
\`\`\`

## 결론

10배 빠른 실행, 단일 바이너리 배포, 타입 안전성. 단점은 컴파일 시간과 러닝커브입니다.`,
      date: '2024-11-15',
      tags: ['Rust', 'CLI', 'DevTools'],
      likes: 312,
      views: 8420,
      readingTime: 8,
    },
    {
      id: 'post-2',
      title: 'React 19의 Concurrent Features 실전 활용기',
      excerpt: 'useTransition, useDeferredValue, Suspense를 프로덕션에서 써보며 느낀 점. 어떨 때 쓰고 어떨 때 피해야 하는지.',
      content: `# React 19 Concurrent Features 실전 활용기

React 19의 동시성 기능들을 실제 프로덕션 코드에 적용해봤습니다.

## useTransition

상태 업데이트를 "긴급하지 않음"으로 표시하여 UI가 응답성을 유지하게 합니다.

\`\`\`tsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
  setSearchQuery(value);
});
\`\`\`

## 언제 쓰면 좋은가?

- 검색 필터링
- 탭 전환
- 큰 목록 렌더링

반면 폼 제출, 모달 닫기 같은 즉각적인 피드백이 필요한 경우엔 사용하지 마세요.`,
      date: '2024-10-22',
      tags: ['React', 'TypeScript', 'Performance'],
      likes: 198,
      views: 5670,
      readingTime: 6,
    },
    {
      id: 'post-3',
      title: 'PostgreSQL 인덱스 전략 — 실수와 교훈',
      excerpt: '프로덕션에서 슬로우 쿼리를 잡으면서 배운 인덱스 설계의 함정들. B-tree, GIN, 부분 인덱스 실전 비교.',
      content: `# PostgreSQL 인덱스 전략

프로덕션에서 만난 슬로우 쿼리들을 분석하며 배운 인덱스 설계 패턴입니다.

## 복합 인덱스 컬럼 순서

\`\`\`sql
-- 나쁜 예: 카디널리티 낮은 컬럼 먼저
CREATE INDEX ON orders (status, user_id);

-- 좋은 예: 카디널리티 높은 컬럼 먼저
CREATE INDEX ON orders (user_id, status);
\`\`\`

## 부분 인덱스

활성 레코드에만 인덱스를 걸어 인덱스 크기를 줄입니다.

\`\`\`sql
CREATE INDEX ON orders (created_at) WHERE status = 'pending';
\`\`\``,
      date: '2024-09-05',
      tags: ['PostgreSQL', 'Database', 'Performance'],
      likes: 445,
      views: 12300,
      readingTime: 10,
    },
    {
      id: 'post-4',
      title: 'TypeScript 5.x 유틸리티 타입 마스터하기',
      excerpt: 'Awaited, NoInfer, Readonly, 조건부 타입까지. 실무에서 자주 쓰이는 TypeScript 고급 패턴 정리.',
      content: `# TypeScript 5.x 유틸리티 타입

실무에서 자주 쓰는 TypeScript 패턴들을 정리했습니다.

## Awaited

비동기 함수의 반환 타입을 추론합니다.

\`\`\`ts
type Result = Awaited<Promise<string>>; // string
\`\`\`

## NoInfer (5.4+)

타입 추론을 막을 때 씁니다.

\`\`\`ts
function createStore<T>(initial: NoInfer<T>, getter: () => T): T {
  return getter();
}
\`\`\``,
      date: '2024-08-18',
      tags: ['TypeScript', 'JavaScript'],
      likes: 267,
      views: 7890,
      readingTime: 7,
    },
  ],
};

export const sampleJobs: Job[] = [
  {
    id: 'job-1',
    company: 'Toss',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Toss&backgroundColor=0064ff',
    title: 'Frontend Engineer (React)',
    location: '서울 · 원격 가능',
    type: 'full-time',
    salary: '7,000 – 12,000만원',
    tags: ['React', 'TypeScript', 'Next.js'],
    description: 'Toss 앱을 수천만 사용자에게 제공하는 프론트엔드 팀에 합류하세요.',
    posted: '2일 전',
    featured: true,
  },
  {
    id: 'job-2',
    company: 'Kakao',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Kakao&backgroundColor=fee500',
    title: 'Backend Engineer (Node.js)',
    location: '판교',
    type: 'full-time',
    salary: '6,000 – 10,000만원',
    tags: ['Node.js', 'NestJS', 'MySQL', 'Redis'],
    description: 'KakaoTalk 서버 개발팀에서 대규모 트래픽을 처리하는 API 서버를 개발합니다.',
    posted: '5일 전',
    featured: true,
  },
  {
    id: 'job-3',
    company: 'Coupang',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Coupang&backgroundColor=ee2c2c',
    title: 'Senior Software Engineer',
    location: '서울 · 미국 시애틀',
    type: 'full-time',
    salary: '$150K – $220K',
    tags: ['Java', 'Kotlin', 'MSA', 'AWS'],
    description: '쿠팡 물류 플랫폼의 핵심 시스템을 설계하고 개발하는 팀입니다.',
    posted: '1주 전',
  },
  {
    id: 'job-4',
    company: 'Wanted',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Wanted&backgroundColor=36f',
    title: 'Full-Stack Developer',
    location: '서울 · 원격',
    type: 'remote',
    salary: '4,800 – 7,000만원',
    tags: ['React', 'Python', 'Django', 'PostgreSQL'],
    description: '원티드의 채용 플랫폼 서비스 개발을 함께 할 개발자를 찾습니다.',
    posted: '3일 전',
  },
  {
    id: 'job-5',
    company: 'Krafton',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Krafton&backgroundColor=1a1a2e',
    title: 'Game Backend Engineer',
    location: '서울',
    type: 'full-time',
    salary: '6,000 – 9,500만원',
    tags: ['C++', 'Go', 'Game Server', 'AWS'],
    description: '크래프톤의 글로벌 게임 서버 인프라를 구축하는 팀에서 함께할 분을 찾습니다.',
    posted: '1주 전',
  },
  {
    id: 'job-6',
    company: 'Line',
    logo: 'https://api.dicebear.com/7.x/initials/svg?seed=Line&backgroundColor=00b900',
    title: 'iOS Developer',
    location: '도쿄 · 분당',
    type: 'full-time',
    salary: '5,500 – 9,000만원',
    tags: ['Swift', 'SwiftUI', 'iOS', 'Objective-C'],
    description: 'LINE 앱의 iOS 클라이언트 개발 및 새로운 기능 구현을 담당합니다.',
    posted: '4일 전',
  },
];

export const exploreProfiles: ExploreProfile[] = [
  {
    id: 'p-1',
    name: '이서연',
    headline: 'iOS Engineer · Swift & SwiftUI',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seoyeon&backgroundColor=ffd5dc',
    location: '서울',
    skills: ['Swift', 'SwiftUI', 'Combine', 'UIKit'],
    followers: 892,
  },
  {
    id: 'p-2',
    name: '박도현',
    headline: 'ML Engineer · LLM & Computer Vision',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dohyun&backgroundColor=c0aede',
    location: '판교',
    skills: ['Python', 'PyTorch', 'LangChain', 'FastAPI'],
    followers: 2140,
  },
  {
    id: 'p-3',
    name: '최지은',
    headline: 'DevOps · Kubernetes & Platform Eng',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jieun&backgroundColor=b6e3f4',
    location: '원격',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Go'],
    followers: 1350,
  },
  {
    id: 'p-4',
    name: '정우진',
    headline: 'Blockchain Developer · Solidity & Web3',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=woojin&backgroundColor=d1d4f9',
    location: '서울',
    skills: ['Solidity', 'TypeScript', 'Rust', 'EVM'],
    followers: 765,
  },
  {
    id: 'p-5',
    name: '강민서',
    headline: 'Frontend Engineer · Design System 전문',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minseo&backgroundColor=f4d58d',
    location: '서울',
    skills: ['React', 'TypeScript', 'Storybook', 'CSS'],
    followers: 1120,
  },
  {
    id: 'p-6',
    name: '한재원',
    headline: 'Backend Engineer · Go & Distributed Systems',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jaewon&backgroundColor=a8e6cf',
    location: '부산',
    skills: ['Go', 'gRPC', 'Kafka', 'PostgreSQL'],
    followers: 980,
  },
];
