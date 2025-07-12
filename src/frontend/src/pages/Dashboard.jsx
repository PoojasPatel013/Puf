import React, { useRef, useEffect } from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  useClipboard,
  VStack,
  HStack,
  Icon,
  Code,
  Flex,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FiPackage, FiGitBranch, FiGitPullRequest, FiTerminal, FiCopy, FiCode, FiGithub, FiUpload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, stat, icon, helpText }) => {
  return (
    <Stat
      px={{ base: 4, md: 8 }}
      py={5}
      shadow="sm"
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      rounded="lg"
      bg={useColorModeValue('white', 'github.800')}
    >
      <Flex justifyContent="space-between">
        <Box pl={2}>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="medium">
            {stat}
          </StatNumber>
          {helpText && (
            <StatHelpText>
              {helpText}
            </StatHelpText>
          )}
        </Box>
        <Box my="auto" color={useColorModeValue('gray.800', 'gray.200')} alignContent="center">
          <Icon as={icon} w={8} h={8} />
        </Box>
      </Flex>
    </Stat>
  );
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={5} textAlign="center">
          <Alert status="error" mb={4}>
            <AlertIcon />
            Something went wrong
          </Alert>
          <Button onClick={() => window.location.reload()}>
            Reload page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default function Dashboard() {
  const chartRef = useRef(null);
  const { user } = useAuth();
  const { hasCopied: hasCopiedInit, onCopy: onCopyInit } = useClipboard('pip install puf-cli');
  const { hasCopied: hasCopiedSetup, onCopy: onCopySetup } = useClipboard('puf init && puf remote add origin http://localhost:8000');

  useEffect(() => {
    // Cleanup function for Chart.js
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Sample data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Model Versions',
        data: [4, 6, 8, 9, 12, 15],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Model Size (GB)',
        data: [1.2, 1.5, 2.1, 2.3, 2.8, 3.2],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Model Performance',
      },
    },
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Dashboard</Heading>
        <Button
          as={Link}
          to="/models/upload"
          colorScheme="blue"
          leftIcon={<Icon as={FiUpload} />}
        >
          Upload Model
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} mb={8}>
        <StatCard
          title="Model Versions"
          stat="12"
          icon={FiGitBranch}
          helpText="2 pending reviews"
        />
        <StatCard
          title="Pull Requests"
          stat="3"
          icon={FiGitPullRequest}
          helpText="1 needs your review"
        />
        <StatCard
          title="Model Size (GB)"
          stat="3.2"
          icon={FiPackage}
          helpText="Average size of all models"
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        <Box
          p={5}
          shadow="sm"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded="lg"
          bg={useColorModeValue('white', 'github.800')}
        >
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </Box>

        <Box
          p={5}
          shadow="sm"
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          rounded="lg"
          bg={useColorModeValue('white', 'github.800')}
        >
          <VStack align="stretch" spacing={4}>
            <Flex align="center">
              <Icon as={FiTerminal} w={6} h={6} mr={2} />
              <Heading size="md">Get Started with Puf CLI</Heading>
            </Flex>
            
            <Divider />
            
            <Box>
              <Text fontWeight="bold" mb={2}>1. Install Puf CLI</Text>
              <Flex align="center" bg={useColorModeValue('gray.100', 'gray.700')} p={2} rounded="md">
                <Code flex="1">pip install puf-cli</Code>
                <Button size="sm" onClick={onCopyInit} ml={2}>
                  <Icon as={FiCopy} />
                </Button>
              </Flex>
              {hasCopiedInit && <Text color="green.500" fontSize="sm" mt={1}>Copied!</Text>}
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>2. Initialize a Repository</Text>
              <Flex align="center" bg={useColorModeValue('gray.100', 'gray.700')} p={2} rounded="md">
                <Code flex="1">puf init && puf remote add origin http://localhost:8000</Code>
                <Button size="sm" onClick={onCopySetup} ml={2}>
                  <Icon as={FiCopy} />
                </Button>
              </Flex>
              {hasCopiedSetup && <Text color="green.500" fontSize="sm" mt={1}>Copied!</Text>}
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>3. Start Using Puf</Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                Track your first model:
              </Text>
              <Code display="block" whiteSpace="pre" p={2} mt={2} bg={useColorModeValue('gray.100', 'gray.700')} rounded="md">
                {'# Add a model file\npuf add model.h5\n\n# Create a version\npuf commit -m "Initial model"\n\n# Push to remote\npuf push'}
              </Code>
            </Box>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  );
}
