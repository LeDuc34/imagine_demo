import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // En mode développement, utilisons des données fictives
        // Dans un environnement de production, nous utiliserions l'API
        // const response = await getProjects(1, 3);
        // setFeaturedProjects(response.data);
        
        // Données fictives pour le développement
        setFeaturedProjects([
          {
            _id: '1',
            title: 'Jardin partagé du quartier des Épinettes',
            shortDescription: 'Création d\'un jardin partagé au cœur du quartier pour cultiver légumes et lien social',
            budget: 25000,
            themes: ['Environnement', 'Cadre de vie'],
            images: ['https://via.placeholder.com/400x300?text=Jardin+Partagé']
          },
          {
            _id: '2',
            title: 'Rénovation du terrain de basket du parc',
            shortDescription: 'Remise en état du terrain de basket pour permettre aux jeunes de pratiquer leur sport favori',
            budget: 18000,
            themes: ['Sport', 'Jeunesse'],
            images: ['https://via.placeholder.com/400x300?text=Terrain+de+Basket']
          },
          {
            _id: '3',
            title: 'Installation de stations de réparation de vélos',
            shortDescription: 'Mise en place de stations publiques pour permettre aux cyclistes de réparer leurs vélos',
            budget: 12000,
            themes: ['Mobilité', 'Environnement'],
            images: ['https://via.placeholder.com/400x300?text=Stations+Vélos']
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-700 text-white py-20 rounded-lg mb-12">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Budget Participatif d'Évry</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Proposez vos idées et décidez ensemble des projets qui façonneront l'avenir de notre ville.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/preferences" className="btn btn-primary bg-white text-primary-700 hover:bg-gray-100 text-lg px-6 py-3">
              Découvrir et voter
            </Link>
            <Link to="/submit" className="btn bg-primary-600 text-white border border-white hover:bg-primary-800 text-lg px-6 py-3">
              Soumettre un projet
            </Link>
          </div>
        </div>
      </section>
      
      {/* Comment ça marche */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Proposez</h3>
            <p className="text-gray-600">
              Soumettez vos idées pour améliorer votre quartier ou votre ville.
              Budget maximum par projet : 50 000€.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Votez</h3>
            <p className="text-gray-600">
              Découvrez les projets proposés par vos concitoyens et votez pour ceux que vous préférez.
            </p>
          </div>
          
          <div className="card text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-700 text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Réalisez</h3>
            <p className="text-gray-600">
              Les projets sélectionnés sont mis en œuvre par la ville avec votre participation.
            </p>
          </div>
        </div>
      </section>
      
      {/* Projets en vedette */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Projets en vedette</h2>
          <Link to="/preferences" className="text-primary-600 hover:underline">
            Voir tous les projets →
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center">
            <p>Chargement des projets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project._id} className="card overflow-hidden">
                <img 
                  src={project.images[0]} 
                  alt={project.title} 
                  className="w-full h-48 object-cover mb-4"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                  }}
                />
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">{project.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-primary-700 font-semibold">{project.budget.toLocaleString()} €</span>
                  <Link to={`/projects/${project._id}`} className="text-primary-600 hover:underline">
                    En savoir plus
                  </Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.themes.map((theme, index) => (
                    <span key={index} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-sm">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      
      {/* Calendrier */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Calendrier 2025</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card border-l-4 border-primary-500">
            <h3 className="font-semibold text-lg mb-2">Janvier - Mars</h3>
            <p className="text-gray-600">Appel à projets et dépôt des idées</p>
          </div>
          
          <div className="card border-l-4 border-green-500">
            <h3 className="font-semibold text-lg mb-2">Avril - Mai</h3>
            <p className="text-gray-600">Étude de faisabilité des projets</p>
          </div>
          
          <div className="card border-l-4 border-yellow-500">
            <h3 className="font-semibold text-lg mb-2">Juin - Août</h3>
            <p className="text-gray-600">Phase de vote des citoyens</p>
          </div>
          
          <div className="card border-l-4 border-red-500">
            <h3 className="font-semibold text-lg mb-2">Septembre - Décembre</h3>
            <p className="text-gray-600">Mise en œuvre des projets lauréats</p>
          </div>
        </div>
      </section>
      
      {/* Chiffres clés */}
      <section className="bg-gray-100 rounded-lg py-12 px-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Édition précédente en chiffres</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <span className="text-4xl font-bold text-primary-600 block mb-2">150</span>
            <span className="text-gray-700">Projets soumis</span>
          </div>
          
          <div>
            <span className="text-4xl font-bold text-primary-600 block mb-2">5 238</span>
            <span className="text-gray-700">Citoyens participants</span>
          </div>
          
          <div>
            <span className="text-4xl font-bold text-primary-600 block mb-2">12</span>
            <span className="text-gray-700">Projets réalisés</span>
          </div>
          
          <div>
            <span className="text-4xl font-bold text-primary-600 block mb-2">500 000 €</span>
            <span className="text-gray-700">Budget total</span>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Prêt à participer ?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Rejoignez les milliers de citoyens qui contribuent déjà à l'amélioration de notre ville.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/preferences" className="btn btn-primary text-lg px-6 py-3">
            Découvrir et voter
          </Link>
          <Link to="/submit" className="btn btn-secondary text-lg px-6 py-3">
            Soumettre un projet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;