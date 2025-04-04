import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Budget Participatif</h3>
            <p className="text-gray-600 text-sm">
              Le Budget Participatif d'Évry permet aux citoyens de proposer et de voter pour des projets 
              qui amélioreront leur ville.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-primary-600">Accueil</Link></li>
              <li><Link to="/preferences" className="text-gray-600 hover:text-primary-600">Découvrir et voter</Link></li>
              <li><Link to="/submit" className="text-gray-600 hover:text-primary-600">Soumettre un projet</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-gray-600 hover:text-primary-600">FAQ</Link></li>
              <li><Link to="/guide" className="text-gray-600 hover:text-primary-600">Guide de soumission</Link></li>
              <li><Link to="/calendar" className="text-gray-600 hover:text-primary-600">Calendrier</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">Email: contact@evry.fr</li>
              <li className="text-gray-600">Téléphone: 01 60 91 62 00</li>
              <li className="text-gray-600">Adresse: Hôtel de Ville, Place des Droits de l'Homme et du Citoyen, 91000 Évry</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} Ville d'Évry. Tous droits réservés.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/legal" className="text-sm text-gray-600 hover:text-primary-600">Mentions légales</Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-primary-600">Politique de confidentialité</Link>
            <Link to="/accessibility" className="text-sm text-gray-600 hover:text-primary-600">Accessibilité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;