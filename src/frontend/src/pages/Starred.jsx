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
import { FiStar, FiSearch, FiGitBranch, FiCode, FiGitMerge, FiTrash } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { modelService } from '../services/modelService';

export default function Starred() {
  const { user } = useAuth();
  const [starredItems, setStarredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStarredItems();
  }, []);

  const fetchStarredItems = async () => {
    try {
      const response = await modelService.getStarredItems();
      setStarredItems(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching starred items:', error);
      setLoading(false);
    }
  };

  const unstarItem = async (type, id) => {
    try {
      await modelService.removeStar(type, id);
      fetchStarredItems();
    } catch (error) {
      console.error('Error unstarred item:', error);
    }
  };

  const filteredItems = starredItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Starred</Heading>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search starred items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {loading ? (
          <Box textAlign="center">
            <Text>Loading starred items...</Text>
          </Box>
        ) : (
          filteredItems.map((item) => (
            <Card
              key={item.id}
              bg={useColorModeValue('white', 'gray.800')}
              shadow="sm"
              rounded="lg"
            >
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{item.name}</Heading>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiGitMerge />}
                      colorScheme="blue"
                      as={Link}
                      href={item.type === 'repository' 
                        ? `/repositories/${item.name}/compare`
                        : `/models/${item.name}/compare`}
                    >
                      Compare
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiCode />}
                      colorScheme="green"
                      as={Link}
                      href={item.type === 'repository' 
                        ? `/repositories/${item.name}/code`
                        : `/models/${item.name}`}
                    >
                      {item.type === 'repository' ? 'Code' : 'View'}
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash />}
                      colorScheme="red"
                      onClick={() => unstarItem(item.type, item.id)}
                    >
                      Unstar
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>

              <CardBody>
                <VStack align="start" spacing={4}>
                  {item.type === 'repository' && (
                    <Text>
                      <Icon as={FiGitBranch} mr={2} />
                      {item.branches?.length || 0} branches
                    </Text>
                  )}
                  <Text>
                    <Icon as={FiStar} mr={2} />
                    {item.stars || 0} stars
                  </Text>
                  <Text>
                    {item.description || 'No description'}
                  </Text>
                </VStack>
              </CardBody>

              <CardFooter>
                <Button
                  size="sm"
                  colorScheme="blue"
                  as={Link}
                  href={item.type === 'repository' 
                    ? `/repositories/${item.name}/models`
                    : `/models/${item.name}/versions`}
                >
                  {item.type === 'repository' ? 'View Models' : 'View Versions'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
}
