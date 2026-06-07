import { useEffect } from 'react';

type SEOPage =
  | 'landing'
  | 'home'
  | 'explore'
  | 'jobs'
  | 'companies'
  | 'messages'
  | 'profile'
  | 'settings'
  | 'mypage'
  | 'postDetail'
  | 'postEditor'
  | string;

interface SEOOptions {
  customTitle?: string;
  customDescription?: string;
}

const PAGE_TITLES: Record<string, string> = {
  landing: 'empl.dev — 개발자를 위한 커리어 플랫폼',
  home: '홈 — empl.dev',
  explore: '개발자 탐색 — empl.dev',
  jobs: '채용공고 — empl.dev',
  companies: '회사 — empl.dev',
  messages: '메시지 — empl.dev',
  profile: '내 프로필 — empl.dev',
  settings: '설정 — empl.dev',
  mypage: '마이페이지 — empl.dev',
  postEditor: '포스트 작성 — empl.dev',
  default: 'empl.dev',
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  landing: '개발자를 위한 커리어 플랫폼. 채용공고 탐색, 개발자 네트워킹, 커리어 성장을 한 곳에서. empl.dev에서 다음 커리어를 시작하세요.',
  home: '내 홈 피드에서 최신 개발자 소식과 채용공고를 확인하세요.',
  explore: '국내외 개발자 프로필을 탐색하고 새로운 인재를 발견하세요.',
  jobs: '개발자를 위한 최신 채용공고를 탐색하세요. 스타트업부터 대기업까지 다양한 포지션이 기다립니다.',
  companies: '개발자 친화적인 회사들을 탐색하고 문화와 채용정보를 확인하세요.',
  messages: '개발자 커뮤니티와 메시지를 주고받으세요.',
  profile: '내 개발자 프로필을 관리하고 커리어를 어필하세요.',
  settings: '계정 설정 및 프로필 정보를 관리하세요.',
  mypage: '내 활동, 지원 현황, 저장한 공고를 한눈에 확인하세요.',
  postEditor: '새로운 포스트를 작성하고 개발자 커뮤니티와 공유하세요.',
  default: '개발자를 위한 커리어 플랫폼 empl.dev.',
};

function getMetaDescriptionTag(): HTMLMetaElement | null {
  return document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
}

export function useSEO(page: SEOPage, options: SEOOptions = {}): void {
  useEffect(() => {
    const { customTitle, customDescription } = options;

    // Resolve title
    let title: string;
    if (page === 'postDetail') {
      title = customTitle ?? PAGE_TITLES.default;
    } else {
      title = PAGE_TITLES[page] ?? PAGE_TITLES.default;
    }
    document.title = title;

    // Resolve description
    let description: string;
    if (customDescription) {
      description = customDescription;
    } else if (page === 'postDetail') {
      description = customDescription ?? PAGE_DESCRIPTIONS.default;
    } else {
      description = PAGE_DESCRIPTIONS[page] ?? PAGE_DESCRIPTIONS.default;
    }

    // Update <meta name="description">
    let metaDesc = getMetaDescriptionTag();
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [page, options.customTitle, options.customDescription]);
}

export default useSEO;
