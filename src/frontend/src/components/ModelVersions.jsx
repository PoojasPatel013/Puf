import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import {
  FiGitCommit,
  FiDownload,
  FiGitBranch,
  FiMoreVertical,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
import { modelService } from '../services/api';

export default function ModelVersions() {
  const { owner, name } = useParams();
  const toast = useToast();
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        const data = await modelService.getModelVersions(owner, name);
        setVersions(data);
      } catch (error) {
        toast({
          title: 'Error fetching versions',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, [owner, name]);

  const handleDownload = async (version) => {
    try {
      const url = await modelService.getVersionDownloadUrl(owner, name, version.id);
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: 'Error downloading version',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <Icon as={FiCheckCircle} color="green.500" />;
      case 'failed':
        return <Icon as={FiAlertCircle} color="red.500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Model Versions</Heading>
          <Text color="gray.500">{name}</Text>
        </Box>
        <Button leftIcon={<FiGitBranch />} colorScheme="blue">
          New Version
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Version</Th>
              <Th>Commit</Th>
              <Th>Status</Th>
              <Th>Performance</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {versions.map((version) => (
              <Tr key={version.id}>
                <Td>
                  <Flex align="center" gap={2}>
                    <Badge colorScheme="blue">{version.tag}</Badge>
                    {version.latest && (
                      <Badge colorScheme="green">Latest</Badge>
                    )}
                  </Flex>
                </Td>
                <Td>
                  <Flex align="center" gap={2}>
                    <Icon as={FiGitCommit} />
                    <Text>{version.commit.slice(0, 7)}</Text>
                  </Flex>
                </Td>
                <Td>{getStatusIcon(version.status)}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      version.performance > 0.8
                        ? 'green'
                        : version.performance > 0.6
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {(version.performance * 100).toFixed(1)}%
                  </Badge>
                </Td>
                <Td>{new Date(version.created_at).toLocaleDateString()}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiDownload />}
                      onClick={() => handleDownload(version)}
                    >
                      Download
                    </Button>
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        variant="ghost"
                        icon={<FiMoreVertical />}
                      />
                      <MenuList>
                        <MenuItem>Compare</MenuItem>
                        <MenuItem>View Details</MenuItem>
                        <MenuItem>Copy ID</MenuItem>
                      </MenuList>
                    </Menu>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
