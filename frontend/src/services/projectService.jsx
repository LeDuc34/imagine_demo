// src/services/projectService.js
import api from './api';
import { projects, generateId, votes, getStorageItem, setStorageItem } from './mockData';

// Récupère les données mockées ou du localStorage si elles existent
const getLocalProjects = () => {
  const storedProjects = getStorageItem('demo_projects');
  return storedProjects || [...projects];
};

const getLocalVotes = () => {
  const storedVotes = getStorageItem('demo_votes');
  return storedVotes || [...votes];
};

// Récupère tous les projets avec pagination
export const getProjects = async (page = 1, limit = 10) => {
  await api.get(`/projects?page=${page}&limit=${limit}`); // Simulation d'appel API

  const allProjects = getLocalProjects();
  
  // Calculer pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProjects = allProjects.slice(startIndex, endIndex);
  
  return {
    data: paginatedProjects,
    totalPages: Math.ceil(allProjects.length / limit),
    currentPage: page,
    totalCount: allProjects.length
  };
};

// Récupère un projet par son ID
export const getProject = async (id) => {
  await api.get(`/projects/${id}`); // Simulation d'appel API
  
  const allProjects = getLocalProjects();
  const project = allProjects.find(p => p.id === id);
  
  if (!project) {
    throw new Error('Projet non trouvé');
  }
  
  return project;
};

// Récupère des projets recommandés selon les thèmes
export const getRecommendedProjects = async (themesIds = [], excludedIds = []) => {
  const queryParams = new URLSearchParams();
  themesIds.forEach(id => queryParams.append('themeId', id));
  excludedIds.forEach(id => queryParams.append('excludeId', id));
  
  await api.get(`/projects/recommended?${queryParams.toString()}`); // Simulation d'appel API
  
  const allProjects = getLocalProjects();
  
  // Filtrer les projets par thèmes et exclure ceux déjà vus
  let filteredProjects = allProjects.filter(project => {
    // Vérifier si au moins un thème correspond
    const hasMatchingTheme = themesIds.length === 0 || 
      project.themes.some(theme => themesIds.includes(theme));
    
    // Vérifier si le projet n'est pas dans la liste des exclusions
    const isNotExcluded = !excludedIds.includes(project.id);
    
    return hasMatchingTheme && isNotExcluded;
  });
  
  return filteredProjects;
};

// Crée un nouveau projet
export const createProject = async (projectData) => {
  await api.post('/projects', projectData); // Simulation d'appel API
  
  const allProjects = getLocalProjects();
  
  // Créer un nouveau projet avec ID unique
  const newProject = {
    ...projectData,
    id: generateId(),
    submissionDate: new Date().toISOString(),
    status: 'under_review',
    votes: 0
  };
  
  // Ajouter le projet à la liste
  const updatedProjects = [...allProjects, newProject];
  setStorageItem('demo_projects', updatedProjects);
  
  return newProject;
};

// Met à jour un projet existant
export const updateProject = async (id, projectData) => {
  await api.patch(`/projects/${id}`, projectData); // Simulation d'appel API
  
  const allProjects = getLocalProjects();
  
  // Trouver et mettre à jour le projet
  const projectIndex = allProjects.findIndex(p => p.id === id);
  
  if (projectIndex === -1) {
    throw new Error('Projet non trouvé');
  }
  
  const updatedProject = {
    ...allProjects[projectIndex],
    ...projectData,
    updatedAt: new Date().toISOString()
  };
  
  allProjects[projectIndex] = updatedProject;
  setStorageItem('demo_projects', allProjects);
  
  return updatedProject;
};

// Vote pour un projet
export const voteForProject = async (projectId) => {
  await api.post('/votes', { projectId }); // Simulation d'appel API
  
  // Obtenir l'utilisateur actuel depuis le localStorage
  const currentUser = getStorageItem('demo_user');
  
  if (!currentUser) {
    throw new Error('Utilisateur non connecté');
  }
  
  const allProjects = getLocalProjects();
  const allVotes = getLocalVotes();
  
  // Vérifier si l'utilisateur a déjà voté
  const existingVote = allVotes.find(v => v.userId === currentUser.id);
  
  if (existingVote) {
    // Si l'utilisateur change son vote
    if (existingVote.projectId !== projectId) {
      // Diminuer le vote du projet précédent
      const previousProject = allProjects.find(p => p.id === existingVote.projectId);
      if (previousProject) {
        previousProject.votes = Math.max(0, previousProject.votes - 1);
      }
      
      // Augmenter le vote du nouveau projet
      const newProject = allProjects.find(p => p.id === projectId);
      if (newProject) {
        newProject.votes += 1;
      }
      
      // Mettre à jour le vote
      existingVote.projectId = projectId;
      existingVote.date = new Date().toISOString();
    }
  } else {
    // Premier vote de l'utilisateur
    const newVote = {
      id: generateId(),
      userId: currentUser.id,
      projectId,
      date: new Date().toISOString()
    };
    
    allVotes.push(newVote);
    
    // Augmenter le vote du projet
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      project.votes += 1;
    }
  }
  
  // Sauvegarder les modifications
  setStorageItem('demo_projects', allProjects);
  setStorageItem('demo_votes', allVotes);
  
  return { success: true };
};

// Récupère le vote de l'utilisateur courant
export const getMyVote = async () => {
  await api.get('/votes/me'); // Simulation d'appel API
  
  // Obtenir l'utilisateur actuel depuis le localStorage
  const currentUser = getStorageItem('demo_user');
  
  if (!currentUser) {
    return null;
  }
  
  const allVotes = getLocalVotes();
  const allProjects = getLocalProjects();
  
  // Trouver le vote de l'utilisateur
  const userVote = allVotes.find(v => v.userId === currentUser.id);
  
  if (!userVote) {
    return null;
  }
  
  // Trouver le projet correspondant
  const votedProject = allProjects.find(p => p.id === userVote.projectId);
  
  return {
    vote: userVote,
    project: votedProject
  };
};