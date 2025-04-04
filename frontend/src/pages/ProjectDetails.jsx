import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getProject, voteForProject } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { getInitialThemes } from '../services/themeService';

const ProjectDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [allThemes, setAllThemes] = useState([]);
  const { isAuthenticated } = useAuth();
  
  // Vérifier si l'utilisateur vient de voter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('voted') === 'success') {
      setShowVoteSuccess(true);
      // Cacher le message après 5 secondes
      const timer = setTimeout(() => {
        setShowVoteSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // En mode développement, utiliser des données fictives
        // const projectData = await getProject(id);
        
        // Données fictives pour le développement
        const mockProject = {
          id: id,
          title: 'Jardin partagé du quartier des Épinettes',
          shortDescription: 'Création d\'un jardin partagé au cœur du quartier pour cultiver légumes et lien social',
          fullDescription: `
            Le projet consiste à transformer un espace inutilisé de 200m² en un jardin partagé ouvert à tous les habitants du quartier des Épinettes.
            
            ## Objectifs
            - Créer un lieu de convivialité et d'échange entre les habitants
            - Favoriser la production locale de fruits et légumes
            - Sensibiliser à l'environnement et à l'agriculture urbaine
            - Embellir un espace actuellement délaissé
            
            ## Aménagements prévus
            - 10 parcelles individuelles de 8m² chacune
            - Un espace commun avec des arbres fruitiers
            - Un composteur collectif
            - Un cabanon pour ranger les outils
            - Un système de récupération d'eau de pluie
            - Des bancs et une table de pique-nique
            
            ## Fonctionnement envisagé
            Le jardin sera géré par une association créée spécifiquement pour ce projet. Les parcelles seront attribuées pour un an renouvelable aux habitants du quartier qui s'engagent à participer à l'entretien des espaces communs.
            
            Des ateliers pédagogiques seront régulièrement organisés, notamment avec les écoles du quartier.
          `,
          budget: 25000,
          location: {
            type: 'Point',
            coordinates: [48.6304, 2.4507] // Coordonnées fictives d'Évry
          },
          themes: ['1', '2'], // IDs correspondant aux thèmes Environnement et Cadre de vie
          images: [
            'https://via.placeholder.com/800x600?text=Jardin+Partagé+1',
            'https://via.placeholder.com/800x600?text=Jardin+Partagé+2',
            'https://via.placeholder.com/800x600?text=Jardin+Partagé+3'
          ],
          submittedBy: 'Jean Dupont',
          submissionDate: new Date('2025-02-15'),
          status: 'approved',
          votes: 42
        };
        
        setProject(mockProject);
        
        // Récupérer les thèmes pour afficher leurs noms
        const themes = getInitialThemes();
        setAllThemes(themes);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error);
        setError('Impossible de charger les détails du projet.');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Obtenir les noms des thèmes à partir des IDs
  const getThemeNames = (themeIds) => {
    if (!allThemes.length) return [];
    
    return themeIds
      .map(id => {
        const theme = allThemes.find(t => t._id === id);
        return theme ? theme.name : '';
      })
      .filter(name => name !== '');
  };
  
  // Formatage de la date
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Conversion du Markdown en HTML (version simplifiée)
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    // Conversion basique des titres et paragraphes
    const withHeaders = text.replace(/## (.*?)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
    const withParagraphs = withHeaders.replace(/\n\n/g, '</p><p class="mb-4">');
    const withLists = withParagraphs.replace(/- (.*?)$/gm, '<li>$1</li>');
    
    return `<p class="mb-4">${withLists}</p>`;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p>Chargement du projet...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Erreur</h1>
        <p className="text-red-500 mb-8">{error}</p>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Projet non trouvé</h1>
        <p className="mb-8">
          Le projet que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Message de succès après vote */}
      {showVoteSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>
            <strong>Merci !</strong> Votre vote a bien été enregistré pour ce projet.
          </span>
          <button 
            onClick={() => setShowVoteSuccess(false)}
            className="text-green-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {/* Fil d'Ariane */}
      <div className="flex text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to="/preferences" className="hover:text-primary-600">Projets</Link>
        <span className="mx-2">/</span>
        <span>{project.title}</span>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">{project.title}</h1>
      
      {/* Statut du projet */}
      <div className="mb-6">
        <span 
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            project.status === 'approved' 
              ? 'bg-green-100 text-green-800' 
              : project.status === 'under_review'
                ? 'bg-yellow-100 text-yellow-800'
                : project.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
          }`}
        >
          {project.status === 'approved' 
            ? 'Projet approuvé' 
            : project.status === 'under_review'
              ? 'En cours d\'examen'
              : project.status === 'rejected'
                ? 'Projet refusé'
                : 'Brouillon'
          }
        </span>
      </div>
      
      {/* Galerie d'images */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4">
          {project.images.map((image, index) => (
            <div 
              key={index} 
              className={`${index === 0 ? 'col-span-3' : 'col-span-1'} rounded-lg overflow-hidden`}
            >
              <img 
                src={image} 
                alt={`${project.title} - Image ${index + 1}`} 
                className={`w-full ${index === 0 ? 'h-96' : 'h-40'} object-cover`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/800x600?text=Image+non+disponible';
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Description</h2>
          <p className="text-gray-600 mb-4">{project.shortDescription}</p>
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(project.fullDescription) }}
          />
        </div>
        
        <div>
          <div className="card sticky top-6">
            <h3 className="text-xl font-semibold mb-4">Informations</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Budget estimé</p>
              <p className="text-xl font-semibold text-primary-600">{project.budget.toLocaleString()} €</p>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Votes</p>
              <p className="text-xl font-semibold">{project.votes}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Proposé par</p>
              <p>{project.submittedBy}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 text-sm mb-1">Date de soumission</p>
              <p>{formatDate(project.submissionDate)}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-2">Thématiques</p>
              <div className="flex flex-wrap gap-2">
                {getThemeNames(project.themes).map((theme, index) => (
                  <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
            
            {project.status === 'approved' && (
              <div className="mt-4">
                <Link 
                  to="/preferences" 
                  className="w-full btn btn-primary block text-center"
                >
                  Voter pour ce projet
                </Link>
                <p className="text-center text-sm text-gray-500 mt-2">
                  {isAuthenticated
                    ? 'Commence la comparaison pour voter pour ce projet'
                    : 'Connexion requise pour voter'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Localisation */}
      {project.location && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Localisation</h2>
          <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Carte non disponible en mode développement.
              <br />
              Coordonnées: {project.location.coordinates.join(', ')}
            </p>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-6 mt-8">
        <Link to="/preferences" className="text-primary-600 hover:underline">
          ← Retour aux projets
        </Link>
        
        <div className="flex gap-4">
          <button className="btn btn-secondary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Partager
          </button>
          
          <button className="btn btn-secondary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Télécharger
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;