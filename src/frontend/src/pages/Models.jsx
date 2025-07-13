import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Badge,
  Flex,
  Input,
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
  useDisclosure,
  Icon,
  HStack,
  Text,
} from '@chakra-ui/react';
import { FiUpload, FiMoreVertical, FiDownload, FiGitBranch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import modelService from '../services/modelService';

export default function Models() {
  const [models, setModels] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await modelService.getModels();
      setModels(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load models',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await modelService.uploadModel(
        selectedFile,
        version || undefined,
        description || undefined
      );
      toast({
        title: 'Success',
        description: 'Model uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      loadModels();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to upload model',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompare = (version1, version2) => {
    navigate(`/models/compare?v1=${version1}&v2=${version2}`);
  };

  const getStatusColor = (status) => {
    if (!status) return 'gray';
    const colors = {
      active: 'green',
      pending: 'yellow',
      error: 'red',
    };
    return colors[status.toLowerCase()] || 'gray';
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Model Versions</Heading>
        <Button
          colorScheme="blue"
          leftIcon={<Icon as={FiUpload} />}
          onClick={onOpen}
        >
          Upload New Version
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Version</Th>
            <Th>Description</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Accuracy</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {models?.map((model) => (
            <Tr key={model.version}>
              <Td fontWeight="medium">{model.version}</Td>
              <Td>{model.description || 'N/A'}</Td>
              <Td>{model.created_at ? new Date(model.created_at).toLocaleString() : 'N/A'}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(model.status)}>
                  {model.status || 'N/A'}
                </Badge>
              </Td>
              <Td>{model.accuracy || 'N/A'}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleCompare(model.version, model.version)}
                  >
                    Compare
                  </Button>
                </HStack>
              </Td>
            </Tr>
          )) || (
            <Tr>
              <Td colSpan={6} textAlign="center">
                <Text>No models found</Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload New Model Version</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Model File</FormLabel>
              <Input
                type="file"
                onChange={handleFileChange}
                accept=".h5,.pt,.pth,.pkl,.pb"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Version (Optional)</FormLabel>
              <Input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="Auto-generated if not provided"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description (Optional)</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this model version"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={isUploading}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
