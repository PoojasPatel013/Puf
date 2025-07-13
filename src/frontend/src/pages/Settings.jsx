import React, { useState } from 'react';
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
  InputLeftElement,
  Switch,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react';
import { FiSettings, FiLock, FiMail, FiUser, FiSun, FiMoon, FiDownload, FiUpload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertStatus, setAlertStatus] = useState('info');
  const [formData, setFormData] = useState({
    email: user?.email || '',
    theme: user?.theme || 'light',
    notifications: user?.notifications || true,
    autoDownload: user?.autoDownload || false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      setAlertMessage('Settings updated successfully');
      setAlertStatus('success');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage(error.message || 'Failed to update settings');
      setAlertStatus('error');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6}>Settings</Heading>

      {showAlert && (
        <Alert status={alertStatus} mb={4}>
          <AlertIcon />
          <AlertTitle>{alertMessage}</AlertTitle>
        </Alert>
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card bg={useColorModeValue('white', 'gray.800')} shadow="sm" rounded="lg">
          <CardHeader>
            <Heading size="md">Profile</Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMail} />
                    </InputLeftElement>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      isDisabled
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Theme</FormLabel>
                  <Flex align="center">
                    <Switch
                      name="theme"
                      isChecked={formData.theme === 'dark'}
                      onChange={(e) => {
                        handleChange(e);
                        const newTheme = e.target.checked ? 'dark' : 'light';
                        localStorage.setItem('theme', newTheme);
                      }}
                    />
                    <Text ml={2}>{formData.theme === 'dark' ? 'Dark' : 'Light'}</Text>
                  </Flex>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <Switch
                    name="notifications"
                    isChecked={formData.notifications}
                    onChange={handleChange}
                  />
                  <FormLabel ml={2} mb={0}>Enable Notifications</FormLabel>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <Switch
                    name="autoDownload"
                    isChecked={formData.autoDownload}
                    onChange={handleChange}
                  />
                  <FormLabel ml={2} mb={0}>Auto Download Models</FormLabel>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={loading}
                  leftIcon={<FiSettings />}
                >
                  Save Changes
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        <Card bg={useColorModeValue('white', 'gray.800')} shadow="sm" rounded="lg">
          <CardHeader>
            <Heading size="md">Security</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Button
                colorScheme="red"
                leftIcon={<FiLock />}
                onClick={() => window.location.href = '/change-password'}
              >
                Change Password
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiUpload />}
                onClick={() => window.location.href = '/upload-public-key'}
              >
                Upload SSH Key
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiDownload />}
                onClick={() => window.location.href = '/download-private-key'}
              >
                Download Private Key
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiUser />}
                onClick={() => window.location.href = '/2fa'}
              >
                Enable 2FA
              </Button>
            </VStack>
          </CardBody>
        </Card>

        <Card bg={useColorModeValue('white', 'gray.800')} shadow="sm" rounded="lg">
          <CardHeader>
            <Heading size="md">Account</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <Button
                colorScheme="blue"
                leftIcon={<FiSettings />}
                onClick={() => window.location.href = '/profile'}
              >
                Edit Profile
              </Button>
              <Button
                colorScheme="red"
                leftIcon={<FiUser />}
                onClick={handleLogout}
              >
                Log Out
              </Button>
              <Button
                colorScheme="red"
                variant="outline"
                leftIcon={<FiTrash />}
                onClick={() => window.location.href = '/delete-account'}
              >
                Delete Account
              </Button>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
