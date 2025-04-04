import { createContext, useState, useContext, useEffect } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [mode, setMode] = useState('easy'); // 'easy' ou 'expert'
  const [sessionId, setSessionId] = useState(null);

  // Charger les préférences depuis localStorage au démarrage
  useEffect(() => {
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      const { themes, mode, sessionId } = JSON.parse(storedPreferences);
      setSelectedThemes(themes || []);
      setMode(mode || 'easy');
      setSessionId(sessionId);
    }
  }, []);

  // Sauvegarder les préférences dans localStorage lors des changements
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify({
      themes: selectedThemes,
      mode,
      sessionId
    }));
  }, [selectedThemes, mode, sessionId]);

  const updateSelectedThemes = (themes) => {
    // Limiter à 5 thèmes maximum
    if (themes.length <= 5) {
      setSelectedThemes(themes);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'easy' ? 'expert' : 'easy');
  };

  const resetPreferences = () => {
    setSelectedThemes([]);
    setMode('easy');
    setSessionId(null);
    localStorage.removeItem('userPreferences');
  };

  return (
    <PreferencesContext.Provider 
      value={{ 
        selectedThemes, 
        updateSelectedThemes, 
        mode, 
        toggleMode, 
        resetPreferences,
        sessionId,
        setSessionId
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export default PreferencesContext;