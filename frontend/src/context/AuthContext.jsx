// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { users, generateId, getStorageItem, setStorageItem } from '../services/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler la vérification du token au démarrage
  useEffect(() => {
    const storedUser = getStorageItem('demo_user');
    
    if (storedUser) {
      setUser(storedUser);
      // Configurer l'en-tête d'authentification pour simuler les appels API authentifiés
      api.defaults.headers.common['Authorization'] = `Bearer demo-token`;
    }
    
    setIsLoading(false);
  }, []);

  // Simuler le login
  const login = async (email, password) => {
    try {
      await api.post('/users/login', { email, password }); // Simulation d'appel API
      
      // Vérifier dans les données mockées
      const foundUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        console.error('Identifiants incorrects');
        return false;
      }
      
      // Créer un objet utilisateur sans le mot de passe
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role
      };
      
      // Stocker localement
      setStorageItem('demo_user', userData);
      setUser(userData);
      
      // Configurer l'en-tête d'authentification
      api.defaults.headers.common['Authorization'] = `Bearer demo-token`;
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  // Simuler l'inscription
  const register = async (userData) => {
    try {
      await api.post('/users/register', userData); // Simulation d'appel API
      
      // Vérifier si l'email existe déjà
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
      
      if (existingUser) {
        console.error('Cet email est déjà utilisé');
        return false;
      }
      
      // Créer un nouvel utilisateur
      const newUser = {
        id: generateId(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'user'
      };
      
      // Créer un objet utilisateur sans le mot de passe pour le stockage
      const userDataWithoutPassword = {
        ...newUser
      };
      
      // Stocker localement
      setStorageItem('demo_user', userDataWithoutPassword);
      setUser(userDataWithoutPassword);
      
      // Configurer l'en-tête d'authentification
      api.defaults.headers.common['Authorization'] = `Bearer demo-token`;
      
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    }
  };

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('demo_user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;