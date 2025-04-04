import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Header = ({ openLoginModal }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/logo-evry.png" 
              alt="Logo Évry" 
              className="h-10"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/40x40?text=Évry';
              }}
            />
            <span className="font-bold text-lg text-primary-700">Budget Participatif Évry</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary-600">Accueil</Link>
            <Link to="/preferences" className="text-gray-700 hover:text-primary-600">Découvrir et voter</Link>
            <Link to="/submit" className="text-gray-700 hover:text-primary-600">Soumettre un projet</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">Tableau de bord</Link>
            )}
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
                  onClick={toggleMenu}
                >
                  <span>{user?.firstName || 'Mon compte'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mon profil</Link>
                    <Link to="/profile/projects" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mes projets</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Tableau de bord</Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => openLoginModal('login')} 
                className="btn btn-primary"
              >
                Connexion
              </button>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <Link to="/" className="block py-2 text-gray-700">Accueil</Link>
            <Link to="/preferences" className="block py-2 text-gray-700">Découvrir et voter</Link>
            <Link to="/submit" className="block py-2 text-gray-700">Soumettre un projet</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="block py-2 text-gray-700">Tableau de bord</Link>
            )}
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block py-2 text-gray-700">Mon profil</Link>
                <Link to="/profile/projects" className="block py-2 text-gray-700">Mes projets</Link>
                <button 
                  onClick={logout}
                  className="block w-full text-left py-2 text-gray-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  openLoginModal('login');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-700"
              >
                Connexion
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;