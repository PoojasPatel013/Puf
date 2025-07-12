import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  useDisclosure,
  useColorModeValue,
  Icon,
  Text,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from 'react-icons/fi';
import { modelService } from '../services/api';

export default function Issues() {
  const { owner, name } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const data = await modelService.getIssues(owner, name);
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [owner, name]);

  const handleCreateIssue = async (formData) => {
    try {
      const newIssue = await modelService.createIssue(owner, name, formData);
      setIssues([newIssue, ...issues]);
      onClose();
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Icon as={FiAlertCircle} color="green.500" />;
      case 'closed':
        return <Icon as={FiCheckCircle} color="gray.500" />;
      case 'in_progress':
        return <Icon as={FiClock} color="yellow.500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge colorScheme="green">Open</Badge>;
      case 'closed':
        return <Badge colorScheme="gray">Closed</Badge>;
      case 'in_progress':
        return <Badge colorScheme="yellow">In Progress</Badge>;
      default:
        return null;
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' || issue.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Issues</Heading>
          <Text color="gray.500">{issues.length} issues</Text>
        </Box>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
          New Issue
        </Button>
      </Flex>

      <Flex gap={4} mb={6}>
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
        <Menu>
          <MenuButton as={Button} leftIcon={<FiFilter />}>
            {filter === 'all' ? 'All Issues' : `${filter} Issues`}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setFilter('all')}>All Issues</MenuItem>
            <MenuItem onClick={() => setFilter('open')}>Open Issues</MenuItem>
            <MenuItem onClick={() => setFilter('in_progress')}>
              In Progress
            </MenuItem>
            <MenuItem onClick={() => setFilter('closed')}>Closed Issues</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Author</Th>
              <Th>Created</Th>
              <Th>Updated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredIssues.map((issue) => (
              <Tr key={issue.id}>
                <Td>
                  <Flex align="center" gap={2}>
                    {getStatusIcon(issue.status)}
                    <Text>{issue.title}</Text>
                  </Flex>
                </Td>
                <Td>{getStatusBadge(issue.status)}</Td>
                <Td>{issue.author}</Td>
                <Td>{new Date(issue.created_at).toLocaleDateString()}</Td>
                <Td>{new Date(issue.updated_at).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input placeholder="Issue title" />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Describe the issue..." />
            </FormControl>
            <FormControl>
              <FormLabel>Priority</FormLabel>
              <Select>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={() => handleCreateIssue({})}>
              Create Issue
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
