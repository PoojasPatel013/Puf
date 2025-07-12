import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Text,
  Flex,
  Heading,
  Button,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import {
  FiGitCommit,
  FiPackage,
  FiStar,
  FiActivity,
  FiPlus,
} from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { modelService } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardStats, userRepos] = await Promise.all([
          modelService.getDashboardStats(),
          modelService.getUserRepositories(),
        ]);
        setStats(dashboardStats);
        setRepositories(userRepos);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, change }) => (
    <Box
      p={5}
      bg={bgColor}
      rounded="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Box flex="1">
          <StatLabel fontSize="sm" color="gray.500">
            {title}
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="medium">
            {value}
          </StatNumber>
          {change && (
            <StatHelpText mb={0}>
              <StatArrow
                type={change >= 0 ? 'increase' : 'decrease'}
              />
              {Math.abs(change)}%
            </StatHelpText>
          )}
        </Box>
        <Box
          p={3}
          bg={useColorModeValue('gray.100', 'gray.700')}
          rounded="lg"
        >
          <Icon as={icon} w={6} h={6} color="blue.500" />
        </Box>
      </Flex>
    </Box>
  );

  const RepositoryCard = ({ repository }) => (
    <Box
      p={5}
      bg={bgColor}
      rounded="lg"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="sm"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" as={RouterLink} to={`/repository/${repository.id}`}>
          {repository.name}
        </Heading>
        <Badge colorScheme={repository.private ? 'red' : 'green'}>
          {repository.private ? 'Private' : 'Public'}
        </Badge>
      </Flex>
      <Text color="gray.500" noOfLines={2} mb={4}>
        {repository.description}
      </Text>
      <HStack spacing={4}>
        <Flex align="center">
          <Icon as={FiGitCommit} mr={1} />
          <Text fontSize="sm">{repository.commits} commits</Text>
        </Flex>
        <Flex align="center">
          <Icon as={FiStar} mr={1} />
          <Text fontSize="sm">{repository.stars} stars</Text>
        </Flex>
        <Flex align="center">
          <Icon as={FiPackage} mr={1} />
          <Text fontSize="sm">{repository.models} models</Text>
        </Flex>
      </HStack>
    </Box>
  );

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Dashboard</Heading>
        <Button
          as={RouterLink}
          to="/repository/new"
          colorScheme="blue"
          leftIcon={<FiPlus />}
        >
          New Repository
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <StatCard
          title="Total Models"
          value={stats?.totalModels || 0}
          icon={FiPackage}
          change={stats?.modelGrowth}
        />
        <StatCard
          title="Total Commits"
          value={stats?.totalCommits || 0}
          icon={FiGitCommit}
          change={stats?.commitGrowth}
        />
        <StatCard
          title="Stars Received"
          value={stats?.totalStars || 0}
          icon={FiStar}
          change={stats?.starGrowth}
        />
        <StatCard
          title="Activity Score"
          value={stats?.activityScore || 0}
          icon={FiActivity}
        />
      </SimpleGrid>

      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="md">Recent Repositories</Heading>
          <Button
            as={RouterLink}
            to="/repositories"
            variant="ghost"
            colorScheme="blue"
            size="sm"
          >
            View All
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          {repositories.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} />
          ))}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
