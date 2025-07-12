import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  Divider,
  Avatar,
  AvatarGroup,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBook,
  FiGitBranch,
  FiPackage,
  FiAlertCircle,
  FiStar,
  FiUsers,
} from 'react-icons/fi';

export default function Sidebar() {
  const location = useLocation();
  const borderColor = useColorModeValue('github.200', 'github.700');
  const hoverBg = useColorModeValue('github.50', 'github.700');
  const activeBg = useColorModeValue('github.100', 'github.600');
  const textColor = useColorModeValue('github.800', 'github.100');
  const mutedColor = useColorModeValue('github.500', 'github.400');

  const NavItem = ({ icon, children, to, count, isRepo }) => {
    const isActive = location.pathname === to;
    return (
      <Box
        as={RouterLink}
        to={to}
        w="full"
        _hover={{ textDecoration: 'none' }}
      >
        <HStack
          px="3"
          py="2"
          spacing={3}
          bg={isActive ? activeBg : 'transparent'}
          color={textColor}
          _hover={{
            bg: !isActive && hoverBg,
          }}
          rounded="md"
        >
          <Icon as={icon} boxSize="5" color={mutedColor} />
          <Text fontSize="sm" flex={1}>
            {children}
          </Text>
          {count !== undefined && (
            <Badge
              px="2"
              py="1"
              rounded="full"
              colorScheme={isActive ? 'blue' : 'gray'}
              fontSize="xs"
            >
              {count}
            </Badge>
          )}
          {isRepo && (
            <AvatarGroup size="xs" max={2}>
              <Avatar name="User 1" src="https://avatars.dicebear.com/api/avataaars/user1.svg" />
              <Avatar name="User 2" src="https://avatars.dicebear.com/api/avataaars/user2.svg" />
            </AvatarGroup>
          )}
        </HStack>
      </Box>
    );
  };

  return (
    <Box
      as="nav"
      pos="fixed"
      top="16"
      left="0"
      h="calc(100vh - 16)"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue('white', 'github.800')}
      borderRight="1px"
      borderColor={borderColor}
      w="64"
      sx={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: borderColor,
          borderRadius: '24px',
        },
      }}
    >
      <VStack p="4" spacing="6" align="stretch">
        {/* Top Section */}
        <VStack spacing="1" align="stretch">
          <NavItem icon={FiHome} to="/">
            Dashboard
          </NavItem>
        </VStack>

        {/* Repositories Section */}
        <VStack spacing="1" align="stretch">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="medium"
            textTransform="uppercase"
            color={mutedColor}
            mb="1"
          >
            Repositories
          </Text>
          <NavItem icon={FiBook} to="/repositories" count={8}>
            Your repositories
          </NavItem>
          <NavItem icon={FiStar} to="/starred" count={12}>
            Starred
          </NavItem>
        </VStack>

        {/* Recent Repositories */}
        <VStack spacing="1" align="stretch">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="medium"
            textTransform="uppercase"
            color={mutedColor}
            mb="1"
          >
            Recent Repositories
          </Text>
          <NavItem icon={FiBook} to="/repo/1" isRepo>
            user/repo-1
          </NavItem>
          <NavItem icon={FiBook} to="/repo/2" isRepo>
            org/repo-2
          </NavItem>
          <NavItem icon={FiBook} to="/repo/3" isRepo>
            user/repo-3
          </NavItem>
        </VStack>

        {/* Models Section */}
        <VStack spacing="1" align="stretch">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="medium"
            textTransform="uppercase"
            color={mutedColor}
            mb="1"
          >
            Models
          </Text>
          <NavItem icon={FiPackage} to="/models" count={5}>
            Your models
          </NavItem>
          <NavItem icon={FiGitBranch} to="/versions" count={3}>
            Versions
          </NavItem>
        </VStack>

        {/* Teams Section */}
        <VStack spacing="1" align="stretch">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="medium"
            textTransform="uppercase"
            color={mutedColor}
            mb="1"
          >
            Teams
          </Text>
          <NavItem icon={FiUsers} to="/teams/ml">
            ML Team
          </NavItem>
          <NavItem icon={FiUsers} to="/teams/research">
            Research
          </NavItem>
        </VStack>

        {/* Issues */}
        <VStack spacing="1" align="stretch">
          <NavItem icon={FiAlertCircle} to="/issues" count={3}>
            Issues
          </NavItem>
        </VStack>
      </VStack>
    </Box>
  );
}
