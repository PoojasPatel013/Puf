import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Grid,
  GridItem,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Icon,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiDownload, FiGitBranch, FiActivity } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { modelService } from '../services/modelService';

export default function ModelDetail() {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [performance, setPerformance] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchModelData();
  }, [id]);

  const fetchModelData = async () => {
    try {
      const [modelData, metricsData, performanceData] = await Promise.all([
        modelService.getModelInfo(id),
        modelService.getModelMetrics(id),
        modelService.getModelPerformance(id)
      ]);
      setModel(modelData);
      setMetrics(metricsData);
      setPerformance(performanceData);
    } catch (error) {
      console.error('Error fetching model data:', error);
      toast({
        title: 'Error loading model data',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleDownload = () => {
    window.open(`/api/models/${id}/download`);
  };

  const handleCompare = () => {
    navigate(`/models/compare?v1=${id}`);
  };

  const performanceData = {
    labels: performance?.timeline?.map(t => new Date(t.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: 'Accuracy',
        data: performance?.timeline?.map(t => t.accuracy) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Loss',
        data: performance?.timeline?.map(t => t.loss) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  if (!model) {
    return null;
  }

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={2}>{model.version}</Heading>
          <Text color="gray.500">{model.description}</Text>
        </Box>
        <Flex gap={3}>
          <Button
            leftIcon={<Icon as={FiDownload} />}
            onClick={handleDownload}
          >
            Download
          </Button>
          <Button
            leftIcon={<Icon as={FiGitBranch} />}
            onClick={handleCompare}
          >
            Compare
          </Button>
        </Flex>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Status</StatLabel>
                <StatNumber>
                  <Badge
                    colorScheme={model.status === 'active' ? 'green' : 'yellow'}
                    fontSize="lg"
                  >
                    {model.status}
                  </Badge>
                </StatNumber>
                <StatHelpText>
                  Created {new Date(model.created_at).toLocaleString()}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Accuracy</StatLabel>
                <StatNumber>
                  {metrics?.accuracy ? `${(metrics.accuracy * 100).toFixed(2)}%` : 'N/A'}
                </StatNumber>
                <StatHelpText>
                  <Icon as={FiActivity} mr={1} />
                  Model Performance
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Parameters</StatLabel>
                <StatNumber>{metrics?.parameters?.toLocaleString() || 'N/A'}</StatNumber>
                <StatHelpText>Total trainable parameters</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Tabs>
        <TabList>
          <Tab>Performance</Tab>
          <Tab>Parameters</Tab>
          <Tab>Training History</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Performance Metrics</Heading>
              </CardHeader>
              <CardBody>
                <Box h="400px">
                  <Line
                    data={performanceData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </Box>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Model Parameters</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Parameter</Th>
                      <Th>Value</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {metrics?.parameters_detail?.map((param) => (
                      <Tr key={param.name}>
                        <Td>{param.name}</Td>
                        <Td>{param.value}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Training History</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Epoch</Th>
                      <Th>Loss</Th>
                      <Th>Accuracy</Th>
                      <Th>Val Loss</Th>
                      <Th>Val Accuracy</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {performance?.history?.map((epoch, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{epoch.loss.toFixed(4)}</Td>
                        <Td>{(epoch.accuracy * 100).toFixed(2)}%</Td>
                        <Td>{epoch.val_loss.toFixed(4)}</Td>
                        <Td>{(epoch.val_accuracy * 100).toFixed(2)}%</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
}
