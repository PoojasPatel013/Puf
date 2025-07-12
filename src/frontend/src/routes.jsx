import React from 'react';
import { Box, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ModelList from './components/ModelList';
import Repository from './components/Repository';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Compare from './components/Compare';
import Issues from './components/Issues';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import Experiments from './pages/Experiments';
import ModelVersions from './components/ModelVersions';
import { useAuth } from './context/AuthContext';
import theme from './theme';

const ErrorFallback = () => (
  <Box p={5} textAlign="center">
    <Alert status="error" mb={4}>
      <AlertIcon />
      Something went wrong
    </Alert>
    <Button onClick={() => window.location.reload()}>
      Reload page
    </Button>
  </Box>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppWrapper = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/models" element={<ModelList />} />
          <Route path="/repository" element={<Repository />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/model/:id/analytics" element={<AnalyticsDashboard />} />
          <Route path="/login" element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } />
          <Route path="/register" element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/models/:id" element={
            <ProtectedRoute>
              <ModelDetail />
            </ProtectedRoute>
          } />
          <Route path="/experiments" element={
            <ProtectedRoute>
              <Experiments />
            </ProtectedRoute>
          } />
          <Route path="/repository/:id" element={
            <ProtectedRoute>
              <Repository />
            </ProtectedRoute>
          } />
          <Route path="/repository/:id/versions" element={
            <ProtectedRoute>
              <ModelVersions />
            </ProtectedRoute>
          } />
          <Route path="/repository/:id/compare" element={
            <ProtectedRoute>
              <Compare />
            </ProtectedRoute>
          } />
          <Route path="/repository/:id/issues" element={
            <ProtectedRoute>
              <Issues />
            </ProtectedRoute>
          } />
          <Route path="/repository/:id/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: 'login',
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <AuthRoute>
            <Register />
          </AuthRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'models',
        element: (
          <ProtectedRoute>
            <Models />
          </ProtectedRoute>
        ),
      },
      {
        path: 'models/:id',
        element: (
          <ProtectedRoute>
            <ModelDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: 'experiments',
        element: (
          <ProtectedRoute>
            <Experiments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'repository/:id',
        element: (
          <ProtectedRoute>
            <Repository />
          </ProtectedRoute>
        ),
      },
      {
        path: 'repository/:id/versions',
        element: (
          <ProtectedRoute>
            <ModelVersions />
          </ProtectedRoute>
        ),
      },
      {
        path: 'repository/:id/compare',
        element: (
          <ProtectedRoute>
            <Compare />
          </ProtectedRoute>
        ),
      },
      {
        path: 'repository/:id/issues',
        element: (
          <ProtectedRoute>
            <Issues />
          </ProtectedRoute>
        ),
      },
      {
        path: 'repository/:id/settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
