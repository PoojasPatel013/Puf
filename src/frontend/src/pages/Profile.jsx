import { Box, Grid, GridItem, Heading, Text, VStack, HStack, Button } from '@chakra-ui/react';
import { FaUserFriends, FaStar, FaGitAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import User from '../components/User';
import Repository from '../components/Repository';

const Profile = () => {
  const navigate = useNavigate();
  
  // TODO: Replace with actual API calls
  const user = {
    username: 'pufuser',
    email: 'user@example.com',
    avatar_url: '/default-avatar.png',
    bio: 'Machine learning enthusiast and model version control advocate',
    repos_count: 12,
    followers_count: 45,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Git', 'Docker'],
  };

  const repositories = [
    {
      name: 'model-version-control',
      description: 'A comprehensive tool for managing ML model versions',
      language: 'Python',
      stars: 123,
      branches: 5,
      views: 1000,
      starred: false,
    },
    // Add more repositories as needed
  ];

  return (
    <Box p={8} maxW="container.xl" mx="auto">
      <Box mb={8}>
        <User user={user} />
      </Box>

      <Box mb={8}>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Repositories</Heading>
          <Button leftIcon={<FaGitAlt />} onClick={() => navigate('/new-repo')}>
            New Repository
          </Button>
        </HStack>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {repositories.map((repo, index) => (
            <Repository key={index} repo={repo} />
          ))}
        </Grid>
      </Box>

      <Box>
        <Heading size="lg" mb={4}>Social Connections</Heading>
        <VStack spacing={4}>
          <HStack justify="space-between" w="full">
            <HStack>
              <Icon as={FaUserFriends} />
              <Text>Followers</Text>
            </HStack>
            <Text>{user.followers_count}</Text>
          </HStack>
          <HStack justify="space-between" w="full">
            <HStack>
              <Icon as={FaStar} />
              <Text>Stars</Text>
            </HStack>
            <Text>256</Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Profile;
