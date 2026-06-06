import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import PostDetail from './pages/PostDetail';
import PostEditor from './pages/PostEditor';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Companies from './pages/Companies';
import CompanyView from './pages/CompanyView';
import CompanyManage from './pages/CompanyManage';
import Messages from './pages/Messages';
import {
  type ProfileData,
  type Company,
} from './data/defaultData';

export type Page =
  | 'landing'
  | 'profile'
  | 'explore'
  | 'jobs'
  | 'login'
  | 'mypage'
  | 'messages'
  | 'postDetail'
  | 'postEditor'
  | 'settings'
  | 'onboarding'
  | 'companies'
  | 'company'
  | 'companyManage';

const PAGES_WITH_NAV: Page[] = [
  'landing', 'profile', 'explore', 'jobs', 'mypage', 'messages',
  'postDetail', 'postEditor', 'settings', 'companies', 'company', 'companyManage',
];

const PROFILE_KEY = 'empl.profile';
const COMPANIES_KEY = 'empl.companies';
const LOGGED_KEY = 'empl.loggedIn';
const COMPANIES_VER_KEY = 'empl.companiesVer';
const COMPANIES_VER = '2';

function loadProfile(): ProfileData | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as ProfileData) : null;
  } catch {
    return null;
  }
}

function loadCompanies(): Company[] {
  try {
    if (localStorage.getItem(COMPANIES_VER_KEY) !== COMPANIES_VER) {
      localStorage.removeItem(COMPANIES_KEY);
      localStorage.setItem(COMPANIES_VER_KEY, COMPANIES_VER);
      return [];
    }
    const raw = localStorage.getItem(COMPANIES_KEY);
    return raw ? (JSON.parse(raw) as Company[]) : [];
  } catch {
    return [];
  }
}

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [activePostId, setActivePostId] = useState<string>('post-1');

  const [profile, setProfile] = useState<ProfileData | null>(loadProfile);
  const [companies, setCompanies] = useState<Company[]>(loadCompanies);
  const [loggedIn, setLoggedIn] = useState<boolean>(
    () => localStorage.getItem(LOGGED_KEY) === '1' || loadProfile() !== null,
  );

  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  /* ── persistence ── */
  useEffect(() => {
    if (profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(PROFILE_KEY);
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(LOGGED_KEY, loggedIn ? '1' : '0');
  }, [loggedIn]);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (postId: string) => {
    setActivePostId(postId);
    navigate('postDetail');
  };

  const handleNewPost = () => {
    setEditingPostId(null);
    navigate('postEditor');
  };

  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    navigate('postEditor');
  };

  const handleSavePost = (post: import('./data/defaultData').Post) => {
    setProfile(prev => {
      if (!prev) return prev;
      const exists = prev.posts.some(p => p.id === post.id);
      const posts = exists ? prev.posts.map(p => p.id === post.id ? post : p) : [post, ...prev.posts];
      return { ...prev, posts };
    });
    navigate('profile');
  };

  const handleLogin = () => {
    setLoggedIn(true);
    navigate(profile ? 'profile' : 'onboarding');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('landing');
  };

  /* ── onboarding completion ── */
  const completeOnboarding = (p: ProfileData) => {
    setProfile(p);
    setLoggedIn(true);
    navigate('profile');
  };

  const loadSampleProfile = () => {
    setLoggedIn(true);
    navigate('onboarding');
  };

  const resetProfile = () => {
    setProfile(null);
    navigate('onboarding');
  };

  /* ── company management ── */
  const openCompany = (id: string) => {
    setActiveCompanyId(id);
    navigate('company');
  };

  const startCreateCompany = () => {
    setEditingCompanyId(null);
    navigate('companyManage');
  };

  const startEditCompany = (id: string) => {
    setEditingCompanyId(id);
    navigate('companyManage');
  };

  const saveCompany = (company: Company) => {
    setCompanies(prev => {
      const exists = prev.some(c => c.id === company.id);
      return exists ? prev.map(c => (c.id === company.id ? company : c)) : [company, ...prev];
    });
    setActiveCompanyId(company.id);
    navigate('company');
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    navigate('companies');
  };

  const activeCompany = companies.find(c => c.id === activeCompanyId) ?? null;
  const editingCompany = companies.find(c => c.id === editingCompanyId) ?? null;

  const showNav = PAGES_WITH_NAV.includes(page);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: '#000', minHeight: '100vh' }}>
      {showNav && (
        <Nav
          currentPage={page}
          onNavigate={navigate}
          isLoggedIn={loggedIn}
          profile={profile}
          onLogout={handleLogout}
        />
      )}

      {page === 'landing' && <Landing onNavigate={navigate} />}

      {page === 'profile' && (
        <Profile
          profile={profile}
          onPostClick={handlePostClick}
          onInitialize={() => navigate('onboarding')}
          onEdit={() => navigate('settings')}
          onUpdateProfile={setProfile}
          onNewPost={handleNewPost}
          onEditPost={handleEditPost}
        />
      )}

      {page === 'explore' && <Explore onNavigate={navigate} />}
      {page === 'jobs' && <Jobs />}
      {page === 'messages' && <Messages />}

      {page === 'login' && <Login onLogin={handleLogin} onNavigate={navigate} />}

      {page === 'mypage' && (
        <MyPage
          profile={profile}
          companies={companies}
          onNavigate={navigate}
          onInitialize={() => navigate('onboarding')}
          onOpenCompany={openCompany}
          onManageCompanies={() => navigate('companies')}
        />
      )}

      {page === 'postDetail' && (
        <PostDetail postId={activePostId} profile={profile} onBack={() => navigate('profile')} />
      )}

      {page === 'postEditor' && (
        <PostEditor
          post={editingPostId ? (profile?.posts.find(p => p.id === editingPostId) ?? null) : null}
          onSave={handleSavePost}
          onCancel={() => navigate(editingPostId ? 'profile' : 'profile')}
        />
      )}

      {page === 'settings' && (
        <Settings profile={profile} onSave={(p) => { setProfile(p); navigate('profile'); }} onReset={resetProfile} onInitialize={() => navigate('onboarding')} onNewPost={handleNewPost} onEditPost={handleEditPost} />
      )}

      {page === 'onboarding' && (
        <Onboarding onComplete={completeOnboarding} onLoadSample={loadSampleProfile} onCancel={() => navigate('landing')} />
      )}

      {page === 'companies' && (
        <Companies
          companies={companies}
          onOpen={openCompany}
          onCreate={startCreateCompany}
          onManage={startEditCompany}
        />
      )}

      {page === 'company' && (
        <CompanyView
          company={activeCompany}
          onBack={() => navigate('companies')}
          onManage={startEditCompany}
          onUpdate={saveCompany}
        />
      )}

      {page === 'companyManage' && (
        <CompanyManage
          company={editingCompany}
          onSave={saveCompany}
          onDelete={deleteCompany}
          onCancel={() => navigate('companies')}
        />
      )}
    </div>
  );
};

export default App;
