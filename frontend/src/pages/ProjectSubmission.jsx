import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/projectService';
import { getInitialThemes } from '../services/themeService';
import { useAuth } from '../context/AuthContext';

const ProjectSubmission = () => {
  const [step, setStep] = useState(1);
  const [themes, setThemes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    register, 
    control,
    handleSubmit, 
    watch, 
    formState: { errors, isValid } 
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      shortDescription: '',
      fullDescription: '',
      budget: 0,
      location: { latitude: 48.6304, longitude: 2.4507 } // Coordonnées par défaut pour Évry
    }
  });
  
  const watchBudget = watch('budget');
  
  useEffect(() => {
    // Charger les thématiques disponibles
    const fetchThemes = async () => {
      try {
        const themesData = getInitialThemes();
        setThemes(themesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des thématiques:', error);
      }
    };
    
    fetchThemes();
  }, []);
  
  const handleThemeToggle = (themeId) => {
    if (selectedThemes.includes(themeId)) {
      setSelectedThemes(selectedThemes.filter(id => id !== themeId));
    } else {
      setSelectedThemes([...selectedThemes, themeId]);
    }
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setIsUploading(true);
    
    // En mode développement, simulons l'upload
    setTimeout(() => {
      const newImages = files.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      
      setImages([...images, ...files]);
      setPreviewImages([...previewImages, ...newImages]);
      setIsUploading(false);
    }, 1000);
  };
  
  const removeImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previewImages];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setImages(newImages);
    setPreviewImages(newPreviews);
  };
  
  const onSubmit = async (data) => {
    if (selectedThemes.length === 0) {
      alert('Veuillez sélectionner au moins une thématique');
      return;
    }
    
    // Vérifier que le budget ne dépasse pas 50 000 €
    if (data.budget > 50000) {
      alert('Le budget maximum est de 50 000 €');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Transformation des données pour l'API
      const projectData = {
        ...data,
        themes: selectedThemes,
        location: {
          type: 'Point',
          coordinates: [data.location.latitude, data.location.longitude]
        },
        // En mode développement, on simule l'envoi des images
        images: previewImages.map(img => img.url),
        submittedBy: user.id,
        submissionDate: new Date(),
        status: 'submitted',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // En mode développement, on simule la création du projet
      // const response = await createProject(projectData);
      console.log('Projet soumis:', projectData);
      
      // Simuler un délai de traitement
      setTimeout(() => {
        setIsSubmitting(false);
        // Rediriger vers une page de confirmation
        navigate('/submit/success', { state: { projectTitle: data.title } });
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la soumission du projet:', error);
      setIsSubmitting(false);
      alert('Une erreur est survenue lors de la soumission du projet. Veuillez réessayer.');
    }
  };
  
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Étape {step}/5</span>
          <span className="text-gray-500">Soumission de projet</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Proposer un nouveau projet</h1>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Informations de base</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 mb-2">
                Titre du projet <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                className="input"
                placeholder="Ex: Jardin partagé du quartier des Épinettes"
                {...register('title', { 
                  required: 'Le titre est obligatoire',
                  minLength: {
                    value: 5,
                    message: 'Le titre doit contenir au moins 5 caractères'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Le titre ne doit pas dépasser 100 caractères'
                  }
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Choisissez un titre concis et explicite
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="shortDescription" className="block text-gray-700 mb-2">
                Résumé du projet <span className="text-red-500">*</span>
              </label>
              <textarea
                id="shortDescription"
                className="input"
                rows="3"
                placeholder="Décrivez votre projet en quelques phrases"
                {...register('shortDescription', { 
                  required: 'Le résumé est obligatoire',
                  minLength: {
                    value: 20,
                    message: 'Le résumé doit contenir au moins 20 caractères'
                  },
                  maxLength: {
                    value: 500,
                    message: 'Le résumé ne doit pas dépasser 500 caractères'
                  }
                })}
              ></textarea>
              {errors.shortDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Ce résumé sera affiché dans la liste des projets
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!watch('title') || !watch('shortDescription') || errors.title || errors.shortDescription}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Description détaillée</h2>
            
            <div className="mb-6">
              <label htmlFor="fullDescription" className="block text-gray-700 mb-2">
                Description complète <span className="text-red-500">*</span>
              </label>
              <textarea
                id="fullDescription"
                className="input"
                rows="15"
                placeholder="Décrivez en détail votre projet, ses objectifs, son fonctionnement, etc."
                {...register('fullDescription', { 
                  required: 'La description complète est obligatoire',
                  minLength: {
                    value: 100,
                    message: 'La description doit contenir au moins 100 caractères'
                  }
                })}
              ></textarea>
              {errors.fullDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.fullDescription.message}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Vous pouvez utiliser la syntaxe Markdown pour structurer votre texte.
                Exemple: ## Titre, - Liste à puces
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Précédent
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!watch('fullDescription') || errors.fullDescription}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Thématiques</h2>
            
            <p className="text-gray-600 mb-6">
              Sélectionnez les thématiques liées à votre projet (au moins une).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {themes.map(theme => (
                <div
                  key={theme._id}
                  onClick={() => handleThemeToggle(theme._id)}
                  className={`card cursor-pointer transition-all ${
                    selectedThemes.includes(theme._id) 
                      ? 'border-2 shadow-lg' 
                      : 'border border-gray-200'
                  }`}
                  style={{ 
                    borderColor: selectedThemes.includes(theme._id) ? theme.color : '' 
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{theme.icon}</span>
                    <h3 className="font-semibold">{theme.name}</h3>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedThemes.length === 0 && (
              <p className="text-red-500 text-sm mb-6">
                Veuillez sélectionner au moins une thématique
              </p>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Précédent
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={selectedThemes.length === 0}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Budget et localisation</h2>
            
            <div className="mb-6">
              <label htmlFor="budget" className="block text-gray-700 mb-2">
                Budget estimé (en €) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="budget"
                  type="number"
                  className="input pr-16"
                  min="0"
                  max="50000"
                  placeholder="Montant en euros"
                  {...register('budget', { 
                    required: 'Le budget est obligatoire',
                    min: {
                      value: 0,
                      message: 'Le budget ne peut pas être négatif'
                    },
                    max: {
                      value: 50000,
                      message: 'Le budget maximum est de 50 000 €'
                    }
                  })}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">€</span>
                </div>
              </div>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                Le budget maximum autorisé est de 50 000 €
              </p>
              
              {/* Jauge de budget */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>0 €</span>
                  <span>50 000 €</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      watchBudget > 40000 
                        ? 'bg-red-500' 
                        : watchBudget > 30000 
                          ? 'bg-yellow-500' 
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${(watchBudget / 50000) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Localisation du projet</h3>
              <p className="text-gray-600 mb-4">
                Indiquez où votre projet sera implanté.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="latitude" className="block text-gray-700 mb-2">
                    Latitude
                  </label>
                  <Controller
                    name="location.latitude"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="latitude"
                        type="number"
                        step="0.0001"
                        className="input"
                        {...field}
                      />
                    )}
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-gray-700 mb-2">
                    Longitude
                  </label>
                  <Controller
                    name="location.longitude"
                    control={control}
                    render={({ field }) => (
                      <input
                        id="longitude"
                        type="number"
                        step="0.0001"
                        className="input"
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
              
              {/* Carte (simulée en développement) */}
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Carte non disponible en mode développement.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Précédent
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextStep}
                disabled={!watch('budget') || errors.budget}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
        
        {step === 5 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">Médias et finalisation</h2>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Images du projet</h3>
              <p className="text-gray-600 mb-4">
                Ajoutez des photos ou illustrations pour mieux présenter votre projet.
              </p>
              
              <div className="flex items-center justify-center w-full mb-4">
                <label
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">
                        Chargement en cours...
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Cliquez pour choisir</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500">SVG, PNG, JPG or JPEG (MAX. 2MB)</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              </div>
              
              {/* Prévisualisation des images */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image.url} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50"
                        onClick={() => removeImage(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Votre projet sera soumis à validation par l'administration avant d'être publié.
                      Vérifiez bien toutes les informations avant de soumettre votre projet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                Précédent
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Soumission en cours...
                  </span>
                ) : (
                  'Soumettre mon projet'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProjectSubmission;