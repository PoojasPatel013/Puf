import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Input,
  Select,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import cliService from '../services/cliService';

export default function VersionControl() {
  const { user } = useAuth();
  const [commandOutput, setCommandOutput] = useState('');
  const [currentBranch, setCurrentBranch] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleCommand = async (command) => {
    try {
      setLoading(true);
      const result = await cliService.executeCommand(command);
      setCommandOutput(result.stdout || '');
      if (result.stderr) {
        toast({
          title: 'Error',
          description: result.stderr,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Success',
          description: 'Command executed successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInit = async () => {
    await handleCommand('puf init');
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a commit message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await handleCommand(`puf commit -m "${commitMessage}"`);
  };

  const handlePush = async () => {
    await handleCommand('puf push');
  };

  const handlePull = async () => {
    await handleCommand('puf pull');
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a branch name',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await handleCommand(`puf branch ${newBranchName}`);
  };

  const handleCheckout = async () => {
    if (!currentBranch) {
      toast({
        title: 'Error',
        description: 'Please select a branch',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    await handleCommand(`puf checkout ${currentBranch}`);
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <VStack spacing={4} align="stretch">
        <HStack spacing={2}>
          <Button
            colorScheme="blue"
            onClick={handleInit}
            isLoading={loading}
          >
            Initialize Repository
          </Button>
          <Button
            colorScheme="green"
            onClick={handlePush}
            isLoading={loading}
          >
            Push
          </Button>
          <Button
            colorScheme="blue"
            onClick={handlePull}
            isLoading={loading}
          >
            Pull
          </Button>
        </HStack>

        <VStack spacing={2} align="stretch">
          <Text>Commit Changes:</Text>
          <Input
            placeholder="Enter commit message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
          />
          <Button
            colorScheme="green"
            onClick={handleCommit}
            isLoading={loading}
          >
            Commit
          </Button>
        </VStack>

        <VStack spacing={2} align="stretch">
          <Text>Create Branch:</Text>
          <Input
            placeholder="Enter new branch name"
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
          />
          <Button
            colorScheme="purple"
            onClick={handleCreateBranch}
            isLoading={loading}
          >
            Create Branch
          </Button>
        </VStack>

        <VStack spacing={2} align="stretch">
          <Text>Switch Branch:</Text>
          <Select
            placeholder="Select branch"
            value={currentBranch}
            onChange={(e) => setCurrentBranch(e.target.value)}
          >
            <option value="main">main</option>
            <option value="development">development</option>
            <option value="feature">feature</option>
          </Select>
          <Button
            colorScheme="purple"
            onClick={handleCheckout}
            isLoading={loading}
          >
            Checkout
          </Button>
        </VStack>

        <Box mt={4} p={4} borderWidth="1px" borderRadius="lg">
          <Text mb={2}>Command Output:</Text>
          <Code whiteSpace="pre-wrap" p={2}>
            {commandOutput}
          </Code>
        </Box>
      </VStack>
    </Box>
  );
}
