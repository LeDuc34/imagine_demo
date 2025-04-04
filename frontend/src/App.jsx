import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';

// Pages
import Home from './pages/Home';
import PreferenceSelection from './pages/PreferenceSelection';
import ProjectComparison from './pages/ProjectComparison';
import ProjectDetails from './pages/ProjectDetails';
import ProjectSubmission from './pages/ProjectSubmission';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

// Layouts
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Composant wrapper qui utilise le contexte Auth
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="preferences" element={<PreferenceSelection />} />
        <Route path="comparison" element={<ProjectComparison />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        
        {/* Routes protégées (nécessitant une authentification) */}
        <Route path="submit" element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/">
            <ProjectSubmission />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/">
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="dashboard" element={
          <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/">
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Page 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PreferencesProvider>
          <AppRoutes />
        </PreferencesProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;