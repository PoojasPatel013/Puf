import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';
import Compare from './pages/Compare';
import Experiments from './pages/Experiments';
import Profile from './components/Profile';
import './App.css';

function AuthRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  const { user } = useAuth();
  const bgColor = useColorModeValue('gray.50', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor}>
      {user && <Navbar />}
      <Flex>
        {user && <Sidebar />}
        <Box flex="1" p={4} ml={user ? '64' : 0}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
}

export default function App() {
  const location = useLocation();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Routes>
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
        </Routes>
      </Box>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/models" element={<ProtectedRoute><Models /></ProtectedRoute>} />
        <Route path="/models/:id" element={<ProtectedRoute><ModelDetail /></ProtectedRoute>} />
        <Route path="/models/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        <Route path="/experiments" element={<ProtectedRoute><Experiments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}
