import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import { getRecommendedProjects, voteForProject } from '../services/projectService';
import { getInitialThemes } from '../services/themeService';

const ProjectComparison = () => {
  const [currentProject, setCurrentProject] = useState(null);
  const [newProposal, setNewProposal] = useState(null);
  const [viewedProjects, setViewedProjects] = useState([]);
  const [likedProjects, setLikedProjects] = useState([]);
  const [dislikedProjects, setDislikedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingComparisons, setRemainingComparisons] = useState(0);
  const [showFinalChoice, setShowFinalChoice] = useState(false);
  const [finalChoice, setFinalChoice] = useState(null);
  const [allThemes, setAllThemes] = useState([]);
  
  const { selectedThemes, mode, sessionId, setSessionId } = usePreferences();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { openLoginModal } = useOutletContext();
  
  // Nombre max de comparaisons selon le mode
  const maxComparisons = mode === 'easy' ? 5 : 15;
  // Nombre de comparaisons minimum avant de pouvoir faire un choix final
  const minComparisonBeforeChoice = mode === 'easy' ? 3 : 10;
  
  useEffect(() => {
    // Si aucune thématique n'est sélectionnée, rediriger vers la page de sélection
    if (selectedThemes.length === 0) {
      navigate('/preferences');
      return;
    }
    
    // Charger les thèmes pour l'affichage
    const loadThemes = async () => {
      const themes = getInitialThemes();
      setAllThemes(themes);
    };
    
    loadThemes();
    
    // Initialiser le nombre de comparaisons restantes
    setRemainingComparisons(maxComparisons);
    
    // En mode développement, utiliser des données fictives
    const mockProjects = getMockProjects();
    
    // Initialiser le premier projet choisi et la première proposition
    if (mockProjects.length >= 2) {
      setCurrentProject(mockProjects[0]);
      setNewProposal(mockProjects[1]);
      setViewedProjects([mockProjects[0].id, mockProjects[1].id]);
    }
    
    setIsLoading(false);
  }, [selectedThemes, navigate, maxComparisons]);
  
  // Données fictives pour le développement
  const getMockProjects = () => {
    return [
      {
        id: '1',
        title: 'Jardin partagé du quartier des Épinettes',
        shortDescription: 'Création d\'un jardin partagé au cœur du quartier pour cultiver légumes et lien social',
        budget: 25000,
        themes: ['1', '2'], // IDs correspondant aux thèmes
        image: 'https://via.placeholder.com/400x300?text=Jardin+Partagé'
      },
      {
        id: '2',
        title: 'Rénovation du terrain de basket du parc',
        shortDescription: 'Remise en état du terrain de basket pour permettre aux jeunes de pratiquer leur sport favori',
        budget: 18000,
        themes: ['5', '3'], // IDs correspondant aux thèmes
        image: 'https://via.placeholder.com/400x300?text=Terrain+de+Basket'
      },
      {
        id: '3',
        title: 'Installation de stations de réparation de vélos',
        shortDescription: 'Mise en place de stations publiques pour permettre aux cyclistes de réparer leurs vélos',
        budget: 12000,
        themes: ['6', '1'], // IDs correspondant aux thèmes
        image: 'https://via.placeholder.com/400x300?text=Stations+Vélos'
      },
      {
        id: '4',
        title: 'Création d\'une fresque murale collaborative',
        shortDescription: 'Réalisation d\'une fresque artistique par les habitants pour embellir un mur disgracieux',
        budget: 8000,
        themes: ['4', '8'], // IDs correspondant aux thèmes
        image: 'https://via.placeholder.com/400x300?text=Fresque+Murale'
      },
      {
        id: '5',
        title: 'Installation de capteurs de qualité de l\'air',
        shortDescription: 'Déploiement de capteurs connectés pour mesurer et informer sur la qualité de l\'air',
        budget: 15000,
        themes: ['1', '10'], // IDs correspondant aux thèmes
        image: 'https://via.placeholder.com/400x300?text=Capteurs+Air'
      }
    ];
  };
  
  // Récupérer les mots-clés des thèmes correspondant aux IDs
  const getThemeNames = (themeIds) => {
    return themeIds
      .map(id => {
        const theme = allThemes.find(t => t._id === id);
        return theme ? theme.name : '';
      })
      .filter(name => name !== '');
  };
  
  // Obtenir un nouveau projet proposé
  const getNextProposal = () => {
    // En environnement de production, nous appellerions l'API
    // Dans l'environnement de développement, simulons avec les données fictives
    const mockProjects = getMockProjects();
    const availableProjects = mockProjects.filter(
      project => !viewedProjects.includes(project.id) && 
                 project.id !== currentProject?.id
    );
    
    if (availableProjects.length > 0) {
      const nextProject = availableProjects[0];
      setNewProposal(nextProject);
      setViewedProjects(prev => [...prev, nextProject.id]);
    } else {
      // Plus de projets disponibles
      setNewProposal(null);
    }
  };
  
  // Accepter le nouveau projet proposé
  const acceptNewProposal = () => {
    // Ajouter l'ancien projet aux projets aimés
    setLikedProjects(prev => [...prev, currentProject.id]);
    
    // Remplacer le projet actuel par le nouveau projet proposé
    setCurrentProject(newProposal);
    
    // Stocker ce projet comme choix potentiel final
    setFinalChoice(newProposal);
    
    // Décrémenter le nombre de comparaisons restantes
    const newRemainingComparisons = remainingComparisons - 1;
    setRemainingComparisons(newRemainingComparisons);
    
    // Vérifier s'il reste des comparaisons
    if (newRemainingComparisons <= 0) {
      // Si plus de comparaisons, montrer le choix final
      setShowFinalChoice(true);
    } else {
      // Sinon, obtenir une nouvelle proposition
      getNextProposal();
    }
  };
  
  // Refuser le nouveau projet proposé
  const rejectNewProposal = () => {
    // Ajouter le projet refusé aux projets non aimés
    setDislikedProjects(prev => [...prev, newProposal.id]);
    
    // Décrémenter le nombre de comparaisons restantes
    const newRemainingComparisons = remainingComparisons - 1;
    setRemainingComparisons(newRemainingComparisons);
    
    // Vérifier s'il reste des comparaisons
    if (newRemainingComparisons <= 0) {
      // Si plus de comparaisons, montrer le choix final avec le projet actuel
      setShowFinalChoice(true);
    } else {
      // Sinon, obtenir une nouvelle proposition
      getNextProposal();
    }
  };
  
  // Super like (coup de cœur)
  const superLikeProject = (project) => {
    if (project.id === currentProject.id) {
      setLikedProjects(prev => [...prev, project.id]);
    } else {
      // Si c'est le nouveau projet proposé, remplacer le projet actuel
      setCurrentProject(project);
    }
    setFinalChoice(project);
    setShowFinalChoice(true);
  };
  
  // Gérer le vote final
  const handleFinalVote = async () => {
    if (!isAuthenticated) {
      // Si l'utilisateur n'est pas connecté, ouvrir la modal de connexion
      openLoginModal('login');
      return;
    }
    
    try {
      // En environnement de production, nous enverrions le vote à l'API
      // await voteForProject(finalChoice.id);
      
      // Rediriger vers la page du projet
      navigate(`/projects/${finalChoice.id}?voted=success`);
    } catch (error) {
      console.error('Erreur lors du vote:', error);
    }
  };
  
  // Si toujours en chargement
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p>Chargement des projets...</p>
      </div>
    );
  }
  
  // Si aucun projet disponible
  if (!currentProject || !newProposal) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Aucun projet disponible</h1>
        <p className="mb-8">
          Nous n'avons pas trouvé de projets correspondant à vos critères. Veuillez essayer avec d'autres thématiques.
        </p>
        <button 
          onClick={() => navigate('/preferences')} 
          className="btn btn-primary"
        >
          Modifier mes préférences
        </button>
      </div>
    );
  }
  
  // Si on montre le choix final
  if (showFinalChoice && finalChoice) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Votre choix final</h1>
        
        <div className="card max-w-lg mx-auto mb-8">
          <img 
            src={finalChoice.image} 
            alt={finalChoice.title} 
            className="w-full h-48 object-cover mb-4 rounded-t-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
            }}
          />
          <h3 className="text-xl font-semibold mb-2">{finalChoice.title}</h3>
          <p className="text-gray-600 mb-4">{finalChoice.shortDescription}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary-700 font-semibold">{finalChoice.budget.toLocaleString()} €</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {getThemeNames(finalChoice.themes).map((theme, index) => (
              <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm">
                {theme}
              </span>
            ))}
          </div>
        </div>
        
        <p className="mb-8">
          Vous avez choisi ce projet comme votre favori. Voulez-vous confirmer votre vote ?
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleFinalVote} 
            className="btn btn-primary"
          >
            Confirmer mon vote
          </button>
          {remainingComparisons > 0 && (
            <button 
              onClick={() => {
                setShowFinalChoice(false);
                if (remainingComparisons > 0) {
                  getNextProposal();
                }
              }} 
              className="btn btn-secondary"
            >
              Continuer à comparer
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // Vue normale de comparaison
  return (
    <div>
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Étape 2/4</span>
          <span className="text-gray-500">Comparaison des projets</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div className="w-2/4 h-full bg-primary-500 rounded-full"></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-6 text-center">Comparez et choisissez</h1>
      
      <p className="text-gray-600 mb-8 text-center">
        Pour chaque nouveau projet proposé, décidez si vous souhaitez le sélectionner ou conserver votre choix actuel.
        {mode === 'easy' 
          ? ` Vous pouvez faire ${maxComparisons} comparaisons au maximum. Après ${minComparisonBeforeChoice} comparaisons, vous pourrez finaliser votre choix si vous le souhaitez.` 
          : ` Vous pouvez faire ${maxComparisons} comparaisons au maximum. Après ${minComparisonBeforeChoice} comparaisons, vous pourrez finaliser votre choix si vous le souhaitez.`
        }
      </p>
      
      {/* Compteur de comparaisons */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full px-4 py-2">
          <span className="font-medium">Comparaisons restantes: </span>
          <span className="text-primary-600 font-semibold">{remainingComparisons}/{maxComparisons}</span>
        </div>
      </div>
      
      {/* Projets à comparer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Nouveau projet proposé (à gauche) */}
        <div className="card relative">
          <div className="bg-primary-50 text-primary-700 text-sm font-medium py-1 px-3 rounded-t-lg inline-block">
            Nouveau projet proposé
          </div>
          <img 
            src={newProposal.image} 
            alt={newProposal.title} 
            className="w-full h-48 object-cover mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
            }}
          />
          <h3 className="text-xl font-semibold mb-2">{newProposal.title}</h3>
          <p className="text-gray-600 mb-4">{newProposal.shortDescription}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary-700 font-semibold">{newProposal.budget.toLocaleString()} €</span>
            <button className="text-primary-600 hover:underline">
              En savoir plus
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {getThemeNames(newProposal.themes).map((theme, index) => (
              <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm">
                {theme}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button 
              onClick={acceptNewProposal} 
              className="btn btn-primary w-full"
            >
              Choisir ce projet
            </button>
            <button 
              onClick={rejectNewProposal} 
              className="btn btn-secondary w-full"
            >
              Voir une autre proposition
            </button>
          </div>
          
          {/* Super like */}
          <button 
            onClick={() => superLikeProject(newProposal)} 
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-primary-50"
            title="Coup de cœur"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
        
        {/* Projet actuellement choisi (à droite) */}
        <div className="card relative border-2 border-primary-400">
          <div className="bg-primary-400 text-white text-sm font-medium py-1 px-3 rounded-t-lg inline-block">
            Votre choix actuel
          </div>
          <img 
            src={currentProject.image} 
            alt={currentProject.title} 
            className="w-full h-48 object-cover mb-4"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
            }}
          />
          <h3 className="text-xl font-semibold mb-2">{currentProject.title}</h3>
          <p className="text-gray-600 mb-4">{currentProject.shortDescription}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary-700 font-semibold">{currentProject.budget.toLocaleString()} €</span>
            <button className="text-primary-600 hover:underline">
              En savoir plus
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {getThemeNames(currentProject.themes).map((theme, index) => (
              <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm">
                {theme}
              </span>
            ))}
          </div>
          
          {/* Conserver ce projet est implicite quand on rejette la nouvelle proposition */}
          <div className="flex justify-center my-2">
            <span className="text-gray-500 italic">Conservé si vous rejetez la nouvelle proposition</span>
          </div>
          
          {/* Super like */}
          <button 
            onClick={() => superLikeProject(currentProject)} 
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-primary-50"
            title="Coup de cœur"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Bouton pour finaliser le choix si assez de comparaisons ont été faites */}
      {maxComparisons - remainingComparisons >= minComparisonBeforeChoice && remainingComparisons > 0 && (
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => {
              setFinalChoice(currentProject);
              setShowFinalChoice(true);
            }} 
            className="btn btn-primary"
          >
            Finaliser mon choix
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectComparison;