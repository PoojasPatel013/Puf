import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.800')}>
          <Navbar />
          <Flex>
            <Sidebar />
            <Box flex="1" p={4} ml="64">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/models" element={<Models />} />
                <Route path="/models/:version" element={<ModelDetail />} />
                <Route path="/models/compare" element={<Compare />} />
                <Route path="/experiments" element={<Experiments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/teams/:teamName" element={<Teams />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/starred" element={<Starred />} />
              </Routes>
            </Box>
          </Flex>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
