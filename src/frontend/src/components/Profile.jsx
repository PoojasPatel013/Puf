import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useToast,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  Icon,
} from '@chakra-ui/react';
import {
  FiGitCommit,
  FiPackage,
  FiStar,
  FiActivity,
  FiEdit2,
} from 'react-icons/fi';
import { authService, modelService } from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userStats, userRepos] = await Promise.all([
          modelService.getUserStats(user.id),
          modelService.getUserRepositories(user.id),
        ]);
        setStats(userStats);
        setRepositories(userRepos);
      } catch (error) {
        toast({
          title: 'Error fetching user data',
          description: error.message,
          status: 'error',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authService.updateProfile(user);
      setEditing(false);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const StatCard = ({ label, value, icon }) => (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
    >
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.500">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </VStack>
        <Icon as={icon} boxSize={6} color="blue.500" />
      </Flex>
    </Box>
  );

  return (
    <Box p={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={8}
        align={{ base: 'center', md: 'start' }}
      >
        <VStack spacing={4} align="center" w={{ base: 'full', md: '300px' }}>
          <Avatar
            size="2xl"
            name={user.name}
            src={user.avatar_url}
          />
          <VStack spacing={1} align="center">
            <Heading size="lg">{user.name}</Heading>
            <Text color="gray.500">{user.email}</Text>
            <Badge colorScheme="blue">Pro User</Badge>
          </VStack>
          {!editing && (
            <Button
              leftIcon={<FiEdit2 />}
              onClick={() => setEditing(true)}
              size="sm"
            >
              Edit Profile
            </Button>
          )}
        </VStack>

        <Box flex="1">
          {editing ? (
            <Box
              as="form"
              onSubmit={handleUpdateProfile}
              bg={bgColor}
              p={6}
              borderRadius="lg"
              border="1px"
              borderColor={borderColor}
            >
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={user.name}
                    onChange={(e) =>
                      setUser({ ...user, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Input
                    value={user.bio || ''}
                    onChange={(e) =>
                      setUser({ ...user, bio: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={user.location || ''}
                    onChange={(e) =>
                      setUser({ ...user, location: e.target.value })
                    }
                  />
                </FormControl>
                <Flex gap={2}>
                  <Button type="submit" colorScheme="blue">
                    Save Changes
                  </Button>
                  <Button onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ) : (
            <Tabs>
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Repositories</Tab>
                <Tab>Activity</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <SimpleGrid
                    columns={{ base: 1, md: 2, lg: 4 }}
                    spacing={4}
                    mb={8}
                  >
                    <StatCard
                      label="Total Models"
                      value={stats?.totalModels || 0}
                      icon={FiPackage}
                    />
                    <StatCard
                      label="Total Commits"
                      value={stats?.totalCommits || 0}
                      icon={FiGitCommit}
                    />
                    <StatCard
                      label="Stars Received"
                      value={stats?.starsReceived || 0}
                      icon={FiStar}
                    />
                    <StatCard
                      label="Contributions"
                      value={stats?.contributions || 0}
                      icon={FiActivity}
                    />
                  </SimpleGrid>

                  {user.bio && (
                    <Box mb={6}>
                      <Text fontSize="sm" color="gray.500">
                        Bio
                      </Text>
                      <Text>{user.bio}</Text>
                    </Box>
                  )}

                  {user.location && (
                    <Box>
                      <Text fontSize="sm" color="gray.500">
                        Location
                      </Text>
                      <Text>{user.location}</Text>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel>
                  <SimpleGrid
                    columns={{ base: 1, md: 2 }}
                    spacing={4}
                  >
                    {repositories.map((repo) => (
                      <Box
                        key={repo.id}
                        p={5}
                        shadow="md"
                        borderWidth="1px"
                        borderRadius="lg"
                        bg={bgColor}
                      >
                        <Heading size="md" mb={2}>
                          {repo.name}
                        </Heading>
                        <Text color="gray.500" mb={4}>
                          {repo.description}
                        </Text>
                        <Flex gap={2}>
                          <Badge>{repo.language}</Badge>
                          <Badge>
                            <Icon as={FiStar} mr={1} />
                            {repo.stars}
                          </Badge>
                        </Flex>
                      </Box>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    {stats?.recentActivity?.map((activity) => (
                      <Box
                        key={activity.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        bg={bgColor}
                      >
                        <Flex align="center" gap={2}>
                          <Icon
                            as={activity.type === 'commit' ? FiGitCommit : FiStar}
                            color="blue.500"
                          />
                          <Text>{activity.description}</Text>
                        </Flex>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                          {new Date(activity.date).toLocaleDateString()}
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
