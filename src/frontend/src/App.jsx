import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ChakraProvider, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ModelDetail from './pages/ModelDetail';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Teams from './pages/Teams';
import Repositories from './pages/Repositories';
import Starred from './pages/Starred';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Models from './pages/Models';
import Compare from './pages/Compare';
import Experiments from './pages/Experiments';
import VersionControl from './components/VersionControl';

function App() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <AuthProvider>
      <ChakraProvider theme={theme}>
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
          {!isAuthRoute && <Navbar />}
          <Flex>
            {!isAuthRoute && <Sidebar />}
            <Box flex="1" p={4} ml={isAuthRoute ? 0 : "64"}>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/models" element={<Models />} />
                <Route path="/models/:version" element={<ModelDetail />} />
                <Route path="/models/:version/compare" element={<Compare />} />
                <Route path="/models/:version/versions" element={<Navigate to={`/models/${location.pathname.split('/')[2]}`} />} />
                <Route path="/experiments" element={<Experiments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/teams/:teamName" element={<Teams />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/starred" element={<Starred />} />
                <Route path="/repo/:id" element={<Navigate to="/repositories" />} />
                <Route path="/version-control" element={<VersionControl />} />
              </Routes>
            </Box>
          </Flex>
        </Box>
      </ChakraProvider>
    </AuthProvider>
  );
}

export default App;
