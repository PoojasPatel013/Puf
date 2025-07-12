import React, { useRef, useEffect, useState } from 'react';
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
  CircularProgress,
  CircularProgressLabel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Link,
  Spinner
} from '@chakra-ui/react';
import { FiPackage, FiGitBranch, FiGitPullRequest, FiTerminal, FiCopy, FiCode, FiGithub, FiUpload, FiBookOpen, FiChevronRight } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { modelService } from '../services/modelService';
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
import Logo from '../components/Logo';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, stat, icon, helpText, isLoading = false }) => {
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
      <Flex justifyContent="space-between" alignItems="center" h="full">
        <Box>
          <StatLabel fontWeight="medium" isTruncated>
            {title}
          </StatLabel>
          {isLoading ? (
            <Box display="flex" alignItems="center" justifyContent="center" h="60px">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="md"
              />
            </Box>
          ) : (
            <StatNumber fontSize="2xl" fontWeight="medium">
              {stat}
            </StatNumber>
          )}
          {helpText && (
            <StatHelpText>
              {helpText}
            </StatHelpText>
          )}
        </Box>
        <Box color={useColorModeValue('gray.800', 'gray.200')} alignContent="center">
          <Logo size="11" />
        </Box>
      </Flex>
    </Stat>
  );
};

export default function Dashboard() {
  const chartRef = useRef(null);
  const { user } = useAuth();
  const { hasCopied: hasCopiedInit, onCopy: onCopyInit } = useClipboard('pip install puf-cli');
  const [stats, setStats] = useState({
    modelVersions: 0,
    pullRequests: 0,
    modelSize: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const versions = await modelService.listVersions();
        const totalSize = versions.reduce((sum, version) => sum + (version.size || 0), 0);
        
        setStats({
          modelVersions: versions.length,
          pullRequests: 0,
          modelSize: totalSize / 1024 / 1024 / 1024,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Model Versions',
        data: Array(6).fill(stats.modelVersions),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Model Size (GB)',
        data: Array(6).fill(stats.modelSize),
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
          as={RouterLink}
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
          stat={stats.modelVersions}
          icon={FiGitBranch}
          helpText="Total uploaded versions"
          isLoading={stats.loading}
        />
        <StatCard
          title="Pull Requests"
          stat={stats.pullRequests}
          icon={FiGitPullRequest}
          helpText="Coming soon"
          isLoading={stats.loading}
        />
        <StatCard
          title="Model Size (GB)"
          stat={stats.modelSize.toFixed(2)}
          icon={FiPackage}
          helpText="Total storage used"
          isLoading={stats.loading}
        />
      </SimpleGrid>

      <Box mb={8}>
        <Heading size="md" mb={4}>Documentation</Heading>
        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading size="sm" as="span">Getting Started</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <List spacing={2}>
                <ListItem>
                  <ListIcon as={FiTerminal} color="blue.500" />
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    pip install puf-cli
                  </Code>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={onCopyInit}
                    ml={2}
                  >
                    <Icon as={FiCopy} />
                  </Button>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiGitPullRequest} color="blue.500" />
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf init
                  </Code>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => navigator.clipboard.writeText('puf init')}
                    ml={2}
                  >
                    <Icon as={FiCopy} />
                  </Button>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiUpload} color="blue.500" />
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf remote add origin http://localhost:8000
                  </Code>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => navigator.clipboard.writeText('puf remote add origin http://localhost:8000')}
                    ml={2}
                  >
                    <Icon as={FiCopy} />
                  </Button>
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading size="sm" as="span">Basic Commands</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <List spacing={2}>
                <ListItem>
                  <ListIcon as={FiPackage} color="blue.500" />
                  Add a model file:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf add model.h5
                  </Code>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiGitBranch} color="blue.500" />
                  Create a version:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf commit -m "Initial model"
                  </Code>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiUpload} color="blue.500" />
                  Push to remote:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf push
                  </Code>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiBookOpen} color="blue.500" />
                  View model history:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf log
                  </Code>
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading size="sm" as="span">Advanced Commands</Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <List spacing={2}>
                <ListItem>
                  <ListIcon as={FiGitPullRequest} color="blue.500" />
                  Compare versions:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf diff v1.0.0 v1.1.0
                  </Code>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiPackage} color="blue.500" />
                  List all models:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf ls
                  </Code>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiGitBranch} color="blue.500" />
                  Create a new branch:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf branch new-feature
                  </Code>
                </ListItem>
                <ListItem>
                  <ListIcon as={FiUpload} color="blue.500" />
                  Merge branches:
                  <Code colorScheme="blue" fontSize="sm" p={2} rounded="md">
                    puf merge feature-branch
                  </Code>
                </ListItem>
              </List>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>

      <Box>
        <Heading size="md" mb={4}>Model Performance</Heading>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </Box>
    </Container>
  );
}
