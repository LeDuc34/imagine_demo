import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { login, register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const { 
    register: registerLoginForm, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors }
  } = useForm();
  
  const { 
    register: registerSignupForm, 
    handleSubmit: handleSignupSubmit, 
    formState: { errors: signupErrors },
    watch
  } = useForm();
  
  const password = watch('password', '');
  
  useEffect(() => {
    // Si l'utilisateur est authentifié, fermer la modal
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);
  
  const onLogin = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      onClose();
    }
  };
  
  const onSignup = async (data) => {
    const userData = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName
    };
    
    const success = await registerUser(userData);
    if (success) {
      onClose();
    }
  };
  
  // Empêcher le clic de se propager à l'arrière-plan
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
        onClick={stopPropagation}
      >
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'login' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('login')}
          >
            Connexion
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'register' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('register')}
          >
            Inscription
          </button>
          
          {/* Close button */}
          <button 
            className="ml-auto text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit(onLogin)}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
              <input
                id="email"
                type="email"
                className="input"
                {...registerLoginForm('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format d'email invalide"
                  }
                })}
              />
              {loginErrors.email && (
                <p className="text-red-500 text-sm mt-1">{loginErrors.email.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">Mot de passe</label>
              <input
                id="password"
                type="password"
                className="input"
                {...registerLoginForm('password', { 
                  required: 'Le mot de passe est requis' 
                })}
              />
              {loginErrors.password && (
                <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  {...registerLoginForm('remember')}
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Se souvenir de moi
                </label>
              </div>
              
              <a href="#" className="text-sm text-primary-600 hover:underline">
                Mot de passe oublié?
              </a>
            </div>
            
            <button type="submit" className="w-full btn btn-primary">
              Se connecter
            </button>
          </form>
        )}
        
        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleSignupSubmit(onSignup)}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-2">Prénom</label>
                <input
                  id="firstName"
                  type="text"
                  className="input"
                  {...registerSignupForm('firstName', { 
                    required: 'Le prénom est requis' 
                  })}
                />
                {signupErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-2">Nom</label>
                <input
                  id="lastName"
                  type="text"
                  className="input"
                  {...registerSignupForm('lastName', { 
                    required: 'Le nom est requis' 
                  })}
                />
                {signupErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{signupErrors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="signupEmail" className="block text-gray-700 mb-2">Email</label>
              <input
                id="signupEmail"
                type="email"
                className="input"
                {...registerSignupForm('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format d'email invalide"
                  }
                })}
              />
              {signupErrors.email && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.email.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="signupPassword" className="block text-gray-700 mb-2">Mot de passe</label>
              <input
                id="signupPassword"
                type="password"
                className="input"
                {...registerSignupForm('password', { 
                  required: 'Le mot de passe est requis',
                  minLength: {
                    value: 8,
                    message: 'Le mot de passe doit contenir au moins 8 caractères'
                  }
                })}
              />
              {signupErrors.password && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.password.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                type="password"
                className="input"
                {...registerSignupForm('confirmPassword', { 
                  required: 'Veuillez confirmer votre mot de passe',
                  validate: value => value === password || 'Les mots de passe ne correspondent pas'
                })}
              />
              {signupErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                  {...registerSignupForm('terms', { 
                    required: 'Vous devez accepter les conditions d\'utilisation' 
                  })}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  J'accepte les <a href="#" className="text-primary-600 hover:underline">conditions d'utilisation</a>
                </label>
              </div>
              {signupErrors.terms && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.terms.message}</p>
              )}
            </div>
            
            <button type="submit" className="w-full btn btn-primary">
              S'inscrire
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;