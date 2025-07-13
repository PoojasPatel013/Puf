import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  useColorModeValue,
  VStack,
  Text,
  Icon,
  Link,
  Divider,
  Flex,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { FiGitBranch, FiPlus, FiSearch, FiStar, FiCode, FiGitMerge } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { modelService } from '../services/modelService';

export default function Repositories() {
  const { user } = useAuth();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const response = await modelService.getRepositories();
      setRepositories(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setLoading(false);
    }
  };

  const createRepository = async () => {
    try {
      const repoName = prompt('Enter repository name:');
      if (repoName) {
        await modelService.createRepository(repoName);
        fetchRepositories();
      }
    } catch (error) {
      console.error('Error creating repository:', error);
    }
  };

  const deleteRepository = async (repoId) => {
    if (window.confirm('Are you sure you want to delete this repository?')) {
      try {
        await modelService.deleteRepository(repoId);
        fetchRepositories();
      } catch (error) {
        console.error('Error deleting repository:', error);
      }
    }
  };

  const filteredRepositories = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Repositories</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={createRepository}
        >
          Create Repository
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {loading ? (
          <Box textAlign="center">
            <Text>Loading repositories...</Text>
          </Box>
        ) : (
          filteredRepositories.map((repo) => (
            <Card
              key={repo.id}
              bg={useColorModeValue('white', 'gray.800')}
              shadow="sm"
              rounded="lg"
            >
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{repo.name}</Heading>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiGitMerge />}
                      colorScheme="blue"
                      as={Link}
                      href={`/repositories/${repo.name}/compare`}
                    >
                      Compare
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiCode />}
                      colorScheme="green"
                      as={Link}
                      href={`/repositories/${repo.name}/code`}
                    >
                      Code
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash />}
                      colorScheme="red"
                      onClick={() => deleteRepository(repo.id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>

              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text>
                    <Icon as={FiGitBranch} mr={2} />
                    {repo.branches?.length || 0} branches
                  </Text>
                  <Text>
                    <Icon as={FiStar} mr={2} />
                    {repo.stars || 0} stars
                  </Text>
                  <Text>
                    {repo.description || 'No description'}
                  </Text>
                </VStack>
              </CardBody>

              <CardFooter>
                <Button
                  size="sm"
                  colorScheme="blue"
                  as={Link}
                  href={`/repositories/${repo.name}/models`}
                >
                  View Models
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
}
