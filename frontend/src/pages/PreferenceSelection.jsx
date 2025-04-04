import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import { getInitialThemes } from '../services/themeService';

const PreferenceSelection = () => {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedThemes, updateSelectedThemes, mode, toggleMode } = usePreferences();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        // En environnement de développement, utilisons des données fictives
        const themesData = getInitialThemes();
        setThemes(themesData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des thématiques:', error);
        setIsLoading(false);
      }
    };
    
    fetchThemes();
  }, []);
  
  const handleThemeClick = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      // Si déjà sélectionné, on le retire
      updateSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else {
      // Si pas encore sélectionné et moins de 5 thèmes sélectionnés, on l'ajoute
      if (selectedThemes.length < 5) {
        updateSelectedThemes([...selectedThemes, themeId]);
      }
    }
  };
  
  const handleContinue = () => {
    if (selectedThemes.length > 0) {
      navigate('/comparison');
    }
  };
  
  return (
    <div>
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Étape 1/4</span>
          <span className="text-gray-500">Sélection des préférences</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="w-1/4 h-full bg-primary-500 rounded-full"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Sélectionnez vos centres d'intérêt</h1>
      
      <p className="text-gray-600 mb-8">
        Pour vous proposer des projets qui correspondent à vos intérêts, veuillez sélectionner entre 1 et 5 thématiques.
      </p>
      
      {/* Switch mode easy/expert */}
      <div className="flex items-center mb-8">
  <span className="mr-4 text-gray-700">Mode:</span>
  <label htmlFor="toggle" className="relative inline-block w-12 mr-2 align-middle select-none cursor-pointer">
    <input
      type="checkbox"
      id="toggle"
      className="sr-only"
      checked={mode === 'expert'}
      onChange={toggleMode}
    />
    <div className="w-12 h-6 bg-gray-300 rounded-full"></div>
    <div
      className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform ${
        mode === 'expert' ? 'transform translate-x-6 bg-primary-600' : 'bg-white'
      }`}
    ></div>
  </label>
  <span className="ml-2 text-gray-700">{mode === 'expert' ? 'Expert' : 'Facile'}</span>
  <div className="ml-2 relative group">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 cursor-help" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-64 bg-black text-white text-xs py-2 px-3 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none">
      <p className="mb-1"><strong>Mode facile:</strong> 5 comparaisons maximum, présélection possible après 3 comparaisons.</p>
      <p><strong>Mode expert:</strong> 15 comparaisons maximum, présélection après 10 comparaisons, accès à des filtres supplémentaires.</p>
    </div>
  </div>
</div>
      
      {/* Thématiques */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Chargement des thématiques...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {themes.map(theme => (
            <div
              key={theme._id}
              onClick={() => handleThemeClick(theme._id)}
              className={`card cursor-pointer transition-all transform hover:scale-105 ${
                selectedThemes.includes(theme._id) ? `border-2 border-${theme.color} shadow-lg` : ''
              }`}
              style={{ borderColor: selectedThemes.includes(theme._id) ? theme.color : '' }}
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{theme.icon}</span>
                <h3 className="font-semibold">{theme.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{theme.description}</p>
              
              {/* Badge pour l'ordre de sélection */}
              {selectedThemes.includes(theme._id) && (
                <div 
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: theme.color }}
                >
                  {selectedThemes.indexOf(theme._id) + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Message d'aide */}
      <div className="mb-8 text-center text-gray-600">
        {selectedThemes.length === 0 ? (
          <p>Veuillez sélectionner au moins une thématique pour continuer.</p>
        ) : selectedThemes.length === 5 ? (
          <p>Vous avez atteint le nombre maximum de thématiques (5).</p>
        ) : (
          <p>Vous avez sélectionné {selectedThemes.length} thématique(s). Vous pouvez en choisir {5 - selectedThemes.length} de plus.</p>
        )}
      </div>
      
      {/* Bouton de validation */}
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          disabled={selectedThemes.length === 0}
          className={`btn ${
            selectedThemes.length > 0 ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } px-8 py-3 text-lg`}
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default PreferenceSelection;