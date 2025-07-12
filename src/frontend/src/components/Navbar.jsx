import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  Kbd,
  Tooltip,
  Container,
  Image,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiBell, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = React.useState([]);
  
  const bgColor = useColorModeValue('white', 'github.800');
  const borderColor = useColorModeValue('github.200', 'github.700');

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Box bg={bgColor} shadow="sm" borderBottom="1px" borderColor={borderColor}>
      <Container maxW="container.xl" py={4}>
        <Flex justify="space-between" align="center">
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Logo size="24" />
          </RouterLink>

          <HStack spacing="4">
            <Tooltip label="Search">
              <Icon as={SearchIcon} boxSize="6" cursor="pointer" />
            </Tooltip>
            <Tooltip label="New Model">
              <RouterLink to="/models/upload" style={{ textDecoration: 'none' }}>
                <Icon as={FiPlus} boxSize="6" cursor="pointer" />
              </RouterLink>
            </Tooltip>
            <Tooltip label="Notifications">
              <Icon as={FiBell} boxSize="6" cursor="pointer" />
            </Tooltip>
            <HStack spacing="2">
              <Tooltip label="Toggle Theme">
                <Icon
                  as={colorMode === 'light' ? MoonIcon : SunIcon}
                  boxSize="6"
                  cursor="pointer"
                  onClick={toggleColorMode}
                />
              </Tooltip>
              <Tooltip label="Profile">
                <Image
                  src={user?.avatar_url || Logo}
                  boxSize="6"
                  borderRadius="full"
                  alt="User avatar"
                  cursor="pointer"
                  onClick={() => navigate('/profile')}
                />
              </Tooltip>
              <Tooltip label="Logout">
                <Text
                  fontSize="sm"
                  fontWeight="medium"
                  cursor="pointer"
                  onClick={handleLogout}
                >
                  Logout
                </Text>
              </Tooltip>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
