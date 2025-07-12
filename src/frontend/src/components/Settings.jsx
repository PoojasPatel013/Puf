import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  VStack,
  Divider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import {
  FiSave,
  FiTrash2,
  FiLock,
  FiUsers,
  FiGitBranch,
  FiAlertTriangle,
} from 'react-icons/fi';
import { modelService } from '../services/api';

export default function Settings() {
  const { owner, name } = useParams();
  const [settings, setSettings] = useState({
    name: '',
    description: '',
    visibility: 'public',
    defaultBranch: 'main',
    allowMergeCommit: true,
    allowSquashMerge: true,
    allowRebaseMerge: true,
    deleteBranchOnMerge: false,
    enableIssues: true,
    enableProjects: true,
    enableDiscussions: true,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await modelService.getRepositorySettings(owner, name);
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [owner, name]);

  const handleSave = async () => {
    try {
      await modelService.updateRepositorySettings(owner, name, settings);
      toast({
        title: 'Settings saved',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await modelService.deleteRepository(owner, name);
      toast({
        title: 'Repository deleted',
        status: 'success',
        duration: 3000,
      });
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error deleting repository',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const Section = ({ title, icon, children }) => (
    <Box mb={8}>
      <Heading size="md" mb={4} display="flex" alignItems="center">
        <Icon as={icon} mr={2} />
        {title}
      </Heading>
      {children}
    </Box>
  );

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        Repository Settings
      </Heading>

      <Box bg={bgColor} p={6} borderRadius="lg" border="1px" borderColor={borderColor}>
        <Section title="General" icon={FiGitBranch}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Repository name</FormLabel>
              <Input
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={settings.description}
                onChange={(e) =>
                  setSettings({ ...settings, description: e.target.value })
                }
              />
            </FormControl>
          </VStack>
        </Section>

        <Divider my={6} />

        <Section title="Access Control" icon={FiLock}>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Repository visibility</FormLabel>
              <Select
                value={settings.visibility}
                onChange={(e) =>
                  setSettings({ ...settings, visibility: e.target.value })
                }
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="internal">Internal</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Default branch</FormLabel>
              <Input
                value={settings.defaultBranch}
                onChange={(e) =>
                  setSettings({ ...settings, defaultBranch: e.target.value })
                }
              />
            </FormControl>
          </VStack>
        </Section>

        <Divider my={6} />

        <Section title="Features" icon={FiUsers}>
          <VStack spacing={4} align="stretch">
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Allow merge commits</FormLabel>
              <Switch
                isChecked={settings.allowMergeCommit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowMergeCommit: e.target.checked,
                  })
                }
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Allow squash merging</FormLabel>
              <Switch
                isChecked={settings.allowSquashMerge}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    allowSquashMerge: e.target.checked,
                  })
                }
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Enable issues</FormLabel>
              <Switch
                isChecked={settings.enableIssues}
                onChange={(e) =>
                  setSettings({ ...settings, enableIssues: e.target.checked })
                }
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Enable discussions</FormLabel>
              <Switch
                isChecked={settings.enableDiscussions}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enableDiscussions: e.target.checked,
                  })
                }
              />
            </FormControl>
          </VStack>
        </Section>

        <Divider my={6} />

        <Section title="Danger Zone" icon={FiAlertTriangle}>
          <Box
            p={4}
            border="1px"
            borderColor="red.500"
            borderRadius="md"
          >
            <Text mb={4}>
              Once you delete a repository, there is no going back. Please be
              certain.
            </Text>
            <Button
              colorScheme="red"
              leftIcon={<FiTrash2 />}
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete this repository
            </Button>
          </Box>
        </Section>

        <Box mt={8}>
          <Button
            colorScheme="blue"
            leftIcon={<FiSave />}
            onClick={handleSave}
            isLoading={loading}
          >
            Save changes
          </Button>
        </Box>
      </Box>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Repository</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
