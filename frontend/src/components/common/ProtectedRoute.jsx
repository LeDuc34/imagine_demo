import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Composant ProtectedRoute en JSX
const ProtectedRoute = ({ 
  isAllowed, 
  redirectPath = '/login', 
  children 
}) => {
  // Si non autorisé, rediriger vers le chemin spécifié
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />
  }

  // Soit rendre les enfants, soit utiliser Outlet pour les routes imbriquées
  return children ? children : <Outlet />
}

export default ProtectedRoute