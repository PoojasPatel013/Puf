import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Text,
  Badge,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiGitCommit, FiGitBranch, FiDownload, FiStar, FiShare2, FiAlertCircle } from 'react-icons/fi';
import { modelService } from '../services/api';
import FileExplorer from './repository/FileExplorer';
import ReadmeViewer from './repository/ReadmeViewer';
import PerformanceMetrics from './repository/PerformanceMetrics';
import Repository from './Repository';

export default function RepositoryPage() {
  const { owner, name } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState([]);
  const [readme, setReadme] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [commits, setCommits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [starred, setStarred] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const [repoData, filesData, readmeData, metricsData, commitsData, branchesData] = 
          await Promise.all([
            modelService.getRepository(owner, name),
            modelService.getFiles(owner, name),
            modelService.getReadme(owner, name),
            modelService.getMetrics(owner, name),
            modelService.getCommits(owner, name),
            modelService.getBranches(owner, name),
          ]);
        
        setRepo(repoData);
        setFiles(filesData);
        setReadme(readmeData);
        setMetrics(metricsData);
        setCommits(commitsData);
        setBranches(branchesData);
        setLoading(false);
      } catch (error) {
        toast({
          title: 'Error fetching repository data',
          description: error.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchRepoData();
  }, [owner, name]);

  const handleStar = async () => {
    try {
      await modelService.toggleStar(owner, name);
      setStarred(!starred);
      toast({
        title: starred ? 'Repository unstarred' : 'Repository starred',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDownload = async () => {
    try {
      const url = await modelService.getDownloadUrl(owner, name);
      window.open(url, '_blank');
    } catch (error) {
      toast({
        title: 'Error downloading repository',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">{name}</Heading>
          <Text color="gray.500">{repo?.description}</Text>
        </Box>
        <ButtonGroup>
          <Button
            leftIcon={<FiStar />}
            onClick={handleStar}
            variant={starred ? 'solid' : 'outline'}
            colorScheme="yellow"
          >
            {starred ? 'Starred' : 'Star'}
          </Button>
          <Menu>
            <MenuButton as={Button} rightIcon={<FiShare2 />}>
              Clone
            </MenuButton>
            <MenuList>
              <MenuItem>HTTPS</MenuItem>
              <MenuItem>SSH</MenuItem>
              <MenuItem>CLI</MenuItem>
            </MenuList>
          </Menu>
          <Button leftIcon={<FiDownload />} onClick={handleDownload}>
            Download
          </Button>
        </ButtonGroup>
      </Flex>

      <Flex gap={4} mb={6}>
        <Button
          size="sm"
          leftIcon={<FiGitBranch />}
          variant="ghost"
          onClick={() => navigate('branches')}
        >
          {branches.length} branches
        </Button>
        <Button
          size="sm"
          leftIcon={<FiGitCommit />}
          variant="ghost"
          onClick={() => navigate('commits')}
        >
          {commits.length} commits
        </Button>
        <Button
          size="sm"
          leftIcon={<FiAlertCircle />}
          variant="ghost"
          onClick={() => navigate('issues')}
        >
          {repo?.issues_count || 0} issues
        </Button>
      </Flex>

      <Box bg={bgColor} borderRadius="lg" border="1px" borderColor={borderColor}>
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList px={4}>
            <Tab>Files</Tab>
            <Tab>README</Tab>
            <Tab>Performance</Tab>
            <Tab>Versions</Tab>
            <Tab>Repository</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <FileExplorer files={files} owner={owner} repo={name} />
            </TabPanel>
            <TabPanel>
              <ReadmeViewer content={readme} />
            </TabPanel>
            <TabPanel>
              <PerformanceMetrics metrics={metrics} />
            </TabPanel>
            <TabPanel>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Version</Th>
                    <Th>Date</Th>
                    <Th>Description</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {repo?.versions?.map((version) => (
                    <Tr key={version.id}>
                      <Td>
                        <Badge colorScheme="blue">{version.tag}</Badge>
                      </Td>
                      <Td>{new Date(version.created_at).toLocaleDateString()}</Td>
                      <Td>{version.description}</Td>
                      <Td>
                        <ButtonGroup size="sm">
                          <Button>Download</Button>
                          <Button>Compare</Button>
                        </ButtonGroup>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TabPanel>
            <TabPanel>
              <Repository repo={{
                name: repo.name,
                description: repo.description,
                language: repo.language,
                branches: repo.branches,
                views: repo.views,
                starred: starred,
              }} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}
