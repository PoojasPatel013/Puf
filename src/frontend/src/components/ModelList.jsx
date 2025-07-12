import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
  Badge,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

export default function ModelList() {
  const [models, setModels] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:8000/models/versions');
      setModels(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching models',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%">
      <Heading size="md" mb={4}>Model Versions</Heading>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Version</Th>
              <Th>Created At</Th>
              <Th>Files</Th>
            </Tr>
          </Thead>
          <Tbody>
            {models.map((model, index) => (
              <Tr key={index}>
                <Td>
                  <Badge colorScheme="green">{model.version}</Badge>
                </Td>
                <Td>{new Date(model.created_at).toLocaleString()}</Td>
                <Td>{model.filename}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
