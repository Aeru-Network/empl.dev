import React, { useState } from 'react';
import Nav from './components/Nav';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';

type Page = 'landing' | 'profile' | 'explore' | 'jobs' | 'login' | 'mypage' | 'postDetail' | 'settings';

const PAGES_WITH_NAV: Page[] = ['landing', 'profile', 'explore', 'jobs', 'mypage', 'postDetail', 'settings'];

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [activePostId, setActivePostId] = useState<string>('post-1');

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (postId: string) => {
    setActivePostId(postId);
    navigate('postDetail');
  };

  const showNav = PAGES_WITH_NAV.includes(page);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {showNav && (
        <Nav
          currentPage={page}
          onNavigate={navigate}
          isLoggedIn={page !== 'landing'}
        />
      )}
      {page === 'landing' && <Landing onNavigate={navigate} />}
      {page === 'profile' && <Profile onPostClick={handlePostClick} />}
      {page === 'explore' && <Explore onNavigate={navigate} />}
      {page === 'jobs' && <Jobs />}
      {page === 'login' && <Login onNavigate={navigate} />}
      {page === 'mypage' && <MyPage onNavigate={navigate} />}
      {page === 'postDetail' && <PostDetail postId={activePostId} onBack={() => navigate('profile')} />}
      {page === 'settings' && <Settings />}
    </div>
  );
};

export default App;
