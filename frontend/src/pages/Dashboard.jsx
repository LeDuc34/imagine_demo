import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../services/projectService';
import { getInitialThemes } from '../services/themeService';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
  const [projectVotes, setProjectVotes] = useState([]);
  const [themeSelections, setThemeSelections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Couleurs pour les graphiques
  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#3F51B5', 
                '#607D8B', '#E91E63', '#00BCD4', '#FF5722', '#795548', '#FFEB3B'];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // En mode développement, utilisons des données fictives
        // Dans un environnement de production, nous utiliserions l'API
        
        // Données fictives pour les votes de projets
        const mockProjects = [
          { id: '1', title: 'Jardin partagé du quartier des Épinettes', votes: 87, budget: 25000 },
          { id: '2', title: 'Rénovation du terrain de basket du parc', votes: 64, budget: 18000 },
          { id: '3', title: 'Installation de stations de réparation de vélos', votes: 53, budget: 12000 },
          { id: '4', title: 'Création d\'une fresque murale collaborative', votes: 41, budget: 8000 },
          { id: '5', title: 'Installation de capteurs de qualité de l\'air', votes: 38, budget: 15000 },
          { id: '6', title: 'Parcours sportif dans le parc municipal', votes: 31, budget: 22000 },
          { id: '7', title: 'Ateliers intergénérationnels de quartier', votes: 27, budget: 5000 },
          { id: '8', title: 'Réaménagement des berges de la rivière', votes: 23, budget: 30000 }
        ];
        
        // Trier les projets par nombre de votes (décroissant)
        const sortedProjects = [...mockProjects].sort((a, b) => b.votes - a.votes);
        setProjectVotes(sortedProjects);
        
        // Données fictives pour les sélections de thèmes
        const themes = getInitialThemes();
        const mockThemeSelections = [
          { id: '1', name: 'Environnement', count: 248, color: '#4CAF50' },
          { id: '2', name: 'Cadre de vie', count: 213, color: '#2196F3' },
          { id: '3', name: 'Éducation et jeunesse', count: 187, color: '#FF9800' },
          { id: '6', name: 'Mobilité', count: 162, color: '#3F51B5' },
          { id: '4', name: 'Culture et patrimoine', count: 143, color: '#9C27B0' },
          { id: '5', name: 'Sport', count: 138, color: '#F44336' },
          { id: '8', name: 'Solidarité', count: 127, color: '#E91E63' },
          { id: '10', name: 'Santé', count: 118, color: '#FF5722' },
          { id: '7', name: 'Prévention et sécurité', count: 92, color: '#607D8B' },
          { id: '9', name: 'Propreté', count: 86, color: '#00BCD4' },
          { id: '11', name: 'Attractivité et emploi', count: 74, color: '#795548' },
          { id: '12', name: 'Logement', count: 59, color: '#FFEB3B' }
        ];
        
        // Trier les thèmes par nombre de sélections (décroissant)
        const sortedThemes = [...mockThemeSelections].sort((a, b) => b.count - a.count);
        setThemeSelections(sortedThemes);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Formater les noms de projets trop longs pour l'affichage dans le graphique
  const formatProjectName = (name) => {
    return name.length > 25 ? name.substring(0, 25) + '...' : name;
  };
  
  // Formatter les nombres pour l'affichage
  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-FR').format(number);
  };
  
  // Formatter les montants budgétaires
  const formatBudget = (budget) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(budget);
  };
  
  // Custom tooltip pour le graphique des votes
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const project = projectVotes.find(p => formatProjectName(p.title) === label);
      
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-semibold">{project.title}</p>
          <p>Votes: <span className="font-semibold">{formatNumber(payload[0].value)}</span></p>
          <p>Budget: <span className="font-semibold">{formatBudget(project.budget)}</span></p>
        </div>
      );
    }
    
    return null;
  };
  
  // Custom tooltip pour le graphique des thèmes
  const ThemeTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-md">
          <p className="font-semibold">{payload[0].name}</p>
          <p>Sélections: <span className="font-semibold">{formatNumber(payload[0].value)}</span></p>
        </div>
      );
    }
    
    return null;
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex space-x-4">
          <button className="btn btn-secondary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Exporter
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Actualiser
          </button>
        </div>
      </div>
      
      {/* Résumé des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Nombre total de projets</p>
              <p className="text-2xl font-bold">{projectVotes.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Nombre total de votes</p>
              <p className="text-2xl font-bold">{formatNumber(projectVotes.reduce((acc, project) => acc + project.votes, 0))}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Budget total des projets</p>
              <p className="text-2xl font-bold">{formatBudget(projectVotes.reduce((acc, project) => acc + project.budget, 0))}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Graphique des votes par projet */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Nombre de votes par projet</h2>
        
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={projectVotes.map(project => ({
              name: formatProjectName(project.title),
              votes: project.votes
            }))}
            margin={{
              top: 5, right: 30, left: 20, bottom: 120
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="votes" name="Votes" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
        
        <div className="mt-6">
          <Link to="/projects" className="text-primary-600 hover:underline">
            Voir tous les projets →
          </Link>
        </div>
      </div>
      
      {/* Graphique des thèmes les plus sélectionnés */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Thèmes les plus choisis par les utilisateurs</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={themeSelections}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {themeSelections.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ThemeTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Classement des thèmes</h3>
            <div className="space-y-4">
              {themeSelections.slice(0, 6).map((theme, index) => (
                <div key={theme.id} className="flex items-center">
                  <div className="mr-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{theme.name}</span>
                      <span className="text-gray-500">{formatNumber(theme.count)} sélections</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(theme.count / themeSelections[0].count) * 100}%`,
                          backgroundColor: theme.color || COLORS[index % COLORS.length]
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Link to="/preferences" className="text-primary-600 hover:underline">
                Voir tous les thèmes →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Informations complémentaires */}
      <div className="mb-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Ce tableau de bord présente les données en temps réel du budget participatif.
                Les votes sont ouverts jusqu'au 31 août 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;