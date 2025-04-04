import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LoginModal from './auth/LoginModal';
import { useState } from 'react';

const Layout = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('login'); // 'login' ou 'register'

  const openLoginModal = (tab = 'login') => {
    setInitialTab(tab);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header openLoginModal={openLoginModal} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet context={{ openLoginModal }} />
      </main>
      
      <Footer />
      
      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          initialTab={initialTab}
        />
      )}
    </div>
  );
};

export default Layout;