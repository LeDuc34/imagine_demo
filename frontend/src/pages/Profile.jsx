import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyVote } from '../services/projectService';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProjects, setUserProjects] = useState([]);
  const [votedProject, setVotedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    }
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // En mode développement, on utilise des données fictives
        
        // Projets de l'utilisateur
        setUserProjects([
          {
            id: '1',
            title: 'Jardin partagé du quartier des Épinettes',
            shortDescription: 'Création d\'un jardin partagé au cœur du quartier pour cultiver légumes et lien social',
            budget: 25000,
            status: 'approved',
            submissionDate: new Date('2025-02-15'),
            image: 'https://via.placeholder.com/300x200?text=Jardin+Partagé'
          },
          {
            id: '2',
            title: 'Installation de bancs connectés',
            shortDescription: 'Mise en place de bancs publics avec ports USB et WiFi dans les parcs',
            budget: 18000,
            status: 'under_review',
            submissionDate: new Date('2025-03-05'),
            image: 'https://via.placeholder.com/300x200?text=Bancs+Connectés'
          }
        ]);
        
        // Projet voté
        setVotedProject({
          id: '3',
          title: 'Rénovation du terrain de basket du parc',
          shortDescription: 'Remise en état du terrain de basket pour permettre aux jeunes de pratiquer leur sport favori',
          budget: 15000,
          submissionDate: new Date('2025-01-20'),
          image: 'https://via.placeholder.com/300x200?text=Terrain+de+Basket'
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const onSubmit = async (data) => {
    // Simuler la mise à jour du profil
    console.log('Données du profil à mettre à jour:', data);
    
    // En mode développement, on simule un délai
    return new Promise((resolve) => {
      setTimeout(() => {
        alert('Profil mis à jour avec succès');
        resolve();
      }, 1000);
    });
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
  
  // Statut du projet
  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            Approuvé
          </span>
        );
      case 'under_review':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
            En cours d'examen
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            Refusé
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm">
            Brouillon
          </span>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p>Chargement du profil...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mon profil</h1>
      
      {/* Onglets */}
      <div className="mb-8 border-b">
        <nav className="flex space-x-8">
          <button
            className={`pb-4 px-1 ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Informations personnelles
          </button>
          <button
            className={`pb-4 px-1 ${
              activeTab === 'projects'
                ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Mes projets
          </button>
          <button
            className={`pb-4 px-1 ${
              activeTab === 'votes'
                ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('votes')}
          >
            Mon vote
          </button>
        </nav>
      </div>
      
      {/* Contenu des onglets */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">Mes informations</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="input"
                  {...register('firstName', { required: 'Le prénom est obligatoire' })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="input"
                  {...register('lastName', { required: 'Le nom est obligatoire' })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="input"
                disabled
                {...register('email')}
              />
              <p className="text-gray-500 text-sm mt-1">
                L'email ne peut pas être modifié
              </p>
            </div>
            
            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mise à jour en cours...
                </span>
              ) : (
                'Mettre à jour mon profil'
              )}
            </button>
          </form>
        </div>
      )}
      
      {activeTab === 'projects' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Mes projets</h2>
            <Link to="/submit" className="btn btn-primary">
              Proposer un nouveau projet
            </Link>
          </div>
          
          {userProjects.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore proposé de projet.
              </p>
              <Link to="/submit" className="btn btn-primary">
                Proposer un projet
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userProjects.map(project => (
                <div key={project.id} className="card flex flex-col md:flex-row">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                      }}
                    />
                  </div>
                  <div className="md:w-3/4 md:pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      {getStatusLabel(project.status)}
                    </div>
                    <p className="text-gray-600 mb-4">{project.shortDescription}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">
                          Soumis le {formatDate(project.submissionDate)}
                        </span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="text-primary-600 font-medium">
                          {project.budget.toLocaleString()} €
                        </span>
                      </div>
                      <Link 
                        to={`/projects/${project.id}`} 
                        className="text-primary-600 hover:underline"
                      >
                        Voir le détail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'votes' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Mon vote</h2>
          
          {!votedProject ? (
            <div className="card text-center py-8">
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore voté pour un projet.
              </p>
              <Link to="/preferences" className="btn btn-primary">
                Découvrir et voter
              </Link>
            </div>
          ) : (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Vous avez voté pour :</h3>
              
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <img 
                    src={votedProject.image} 
                    alt={votedProject.title} 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                    }}
                  />
                </div>
                <div className="md:w-2/3 md:pl-6">
                  <h3 className="text-xl font-semibold mb-2">{votedProject.title}</h3>
                  <p className="text-gray-600 mb-4">{votedProject.shortDescription}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-medium">
                      {votedProject.budget.toLocaleString()} €
                    </span>
                    <Link 
                      to={`/projects/${votedProject.id}`} 
                      className="text-primary-600 hover:underline"
                    >
                      Voir le détail
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t pt-6">
                <p className="text-gray-500 text-sm mb-4">
                  Vous pouvez modifier votre vote jusqu'à la clôture du scrutin (31 août 2025).
                </p>
                <Link to="/preferences" className="btn btn-primary">
                  Modifier mon vote
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;