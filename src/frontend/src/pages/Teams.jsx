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
import { FiUsers, FiPlus, FiSearch, FiEdit, FiTrash } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { modelService } from '../services/modelService';

export default function Teams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await modelService.getTeams();
      setTeams(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setLoading(false);
    }
  };

  const createTeam = async () => {
    try {
      const teamName = prompt('Enter team name:');
      if (teamName) {
        await modelService.createTeam(teamName);
        fetchTeams();
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const deleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await modelService.deleteTeam(teamId);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading size="lg">Teams</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={createTeam}
        >
          Create Team
        </Button>
      </Flex>

      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <Icon as={FiSearch} color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {loading ? (
          <Box textAlign="center">
            <Text>Loading teams...</Text>
          </Box>
        ) : (
          filteredTeams.map((team) => (
            <Card
              key={team.id}
              bg={useColorModeValue('white', 'gray.800')}
              shadow="sm"
              rounded="lg"
            >
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Heading size="md">{team.name}</Heading>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiEdit />}
                      colorScheme="blue"
                      as={Link}
                      href={`/teams/${team.name}/edit`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash />}
                      colorScheme="red"
                      onClick={() => deleteTeam(team.id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>

              <CardBody>
                <VStack align="start" spacing={4}>
                  <Text>
                    <Icon as={FiUsers} mr={2} />
                    {team.members?.length || 0} members
                  </Text>
                  <Text>
                    {team.description || 'No description'}
                  </Text>
                </VStack>
              </CardBody>

              <CardFooter>
                <Button
                  size="sm"
                  colorScheme="blue"
                  as={Link}
                  href={`/teams/${team.name}/members`}
                >
                  View Members
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </SimpleGrid>
    </Container>
  );
}
