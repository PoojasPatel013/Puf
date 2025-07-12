import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Input,
  IconButton,
  HStack,
  Icon,
  Text,
  Kbd,
  Tooltip,
  Container,
  Image,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, SearchIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { FiBell, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const DogLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.2c-6.188 0-11.2-5.012-11.2-11.2S9.812 4.8 16 4.8 27.2 9.812 27.2 16 22.188 27.2 16 27.2z" fill="currentColor"/>
    <path d="M22 12c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-8 0c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" fill="currentColor"/>
    <path d="M16 20c-2.761 0-5 1.79-5 4h10c0-2.21-2.239-4-5-4z" fill="currentColor"/>
  </svg>
);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
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

  useEffect(() => {
    // Fetch notifications here
    // This is just a placeholder
    setNotifications([{ id: 1, title: 'New model version available' }]);
  }, []);

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor}>
      <Container maxW="container.xl">
        <Flex h="16" alignItems="center" justifyContent="space-between">
          <HStack spacing={4} flex={1}>
            {/* Logo */}
            <Box
              as={RouterLink}
              to="/"
              color={useColorModeValue('github.800', 'white')}
              display="flex"
              alignItems="center"
            >
              <Icon as={DogLogo} boxSize="8" mr={2} />
              <Text fontWeight="bold" fontSize="xl">PUF</Text>
            </Box>

            {/* Search Bar */}
            <Flex
              flex={1}
              maxW="600px"
              position="relative"
              alignItems="center"
            >
              <Input
                placeholder="Search or jump to..."
                bg={useColorModeValue('github.50', 'github.700')}
                border="1px solid"
                borderColor={borderColor}
                _placeholder={{ color: 'github.400' }}
                _hover={{ borderColor: 'github.400' }}
                _focus={{
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px blue.400',
                }}
              />
              <Tooltip label="Press / to search">
                <Flex
                  position="absolute"
                  right="3"
                  alignItems="center"
                  color="github.400"
                >
                  <Kbd>/</Kbd>
                </Flex>
              </Tooltip>
            </Flex>
          </HStack>

          <HStack spacing={4}>
            {/* Create New Button */}
            <Menu>
              <MenuButton
                as={Button}
                variant="github"
                leftIcon={<FiPlus />}
                size="sm"
              >
                New
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/repository/new">New Repository</MenuItem>
                <MenuItem as={RouterLink} to="/repository/import">Import Repository</MenuItem>
                <MenuDivider />
                <MenuItem as={RouterLink} to="/model/new">New Model Version</MenuItem>
                <MenuItem as={RouterLink} to="/issues/new">New Issue</MenuItem>
              </MenuList>
            </Menu>

            {/* Notifications */}
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Notifications"
                icon={<Icon as={FiBell} />}
                variant="ghost"
                color="github.500"
                position="relative"
              >
                {notifications.length > 0 && (
                  <Box
                    position="absolute"
                    top="-1"
                    right="-1"
                    px="2"
                    py="1"
                    fontSize="xs"
                    fontWeight="bold"
                    lineHeight="none"
                    color="white"
                    bg="red.500"
                    rounded="full"
                  >
                    {notifications.length}
                  </Box>
                )}
              </MenuButton>
              <MenuList>
                {notifications.map(notification => (
                  <MenuItem key={notification.id}>{notification.title}</MenuItem>
                ))}
                {notifications.length === 0 && (
                  <MenuItem isDisabled>No new notifications</MenuItem>
                )}
              </MenuList>
            </Menu>

            {/* Theme Toggle */}
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
              variant="ghost"
              color="github.500"
            />

            {/* User Menu */}
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="sm"
                px={1}
              >
                <Avatar
                  size="sm"
                  name={user?.name}
                  src={user?.avatar_url || `https://avatars.dicebear.com/api/avataaars/${user?.username}.svg`}
                />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  <Stack spacing={0}>
                    <Text fontWeight="medium">Signed in as</Text>
                    <Text color="github.500">{user?.username}</Text>
                  </Stack>
                </MenuItem>
                <MenuDivider />
                <MenuItem as={RouterLink} to="/profile">Your Profile</MenuItem>
                <MenuItem as={RouterLink} to="/repositories">Your Repositories</MenuItem>
                <MenuItem as={RouterLink} to="/models">Your Models</MenuItem>
                <MenuDivider />
                <MenuItem as={RouterLink} to="/settings">Settings</MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
