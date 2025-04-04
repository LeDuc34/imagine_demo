// src/services/themeService.js
import api from './api';
import { themes } from './mockData';

// Récupère tous les thèmes
export const getThemes = async () => {
  await api.get('/themes'); // Simulation d'appel API
  return themes;
};

// Récupère un thème par son ID
export const getTheme = async (id) => {
  await api.get(`/themes/${id}`); // Simulation d'appel API
  
  const theme = themes.find(t => t._id === id);
  
  if (!theme) {
    throw new Error('Thème non trouvé');
  }
  
  return theme;
};

// Fonction déjà compatible avec notre approche mockée
export const getInitialThemes = () => {
  return themes;
};