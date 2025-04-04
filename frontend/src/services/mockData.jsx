// src/services/mockData.js
// Cette structure contient toutes les données mockées pour la démo

// Utilisateurs mockés
export const users = [
    {
      id: '1',
      email: 'demo@evry.fr',
      password: 'demo', // En production, les mots de passe ne seraient jamais stockés en clair
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'user'
    },
    {
      id: '2',
      email: 'admin@evry.fr',
      password: 'admin',
      firstName: 'Admin',
      lastName: 'Système',
      role: 'admin'
    }
  ];
  
  // Projets mockés
  export const projects = [
    {
      id: '1',
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
        coordinates: [48.6304, 2.4507]
      },
      themes: ['1', '2'],
      images: [
        'https://via.placeholder.com/800x600?text=Jardin+Partagé+1',
        'https://via.placeholder.com/800x600?text=Jardin+Partagé+2',
        'https://via.placeholder.com/800x600?text=Jardin+Partagé+3'
      ],
      submittedBy: '1', // ID de l'utilisateur
      submissionDate: '2025-02-15',
      status: 'approved',
      votes: 87
    },
    {
      id: '2',
      title: 'Rénovation du terrain de basket du parc',
      shortDescription: 'Remise en état du terrain de basket pour permettre aux jeunes de pratiquer leur sport favori',
      fullDescription: `
        ## Description du projet
        Le terrain de basket du parc municipal est très utilisé mais son état s'est dégradé au fil des années. Ce projet vise à le rénover complètement pour offrir un espace de qualité aux sportifs de tous âges.
        
        ## Travaux prévus
        - Réfection complète du revêtement de sol
        - Installation de nouveaux panneaux et paniers
        - Traçage des lignes aux normes actuelles
        - Installation d'un éclairage LED économe en énergie
        - Mise en place de bancs pour les spectateurs
        
        ## Bénéfices attendus
        - Encourager la pratique sportive chez les jeunes
        - Créer un lieu de rencontre intergénérationnel
        - Réduire les nuisances sonores grâce à un revêtement adapté
        - Limiter la consommation énergétique avec un éclairage moderne
      `,
      budget: 18000,
      location: {
        type: 'Point',
        coordinates: [48.6280, 2.4530]
      },
      themes: ['5', '3'],
      images: [
        'https://via.placeholder.com/800x600?text=Terrain+de+Basket+1',
        'https://via.placeholder.com/800x600?text=Terrain+de+Basket+2'
      ],
      submittedBy: '1',
      submissionDate: '2025-02-20',
      status: 'approved',
      votes: 64
    },
    {
      id: '3',
      title: 'Installation de stations de réparation de vélos',
      shortDescription: 'Mise en place de stations publiques pour permettre aux cyclistes de réparer leurs vélos',
      fullDescription: `
        ## Description
        Ce projet vise à installer 5 stations de réparation de vélos en libre-service dans des lieux stratégiques de la ville.
        
        ## Équipement des stations
        - Une pompe à air
        - Un jeu de clés Allen et tournevis
        - Des démonte-pneus
        - Un support pour maintenir le vélo pendant la réparation
        
        ## Emplacements proposés
        - Devant la gare
        - Place du marché
        - Campus universitaire
        - Parc des sports
        - Centre commercial
        
        ## Avantages
        - Encourager la mobilité douce
        - Réduire les obstacles à l'utilisation quotidienne du vélo
        - Service accessible 24h/24 et 7j/7
        - Contribution à la réduction des émissions de CO2
      `,
      budget: 12000,
      location: {
        type: 'Point',
        coordinates: [48.6250, 2.4490]
      },
      themes: ['6', '1'],
      images: [
        'https://via.placeholder.com/800x600?text=Stations+Vélos+1',
        'https://via.placeholder.com/800x600?text=Stations+Vélos+2'
      ],
      submittedBy: '2',
      submissionDate: '2025-03-05',
      status: 'approved',
      votes: 53
    },
    {
      id: '4',
      title: 'Création d\'une fresque murale collaborative',
      shortDescription: 'Réalisation d\'une fresque artistique par les habitants pour embellir un mur disgracieux',
      fullDescription: `
        ## Présentation du projet
        Ce projet artistique et participatif vise à transformer un mur gris et dégradé en une œuvre d'art collective.
        
        ## Déroulement du projet
        - Organisation d'ateliers de conception avec les habitants
        - Sélection collective du design final
        - Préparation du mur par les services techniques
        - Réalisation de la fresque avec l'aide d'un artiste professionnel
        - Inauguration festive avec les participants
        
        ## Matériel nécessaire
        - Peintures écologiques de différentes couleurs
        - Échafaudages et équipements de sécurité
        - Outils de peinture (pinceaux, rouleaux, etc.)
        - Vernis de protection anti-graffiti
      `,
      budget: 8000,
      location: {
        type: 'Point',
        coordinates: [48.6270, 2.4510]
      },
      themes: ['4', '8'],
      images: [
        'https://via.placeholder.com/800x600?text=Fresque+Murale+1'
      ],
      submittedBy: '1',
      submissionDate: '2025-03-12',
      status: 'under_review',
      votes: 41
    },
    {
      id: '5',
      title: 'Installation de capteurs de qualité de l\'air',
      shortDescription: 'Déploiement de capteurs connectés pour mesurer et informer sur la qualité de l\'air',
      fullDescription: `
        ## Description du projet
        Ce projet vise à installer un réseau de capteurs connectés permettant de mesurer en temps réel la qualité de l'air dans différents quartiers de la ville.
        
        ## Détails techniques
        - Installation de 10 capteurs mesurant les particules fines, l'ozone, le CO2 et autres polluants
        - Développement d'une application mobile pour consulter les données
        - Affichage des données sur des panneaux d'information existants
        
        ## Objectifs
        - Sensibiliser les habitants à la qualité de l'air
        - Fournir des données précises pour adapter ses activités extérieures
        - Identifier les zones les plus polluées pour mieux cibler les actions futures
        - Évaluer l'impact des mesures environnementales déjà mises en place
      `,
      budget: 15000,
      location: {
        type: 'Point',
        coordinates: [48.6290, 2.4520]
      },
      themes: ['1', '10'],
      images: [
        'https://via.placeholder.com/800x600?text=Capteurs+Air+1',
        'https://via.placeholder.com/800x600?text=Capteurs+Air+2'
      ],
      submittedBy: '2',
      submissionDate: '2025-02-28',
      status: 'approved',
      votes: 38
    }
  ];
  
  // Votes des utilisateurs
  export const votes = [
    {
      id: '1',
      userId: '1',
      projectId: '1',
      date: '2025-06-15'
    }
  ];
  
  // Thèmes pour les projets
  export const themes = [
    { _id: '1', name: 'Environnement', description: 'Projets liés à l\'écologie et l\'environnement', icon: '🌱', color: '#4CAF50', order: 1, isActive: true },
    { _id: '2', name: 'Cadre de vie', description: 'Amélioration du cadre de vie quotidien', icon: '🏙️', color: '#2196F3', order: 2, isActive: true },
    { _id: '3', name: 'Éducation et jeunesse', description: 'Projets pour les jeunes et l\'éducation', icon: '🎓', color: '#FF9800', order: 3, isActive: true },
    { _id: '4', name: 'Culture et patrimoine', description: 'Valorisation du patrimoine et projets culturels', icon: '🎭', color: '#9C27B0', order: 4, isActive: true },
    { _id: '5', name: 'Sport', description: 'Infrastructures et activités sportives', icon: '⚽', color: '#F44336', order: 5, isActive: true },
    { _id: '6', name: 'Mobilité', description: 'Transport et déplacement dans la ville', icon: '🚲', color: '#3F51B5', order: 6, isActive: true },
    { _id: '7', name: 'Prévention et sécurité', description: 'Projets favorisant la sécurité des habitants', icon: '🛡️', color: '#607D8B', order: 7, isActive: true },
    { _id: '8', name: 'Solidarité', description: 'Entraide et inclusion sociale', icon: '🤝', color: '#E91E63', order: 8, isActive: true },
    { _id: '9', name: 'Propreté', description: 'Amélioration de la propreté urbaine', icon: '🧹', color: '#00BCD4', order: 9, isActive: true },
    { _id: '10', name: 'Santé', description: 'Projets liés à la santé et au bien-être', icon: '❤️', color: '#FF5722', order: 10, isActive: true },
    { _id: '11', name: 'Attractivité et emploi', description: 'Développement économique et emploi', icon: '💼', color: '#795548', order: 11, isActive: true },
    { _id: '12', name: 'Logement', description: 'Habitat et logement', icon: '🏠', color: '#FFEB3B', order: 12, isActive: true }
  ];
  
  // Fonction utilitaire pour générer un ID unique
  export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  
  // Fonction utilitaire pour trouver les projets par thèmes
  export const getProjectsByThemes = (themeIds) => {
    return projects.filter(project => 
      project.themes.some(theme => themeIds.includes(theme))
    );
  };
  
  // Local Storage helpers
  export const getStorageItem = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  };
  
  export const setStorageItem = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  };