import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';

export default function UploadModel() {
  const [file, setFile] = useState(null);
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'No file selected',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('model_file', file);
    if (version) formData.append('version', version);
    if (description) formData.append('description', description);

    setIsLoading(true);
    try {
      await axios.post('http://localhost:8000/models/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: 'Model uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setFile(null);
      setVersion('');
      setDescription('');
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" width="100%">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel>Model File</FormLabel>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".h5,.pkl,.pt,.pth,.onnx,.pb"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Version</FormLabel>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g., v1.0.0"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Model description..."
            />
          </FormControl>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            type="submit"
            width="100%"
          >
            Upload Model
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
