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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
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
} from '@chakra-ui/react';
import { FiUpload, FiMoreVertical, FiDownload, FiGitBranch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { modelService } from '../services/modelService';

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
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const data = await modelService.listVersions();
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        title: 'Error fetching models',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setIsUploading(true);
      await modelService.uploadModel(selectedFile, version, description);
      toast({
        title: 'Model uploaded successfully',
        status: 'success',
        duration: 3000,
      });
      onClose();
      fetchModels();
    } catch (error) {
      console.error('Error uploading model:', error);
      toast({
        title: 'Error uploading model',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCompare = (version1, version2) => {
    navigate(`/models/compare?v1=${version1}&v2=${version2}`);
  };

  const getStatusColor = (status) => {
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
          {models.map((model) => (
            <Tr key={model.version}>
              <Td fontWeight="medium">{model.version}</Td>
              <Td>{model.description}</Td>
              <Td>{new Date(model.created_at).toLocaleString()}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(model.status)}>
                  {model.status}
                </Badge>
              </Td>
              <Td>{model.accuracy ? `${(model.accuracy * 100).toFixed(2)}%` : 'N/A'}</Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={FiMoreVertical} />}
                    variant="ghost"
                    size="sm"
                  />
                  <MenuList>
                    <MenuItem
                      icon={<Icon as={FiDownload} />}
                      onClick={() => window.open(`/api/models/${model.version}/download`)}
                    >
                      Download
                    </MenuItem>
                    <MenuItem
                      icon={<Icon as={FiGitBranch} />}
                      onClick={() => handleCompare(model.version, models[0].version)}
                    >
                      Compare with Latest
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
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
              <Input type="file" onChange={handleFileChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Version</FormLabel>
              <Input
                placeholder="e.g., v1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="What's new in this version?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
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
