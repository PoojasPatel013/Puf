import React from 'react';
import { Box, Alert, AlertIcon, Button } from '@chakra-ui/react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import Experiments from './pages/Experiments';
import Repository from './components/Repository';
import ModelVersions from './components/ModelVersions';
import Compare from './components/Compare';
import Issues from './components/Issues';
import Settings from './components/Settings';
import Profile from './components/Profile';
import { useAuth } from './context/AuthContext';

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
