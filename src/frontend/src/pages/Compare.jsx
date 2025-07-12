import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { modelService } from '../services/modelService';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [versions, setVersions] = useState([]);
  const [version1, setVersion1] = useState(searchParams.get('v1') || '');
  const [version2, setVersion2] = useState(searchParams.get('v2') || '');
  const [comparison, setComparison] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchVersions();
  }, []);

  useEffect(() => {
    if (version1 && version2) {
      compareVersions();
    }
  }, [version1, version2]);

  const fetchVersions = async () => {
    try {
      const data = await modelService.listVersions();
      setVersions(data);
      if (!version2 && data.length > 0) {
        // If v2 not specified in URL, default to latest version
        setVersion2(data[0].version);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
      toast({
        title: 'Error fetching versions',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const compareVersions = async () => {
    try {
      const data = await modelService.compareVersions(version1, version2);
      setComparison(data);
    } catch (error) {
      console.error('Error comparing versions:', error);
      toast({
        title: 'Error comparing versions',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const performanceData = {
    labels: comparison?.timeline?.map(t => new Date(t.date).toLocaleDateString()) || [],
    datasets: [
      {
        label: version1,
        data: comparison?.metrics1?.timeline?.map(t => t.accuracy) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: version2,
        data: comparison?.metrics2?.timeline?.map(t => t.accuracy) || [],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const getDiffColor = (value) => {
    if (value > 0) return 'green.500';
    if (value < 0) return 'red.500';
    return 'gray.500';
  };

  const formatDiff = (value) => {
    if (value === 0) return '±0%';
    return `${value > 0 ? '+' : ''}${(value * 100).toFixed(2)}%`;
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Heading size="lg" mb={6}>Compare Model Versions</Heading>

      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={8}>
        <GridItem>
          <Select
            value={version1}
            onChange={(e) => setVersion1(e.target.value)}
            placeholder="Select Version 1"
          >
            {versions.map((v) => (
              <option key={v.version} value={v.version}>
                {v.version}
              </option>
            ))}
          </Select>
        </GridItem>
        <GridItem>
          <Select
            value={version2}
            onChange={(e) => setVersion2(e.target.value)}
            placeholder="Select Version 2"
          >
            {versions.map((v) => (
              <option key={v.version} value={v.version}>
                {v.version}
              </option>
            ))}
          </Select>
        </GridItem>
      </Grid>

      {comparison && (
        <>
          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Performance Comparison</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Metric</Th>
                    <Th>{version1}</Th>
                    <Th>{version2}</Th>
                    <Th>Difference</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Accuracy</Td>
                    <Td>{(comparison.metrics1.accuracy * 100).toFixed(2)}%</Td>
                    <Td>{(comparison.metrics2.accuracy * 100).toFixed(2)}%</Td>
                    <Td>
                      <Text color={getDiffColor(comparison.accuracy_diff)}>
                        {formatDiff(comparison.accuracy_diff)}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Loss</Td>
                    <Td>{comparison.metrics1.loss.toFixed(4)}</Td>
                    <Td>{comparison.metrics2.loss.toFixed(4)}</Td>
                    <Td>
                      <Text color={getDiffColor(-comparison.loss_diff)}>
                        {formatDiff(-comparison.loss_diff)}
                      </Text>
                    </Td>
                  </Tr>
                  <Tr>
                    <Td>Parameters</Td>
                    <Td>{comparison.metrics1.parameters.toLocaleString()}</Td>
                    <Td>{comparison.metrics2.parameters.toLocaleString()}</Td>
                    <Td>
                      <Text color={getDiffColor(comparison.parameters_diff)}>
                        {comparison.parameters_diff > 0 ? '+' : ''}{comparison.parameters_diff.toLocaleString()}
                      </Text>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </CardBody>
          </Card>

          <Card mb={6}>
            <CardHeader>
              <Heading size="md">Accuracy Over Time</Heading>
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
                        max: 1,
                      },
                    },
                  }}
                />
              </Box>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Model Changes</Heading>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Component</Th>
                    <Th>Change Type</Th>
                    <Th>Details</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {comparison.changes.map((change, index) => (
                    <Tr key={index}>
                      <Td>{change.component}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            change.type === 'added' ? 'green' :
                            change.type === 'removed' ? 'red' :
                            'yellow'
                          }
                        >
                          {change.type}
                        </Badge>
                      </Td>
                      <Td>{change.details}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </>
      )}
    </Container>
  );
}
